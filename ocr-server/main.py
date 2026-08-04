from __future__ import annotations

import io
import os
import re
import tempfile
import threading
import time
import uuid
from pathlib import Path
from typing import Any

import fitz
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from starlette.concurrency import run_in_threadpool

APP_DIR = Path(__file__).resolve().parent
MAX_FILE_SIZE = 20 * 1024 * 1024
MAX_PDF_PAGES = 10
PDF_RENDER_DPI = 144
OCR_MAX_IMAGE_WIDTH = 1400
ALLOWED_SUFFIXES = {".pdf", ".jpg", ".jpeg", ".png"}

MODEL_LOCK = threading.Lock()
_OCR_MODEL = None

app = FastAPI(title="Contract OCR Server")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_ocr_model():
    global _OCR_MODEL
    if _OCR_MODEL is None:
        from paddleocr import PaddleOCR

        _OCR_MODEL = PaddleOCR(
            lang="korean",
            use_doc_orientation_classify=False,
            use_doc_unwarping=False,
            use_textline_orientation=False,
        )
    return _OCR_MODEL


@app.on_event("startup")
async def warmup_ocr_model() -> None:
    """첫 요청 지연을 줄이기 위해 서버 시작 시 모델을 미리 로드합니다."""
    await run_in_threadpool(get_ocr_model)


@app.get("/health")
def health() -> dict[str, bool]:
    return {"ok": True}


def validate_file(upload: UploadFile, raw_bytes: bytes) -> str:
    if not upload.filename:
        raise HTTPException(400, "파일 이름이 없습니다.")

    suffix = Path(upload.filename).suffix.lower()
    if suffix not in ALLOWED_SUFFIXES:
        raise HTTPException(400, "지원하지 않는 파일 형식입니다.")

    if len(raw_bytes) == 0:
        raise HTTPException(400, "빈 파일은 업로드할 수 없습니다.")

    if len(raw_bytes) > MAX_FILE_SIZE:
        raise HTTPException(400, "파일 크기는 20MB를 초과할 수 없습니다.")

    return suffix


def pdf_to_images(source_path: Path, work_dir: Path) -> list[Path]:
    image_paths: list[Path] = []

    with fitz.open(source_path) as document:
        if document.page_count > MAX_PDF_PAGES:
            raise HTTPException(400, f"PDF는 최대 {MAX_PDF_PAGES}페이지까지 지원합니다.")

        matrix = fitz.Matrix(PDF_RENDER_DPI / 72, PDF_RENDER_DPI / 72)

        for page_index in range(document.page_count):
            page = document.load_page(page_index)
            pixmap = page.get_pixmap(matrix=matrix, alpha=False)
            image_path = work_dir / f"page-{page_index + 1}.png"
            pixmap.save(image_path)
            image_paths.append(image_path)

    return image_paths


def prepare_image_for_ocr(image_path: Path, work_dir: Path) -> Path:
    """OCR 속도를 위해 과도하게 큰 이미지는 축소합니다."""
    with Image.open(image_path) as image:
        rgb_image = image.convert("RGB")
        if rgb_image.width <= OCR_MAX_IMAGE_WIDTH:
            return image_path

        ratio = OCR_MAX_IMAGE_WIDTH / rgb_image.width
        resized = rgb_image.resize(
            (OCR_MAX_IMAGE_WIDTH, max(1, int(rgb_image.height * ratio))),
            Image.Resampling.LANCZOS,
        )
        optimized_path = work_dir / f"optimized-{image_path.stem}.png"
        resized.save(optimized_path, format="PNG", optimize=True)
        return optimized_path


def _extract_texts_from_predict_result(result: Any) -> list[str]:
    texts: list[str] = []

    if result is None:
        return texts

    if isinstance(result, dict):
        rec_texts = result.get("rec_texts")
        if rec_texts:
            return [str(text).strip() for text in rec_texts if str(text).strip()]

    if hasattr(result, "rec_texts"):
        rec_texts = result.rec_texts
        if rec_texts:
            return [str(text).strip() for text in rec_texts if str(text).strip()]

    if isinstance(result, (list, tuple)):
        for item in result:
            if isinstance(item, (list, tuple)) and len(item) >= 2:
                text_part = item[1]
                if isinstance(text_part, (list, tuple)) and text_part:
                    text = str(text_part[0]).strip()
                    if text:
                        texts.append(text)
                elif isinstance(text_part, str) and text_part.strip():
                    texts.append(text_part.strip())
            else:
                texts.extend(_extract_texts_from_predict_result(item))

    return texts


