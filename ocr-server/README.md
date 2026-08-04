# Contract OCR Server

PaddleOCR 기반 근로계약서 OCR API 서버입니다.

## 설치

```bash
cd ocr-server
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

## 실행

```bash
cd ocr-server
source .venv/bin/activate
PADDLE_PDX_CACHE_HOME=.paddlex uvicorn main:app --reload --port 8000
```

가상환경 없이 직접 실행:

```bash
PADDLE_PDX_CACHE_HOME=.paddlex .venv/bin/python -m uvicorn main:app --reload --port 8000
```

## API

- `GET /health` → `{"ok": true}`
- `POST /api/ocr` (multipart `file`) → `{ companyName, startDate, hourlyWage, contractText }`

지원 형식: PDF, JPG, JPEG, PNG (최대 20MB, PDF 최대 10페이지)

## 클라이언트 연동

- OCR URL: `client/.env.development` → `VITE_OCR_API_URL=http://localhost:8000`
- Anthropic API 키: `client/.env.local` → `VITE_ANTHROPIC_API_KEY=...` (gitignore)

## 최적화

- 서버 시작 시 PaddleOCR 모델 pre-warm
- PDF 렌더링 144 DPI
- 1400px 초과 이미지 자동 축소
