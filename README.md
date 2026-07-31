# Workspace

팀 협업을 바로 시작하기 위한 최소 프로젝트 구조입니다.

## 프론트엔드 실행

```bash
cd client
npm install
npm run dev
```

첫 `npm install` 후 생성되는 `package-lock.json`도 커밋합니다.

## 마스터 페이지

현재 `App.jsx`는 마스터 페이지 데모를 표시합니다.

- `client/src/pages/Master/Master.jsx`: 홈·촬영·내역·알림·마이 화면 데모
- `client/src/components/layout/MainLayout.jsx`: 전체 앱 셸
- `client/src/components/layout/Header.jsx`: 홈 헤더 및 일반 상단 내비게이션
- `client/src/components/layout/BottomNavigation.jsx`: 공통 하단 내비게이션
- `client/src/components/layout/StatusBar.jsx`: 데모용 상태 표시줄
- `client/src/components/master`: Button, Card, Badge 등 공통 UI
- `client/src/index.css`: 디자인 토큰과 마스터 페이지 공통 스타일

팀원은 담당 페이지 콘텐츠를 만들고, 최종 연결 담당자가 `App.jsx` 또는 라우터에서 조립합니다.

## 백엔드 실행

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

## OCR 서버 실행

```bash
cd ocr-service
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## 협업 핵심 규칙

- `main`, `dev` 브랜치에서 직접 작업하지 않습니다.
- `dev`를 최신화한 뒤 `feat/기능명` 브랜치를 만듭니다.
- 담당 파일과 폴더를 중심으로 작업합니다.
- `.env`, `serviceAccountKey.json`, `node_modules`는 커밋하지 않습니다.
- `client/src/App.jsx`는 라우팅 연결 담당자만 수정합니다.
- `client/src/components/master`와 `client/src/components/layout`은 확정 후 임의 수정하지 않습니다.
..