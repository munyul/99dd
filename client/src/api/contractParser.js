function captureFromText(text, pattern, group = 1) {
  const match = text.match(new RegExp(pattern, "i"));
  const value = match?.[group]?.trim() ?? "";
  return value.replace(/^[：:\s]+|[：:\s]+$/g, "");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function createWhitespaceMap(text) {
  const indices = [];
  let normalized = "";
  let lastWasSpace = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (/\s/.test(char)) {
      if (!lastWasSpace && normalized.length > 0) {
        normalized += " ";
        indices.push(i);
        lastWasSpace = true;
      }
      continue;
    }

    normalized += char;
    indices.push(i);
    lastWasSpace = false;
  }

  return { normalized: normalized.trim(), indices };
}

function buildMatch(contractText, start, end) {
  return {
    start,
    end,
    text: contractText.slice(start, end),
  };
}

function matchByFlexibleWhitespace(contractText, quote) {
  const pattern = escapeRegExp(quote.trim()).replace(/\s+/g, "\\s+");
  const match = contractText.match(new RegExp(pattern, "u"));

  if (!match || match.index === undefined) return null;

  return buildMatch(
    contractText,
    match.index,
    match.index + match[0].length,
  );
}

function matchByCollapsedWhitespace(contractText, quote) {
  const contractMap = createWhitespaceMap(contractText);
  const quoteMap = createWhitespaceMap(quote);

  if (!quoteMap.normalized) return null;

  const collapsedIndex = contractMap.normalized.indexOf(quoteMap.normalized);
  if (collapsedIndex === -1) return null;

  const start = contractMap.indices[collapsedIndex];
  const endIndex = collapsedIndex + quoteMap.normalized.length - 1;
  const end = contractMap.indices[endIndex] + 1;

  return buildMatch(contractText, start, end);
}

function matchByIgnoringAllWhitespace(contractText, quote) {
  const compactQuote = quote.replace(/\s+/g, "");
  if (!compactQuote) return null;

  const indices = [];
  let compactContract = "";

  for (let i = 0; i < contractText.length; i += 1) {
    const char = contractText[i];
    if (/\s/.test(char)) continue;

    compactContract += char;
    indices.push(i);
  }

  const compactIndex = compactContract.indexOf(compactQuote);
  if (compactIndex === -1) return null;

  const start = indices[compactIndex];
  const end = indices[compactIndex + compactQuote.length - 1] + 1;

  return buildMatch(contractText, start, end);
}

function tryMatchQuote(contractText, quote) {
  const candidates = [
    quote,
    quote.trim(),
    quote.replace(/\s+/g, " "),
    normalizeContractText(quote),
  ].filter((value, index, list) => value && list.indexOf(value) === index);

  for (const candidate of candidates) {
    const exactIndex = contractText.indexOf(candidate);
    if (exactIndex !== -1) {
      return buildMatch(
        contractText,
        exactIndex,
        exactIndex + candidate.length,
      );
    }

    const flexibleMatch = matchByFlexibleWhitespace(contractText, candidate);
    if (flexibleMatch) return flexibleMatch;
  }

  const collapsedMatch = matchByCollapsedWhitespace(contractText, quote);
  if (collapsedMatch) return collapsedMatch;

  const compactMatch = matchByIgnoringAllWhitespace(contractText, quote);
  if (compactMatch) return compactMatch;

  return null;
}

export function findQuoteInContract(contractText, quote) {
  if (!quote?.trim() || !contractText) return null;

  const tried = new Set();
  const queue = [quote.trim()];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || tried.has(current)) continue;

    tried.add(current);

    const directMatch = tryMatchQuote(contractText, current);
    if (directMatch) return directMatch;

    // 더 짧은 fragment만 시도 (동일 길이 재시도 방지 → 무한 재귀 차단)
    const fragments = current
      .split(/[,.;!?。]\s*|\n+/)
      .map((part) => part.trim())
      .filter((part) => part.length >= 8 && part.length < current.length);

    fragments
      .sort((a, b) => b.length - a.length)
      .forEach((fragment) => {
        if (!tried.has(fragment)) {
          queue.push(fragment);
        }
      });
  }

  return null;
}

