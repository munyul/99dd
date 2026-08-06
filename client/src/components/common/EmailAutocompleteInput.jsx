// ===============================================
// 이메일 자동완성 입력 컴포넌트
// '@'을 입력하면 국내에서 자주 쓰는 이메일 도메인 목록을 보여주고,
// 클릭 한 번으로 뒷부분(도메인)을 채워 넣을 수 있습니다.
// ===============================================
import { useMemo, useState } from "react";

// 국내에서 자주 쓰이는 이메일 도메인 목록 (자주 쓰는 순서로 정렬)
const EMAIL_DOMAINS = [
  "naver.com",
  "gmail.com",
  "daum.net",
  "kakao.com",
  "hanmail.net",
  "nate.com",
  "outlook.com",
  "icloud.com",
  "hotmail.com",
  "yahoo.com",
];

/**
 * EmailAutocompleteInput 컴포넌트
 * @param {Object} props
 * @param {string} props.value - 현재 입력값 (제어 컴포넌트)
 * @param {(nextValue: string) => void} props.onChange - 값이 바뀔 때 호출되는 콜백 (문자열 값을 그대로 전달)
 * @param {string} [props.placeholder]
 * @param {Object} [props.style] - input에 적용할 스타일 (기존 프로젝트의 inputStyle 재사용 가능)
 */
export default function EmailAutocompleteInput({
  value = "",
  onChange,
  placeholder = "example@email.com",
  style,
  ...rest
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const atIndex = value.indexOf("@");
  const localPart = atIndex >= 0 ? value.slice(0, atIndex) : value;
  const domainQuery = atIndex >= 0 ? value.slice(atIndex + 1) : "";

  // '@' 뒤에 입력된 글자와 일치하는 도메인만 추천 목록으로 보여줍니다.
  const suggestions = useMemo(() => {
    if (atIndex < 0 || localPart.length === 0) return [];

    const filtered = EMAIL_DOMAINS.filter((domain) => domain.startsWith(domainQuery));

    // 이미 도메인까지 정확히 입력된 경우에는 추천 목록을 띄우지 않습니다.
    if (filtered.length === 1 && filtered[0] === domainQuery) return [];

    return filtered;
  }, [atIndex, localPart, domainQuery]);

  const showDropdown = isOpen && suggestions.length > 0;

  function handleChange(e) {
    const nextValue = e.target.value;
    onChange?.(nextValue);
    setIsOpen(nextValue.includes("@"));
    setActiveIndex(-1);
  }

  function handleFocus() {
    if (value.includes("@")) setIsOpen(true);
  }

  function handleBlur() {
    // 목록 항목의 onMouseDown이 먼저 처리되도록 약간의 지연을 두고 닫습니다.
    window.setTimeout(() => setIsOpen(false), 120);
  }

  function selectDomain(domain) {
    onChange?.(`${localPart}@${domain}`);
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(e) {
    if (!showDropdown) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectDomain(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div style={{ position: "relative" }}>
      <input
        type="email"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={showDropdown}
        aria-autocomplete="list"
        style={style}
        {...rest}
      />

      {showDropdown && (
        <ul
          role="listbox"
          style={{
            position: "absolute",
            zIndex: 20,
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            margin: 0,
            padding: "6px",
            listStyle: "none",
            borderRadius: "12px",
            border: "1px solid var(--line)",
            background: "var(--white)",
            boxShadow: "var(--shadow)",
            maxHeight: "220px",
            overflowY: "auto",
          }}
        >
          {suggestions.map((domain, index) => (
            <li key={domain} role="option" aria-selected={index === activeIndex}>
              <button
                type="button"
                // onMouseDown에서 선택을 처리해 input의 blur보다 먼저 실행되게 합니다.
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectDomain(domain);
                }}
                onMouseEnter={() => setActiveIndex(index)}
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  gap: "2px",
                  padding: "10px 12px",
                  border: "0",
                  borderRadius: "8px",
                  background: index === activeIndex ? "var(--gray-200)" : "transparent",
                  color: "var(--ink)",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  textAlign: "left",
                }}
              >
                <span style={{ color: "var(--ink-3)" }}>{localPart}@</span>
                <span style={{ fontWeight: 700 }}>{domain}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
