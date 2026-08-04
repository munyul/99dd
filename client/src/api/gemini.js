import Anthropic from "@anthropic-ai/sdk";
import { alignClausesWithContract } from "./contractParser.js";

// CRA(process.env)와 Vite(import.meta.env) 환경 모두 대응 (클로드 API 키명 반영)
const API_KEY =
  (typeof process !== "undefined" &&
    process.env?.REACT_APP_ANTHROPIC_API_KEY) ||
  (typeof import.meta !== "undefined" &&
    import.meta.env?.VITE_ANTHROPIC_API_KEY) ||
  "";

const HAIKU_MODEL = "claude-haiku-4-5-20251001";
// clause 최대 8개 + 긴 quote 포함 시 출력 약 2,500 토큰 → 잘림 방지 여유
const ANALYSIS_MAX_TOKENS = 2000;

if (!API_KEY) {
  console.error(
    "Anthropic API Key가 설정되지 않았습니다. 환경변수를 확인해주세요.",
  );
}

const anthropic = new Anthropic({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true, // 프론트엔드 환경에서 직접 호출하기 위해 필요합니다.
});

function extractJsonText(responseText) {
  let text = responseText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");

  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    text = text.substring(jsonStart, jsonEnd + 1);
  }

  return text;
}

function repairJsonText(raw) {
  let text = raw
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\uFEFF/g, "")
    .trim();

  // 객체/배열 끝의 트레일링 쉼표 제거
  text = text.replace(/,\s*([}\]])/g, "$1");

  // 같은 줄/다음 줄에서 문자열 값 뒤 키가 바로 올 때 쉼표 보정: "value" "key"
  text = text.replace(/("(?:\\.|[^"\\])*")\s+(?=")/g, "$1, ");

  // 객체/배열 요소 사이 누락 쉼표 보정
  text = text.replace(/}\s*{/g, "},{");
  text = text.replace(/]\s*\[/g, "],[");
  text = text.replace(/([}\]])\s*"/g, '$1,"');
  text = text.replace(/("(?:\\.|[^"\\])*")\s*\n(\s*")/g, "$1,\n$2");
  text = text.replace(
    /((?:true|false|null|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?))\s*\n(\s*")/g,
    "$1,\n$2",
  );
  text = text.replace(/([}\]])\s*\n(\s*")/g, "$1,\n$2");

  return text;
}