export function alignClausesWithContract(contractText, clauses) {
  if (!Array.isArray(clauses)) return [];

  if (!contractText?.trim()) {
    return clauses
      .map((clause) => ({
        ...clause,
        quote: clause.quote || clause.contractText || "",
        contractText: clause.quote || clause.contractText || "",
      }))
      .filter((clause) => clause.quote?.trim());
  }

  const aligned = [];
  const usedRanges = [];

  for (const clause of clauses) {
    const rawQuote = clause.quote || clause.contractText;
    if (!rawQuote?.trim()) continue;

    const match = findQuoteInContract(contractText, rawQuote);
    if (!match) continue;

    const overlaps = usedRanges.some(
      (range) => match.start < range.end && match.end > range.start,
    );
    if (overlaps) continue;

    usedRanges.push({ start: match.start, end: match.end });
    aligned.push({
      ...clause,
      quote: match.text,
      contractText: match.text,
    });
  }

  return aligned;
}

export function buildContractAnalysisPresentation(contractText, clauses) {
  const alignedClauses = alignClausesWithContract(contractText, clauses);
  const segments = buildHighlightSegments(contractText, alignedClauses);

  return {
    clauses: alignedClauses,
    segments,
  };
}

export function buildHighlightSegments(contractText, clauses) {
  if (!contractText) {
    return clauses.flatMap((clause) =>
      clause.quote || clause.contractText
        ? [{
            text: clause.quote || clause.contractText,
            clauseId: clause.id,
            severity: clause.severity,
          }]
        : [],
    );
  }

  const matches = clauses
    .map((clause) => {
      const quote = clause.quote || clause.contractText;
      const match = findQuoteInContract(contractText, quote);
      if (!match) return null;

      return {
        ...match,
        clauseId: clause.id,
        severity: clause.severity,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.start - b.start || b.end - a.end);

  const nonOverlapping = [];
  let lastEnd = 0;

  for (const match of matches) {
    if (match.start < lastEnd) continue;
    nonOverlapping.push(match);
    lastEnd = match.end;
  }

  if (nonOverlapping.length === 0) {
    return [{ text: contractText }];
  }

  const segments = [];
  let cursor = 0;

  for (const match of nonOverlapping) {
    if (match.start > cursor) {
      segments.push({ text: contractText.slice(cursor, match.start) });
    }

    segments.push({ text: match.text, clauseId: match.clauseId, severity: match.severity });
    cursor = match.end;
  }

  if (cursor < contractText.length) {
    segments.push({ text: contractText.slice(cursor) });
  }

  return segments;
}

export function normalizeContractText(text) {
  if (!text?.trim()) return "";

  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/ ?\n ?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function extractReviewFieldsFromContract(contractText) {
  if (!contractText?.trim()) {
    return {
      companyName: "",
      startDate: "",
      hourlyWage: "",
    };
  }

  const compact = contractText.replace(/[ \t]+/g, " ");

  const companyName =
    captureFromText(
      compact,
      "(?:회사명|사업장명|상호|사용자|고용주)\\s*[:：]?\\s*([^\\n,]{2,50})",
    ) ||
    captureFromText(
      compact,
      "사용자\\s*\\([^)]*\\)\\s*[:：]?\\s*([^\\n,]{2,50})",
    ) ||
    captureFromText(compact, "((?:\\(주\\)|㈜)[^\\n,\\s]{1,30})");

  const startDate =
    captureFromText(
      compact,
      "(?:근무\\s*시작일|입사일|계약\\s*시작일|근로\\s*개시일|근로개시일|개시일|시작일)\\s*[:：]?\\s*([^\\n]{4,30})",
    ) ||
    captureFromText(
      compact,
      "(\\d{4}\\s*년\\s*\\d{1,2}\\s*월\\s*\\d{1,2}\\s*일)",
    ) ||
    captureFromText(compact, "(\\d{4}[.\\-/]\\d{1,2}[.\\-/]\\d{1,2})");

  const hourlyWage =
    captureFromText(compact, "(?:시급|시간급)\\s*[:：]?\\s*([\\d,]+\\s*원?)") ||
    captureFromText(compact, "시급\\s+([\\d,]+\\s*원?)") ||
    captureFromText(compact, "시급\\s*([\\d,]+)");

  return {
    companyName,
    startDate: startDate.replace(/\s*부터.*$/u, "").trim(),
    hourlyWage: hourlyWage.includes("원")
      ? hourlyWage
      : hourlyWage
        ? `${hourlyWage}원`
        : "",
  };
}

export function structureOcrContract(ocrText) {
  const contractText = normalizeContractText(ocrText);

  return {
    ...extractReviewFieldsFromContract(contractText),
    contractText,
  };
}