def run_ocr(image_paths: list[Path], work_dir: Path) -> list[dict[str, Any]]:
    model = get_ocr_model()
    lines: list[dict[str, Any]] = []

    # The local predictor is expensive and should not serve concurrent requests.
    with MODEL_LOCK:
        for page_number, image_path in enumerate(image_paths, start=1):
            optimized_path = prepare_image_for_ocr(image_path, work_dir)
            for result in model.predict(str(optimized_path)):
                for text in _extract_texts_from_predict_result(result):
                    lines.append({"page": page_number, "text": text})

    return lines


def lines_to_contract_text(lines: list[dict[str, Any]]) -> str:
    return "\n".join(line["text"] for line in lines if line.get("text"))


def extract_review_fields(contract_text: str) -> dict[str, str]:
    """Best-effort summary fields. The user can correct them on screen 10."""
    compact = re.sub(r"[ \t]+", " ", contract_text)

    def capture(*patterns: str) -> str:
        for pattern in patterns:
            match = re.search(pattern, compact, flags=re.IGNORECASE)
            if match:
                return match.group(1).strip(" :：")
        return ""

    hourly_wage = capture(
        r"(?:시급|시간급)\s*[:：]?\s*([\d,]+\s*원?)",
        r"시급\s+([\d,]+\s*원?)",
        r"시급\s*([\d,]+)",
    )
    if hourly_wage and "원" not in hourly_wage:
        hourly_wage = f"{hourly_wage}원"

    start_date = capture(
        r"(?:근무\s*시작일|입사일|계약\s*시작일|근로\s*개시일|근로개시일|개시일|시작일)\s*[:：]?\s*([^\n]{4,30})",
        r"(\d{4}\s*년\s*\d{1,2}\s*월\s*\d{1,2}\s*일)",
        r"(\d{4}[.\-/]\d{1,2}[.\-/]\d{1,2})",
    )

    return {
        "companyName": capture(
            r"(?:회사명|사업장명|상호|사용자|고용주)\s*[:：]?\s*([^\n,]{2,50})",
            r"((?:\(주\)|㈜)[^\n,\s]{1,30})",
        ),
        "startDate": re.sub(r"\s*부터.*$", "", start_date).strip(),
        "hourlyWage": hourly_wage,
    }


@app.post("/api/ocr")
async def ocr_contract(file: UploadFile = File(...)) -> dict[str, str]:
    raw_bytes = await file.read()
    suffix = validate_file(file, raw_bytes)
    started_at = time.perf_counter()

    with tempfile.TemporaryDirectory(prefix="contract-ocr-", dir=APP_DIR) as temp_dir:
        work_dir = Path(temp_dir)
        source_path = work_dir / f"upload-{uuid.uuid4().hex}{suffix}"
        source_path.write_bytes(raw_bytes)
        image_paths = pdf_to_images(source_path, work_dir) if suffix == ".pdf" else [source_path]
        try:
            lines = await run_in_threadpool(run_ocr, image_paths, work_dir)
        except HTTPException:
            raise
        except Exception as error:
            print(f"OCR failed: {error}")
            raise HTTPException(500, "텍스트 인식 중 오류가 발생했습니다.") from None

    elapsed_ms = int((time.perf_counter() - started_at) * 1000)
    print(f"OCR completed in {elapsed_ms}ms ({len(image_paths)} page(s))")

    contract_text = lines_to_contract_text(lines)
    if not contract_text.strip():
        raise HTTPException(422, "계약서에서 텍스트를 찾지 못했습니다.")

    fields = extract_review_fields(contract_text)
    return {
        "companyName": fields["companyName"],
        "startDate": fields["startDate"],
        "hourlyWage": fields["hourlyWage"],
        "contractText": contract_text,
    }