function repairTruncatedJson(raw) {
  let text = repairJsonText(raw).trim();

  // 마지막에 덜 쓴 속성/객체 조각 제거
  text = text
    .replace(/,\s*"[^"]*"\s*:\s*"[^"]*$/u, "")
    .replace(/,\s*"[^"]*"\s*:\s*$/u, "")
    .replace(/,\s*\{[^}]*$/u, "")
    .replace(/,\s*$/u, "");

  let inString = false;
  let escaped = false;
  let braceCount = 0;
  let bracketCount = 0;

  for (const char of text) {
    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\" && inString) {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === "{") braceCount += 1;
    if (char === "}") braceCount -= 1;
    if (char === "[") bracketCount += 1;
    if (char === "]") bracketCount -= 1;
  }

  if (inString) {
    text += '"';
  }

  while (bracketCount > 0) {
    text += "]";
    bracketCount -= 1;
  }

  while (braceCount > 0) {
    text += "}";
    braceCount -= 1;
  }

  return text;
}

function salvageClausesFromText(text) {
  const clausePattern =
    /\{[^{}]*"id"\s*:\s*"([^"]+)"[^{}]*"severity"\s*:\s*"([^"]+)"[^{}]*"quote"\s*:\s*"((?:\\.|[^"\\])*)"[^{}]*"title"\s*:\s*"((?:\\.|[^"\\])*)"[^{}]*"description"\s*:\s*"((?:\\.|[^"\\])*)"[^{}]*"lawStandard"\s*:\s*"((?:\\.|[^"\\])*)"[^{}]*"reference"\s*:\s*"((?:\\.|[^"\\])*)"[^{}]*\}/g;

  const clauses = [];
  let match = clausePattern.exec(text);

  while (match) {
    clauses.push({
      id: match[1],
      severity: match[2],
      quote: match[3].replace(/\\"/g, '"').replace(/\\\\/g, "\\"),
      title: match[4].replace(/\\"/g, '"').replace(/\\\\/g, "\\"),
      description: match[5].replace(/\\"/g, '"').replace(/\\\\/g, "\\"),
      lawStandard: match[6].replace(/\\"/g, '"').replace(/\\\\/g, "\\"),
      reference: match[7].replace(/\\"/g, '"').replace(/\\\\/g, "\\"),
    });
    match = clausePattern.exec(text);
  }

  return clauses.length > 0 ? { clauses } : null;
}

function parseClaudeJson(responseText) {
  const extracted = extractJsonText(responseText);
  const attempts = [
    extracted,
    repairJsonText(extracted),
    repairTruncatedJson(extracted),
  ];

  let lastError = null;

  for (const candidate of attempts) {
    try {
      return JSON.parse(candidate);
    } catch (error) {
      lastError = error;
    }
  }

  const salvaged = salvageClausesFromText(extracted);
  if (salvaged) {
    console.warn("JSON 전체 파싱 실패, 완성된 clauses만 복구했습니다.", lastError);
    return salvaged;
  }

  console.error("JSON 원문:", extracted);
  console.error("JSON 보정본:", repairTruncatedJson(extracted));
  throw lastError ?? new Error("Claude JSON 파싱에 실패했습니다.");
}

function extractResponseText(response, maxTokens) {
  const textBlock = response.content?.find((block) => block.type === "text");

  if (!textBlock?.text) {
    throw new Error("Claude 응답에 텍스트가 없습니다.");
  }

  if (response.stop_reason === "max_tokens") {
    console.warn(
      `Claude 응답이 max_tokens(${maxTokens}) 한도로 잘렸습니다. output_tokens:`,
      response.usage?.output_tokens,
    );
  }

  return textBlock.text;
}

async function requestJsonFromClaude(prompt, maxTokens) {
  const response = await anthropic.messages.create({
    model: HAIKU_MODEL,
    max_tokens: maxTokens,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return parseClaudeJson(extractResponseText(response, maxTokens));
}

export async function analyzeContractText(contractText) {
  try {
    const prompt = `
너는 10년 차 공인노무사야. 아래 '계약서 전문'을 읽고 근로기준법 위반 및 독소조항을 분석해 줘.
참고로 이 텍스트는 OCR로 인식된 결과일 수 있으므로, 문맥상 명백한 오타나 맞춤법 오류가 있더라도 문맥을 유추하여 정확히 분석해 줘.

[중요 규칙]
1. 계약서 전체를 다시 출력하지 마. segments 배열은 만들지 마.
2. 분석이 필요한 문장만 quote로 추출해. quote는 [분석할 계약서 전문]에 실제로 있는 문자열을 한 글자도 바꾸지 않고 그대로 복사해야 해. paraphrase, 요약, 맞춤법 수정 금지.
3. clauses 배열에 quote와 분석 결과만 담아. severity는 "danger", "caution", "safe" 중 하나.
4. 가장 중요한 항목 위주로 최대 8개까지만 포함해.
5. quote가 계약서 전문에 없으면 해당 clause를 만들지 마.

[분석할 계약서 전문]
${contractText}

[출력 JSON 구조]
{
  "clauses": [
    {
      "id": "working-hours",
      "severity": "safe",
      "quote": "근로자의 근무시간은 09:00~18:00로 한다.",
      "title": "근무시간이 명확해요",
      "description": "근무 시작과 종료 시간이 구체적으로 작성되어 있어 확인하기 쉬워요.",
      "lawStandard": "사용자는 근로계약을 체결할 때 소정근로시간을 명시해야 해요.",
      "reference": "근로기준법 제17조 기준 충족 가능"
    }
  ]
}

반드시 유효한 표준 JSON 형식으로만 응답해 주세요. 배열과 객체 요소 사이의 쉼표(,)와 따옴표를 빠뜨리지 않도록 주의하세요. JSON 외의 설명 문장은 절대 포함하지 마세요.
`;

    const result = await requestJsonFromClaude(prompt, ANALYSIS_MAX_TOKENS);
    const clauses = alignClausesWithContract(
      contractText,
      result.clauses || [],
    );

    return { clauses };
  } catch (error) {
    console.error("Claude API 호출 상세 에러:", error);

    const apiMessage =
      error?.error?.message || error?.message || "알 수 없는 오류";
    throw new Error(`계약서 분석 중 오류가 발생했습니다. (${apiMessage})`);
  }
}
