const OCR_API_BASE = (
  import.meta.env.VITE_OCR_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

export async function recognizeContract(file, signal) {
  const formData = new FormData();
  formData.append("file", file);

  let response;

  try {
    response = await fetch(`${OCR_API_BASE}/api/ocr`, {
      method: "POST",
      body: formData,
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error(
      "OCR 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.",
    );
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.detail || "텍스트 인식에 실패했습니다.");
  }

  return payload;
}
