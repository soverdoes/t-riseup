# T-RiseUp

T-RiseUp 홈페이지 리뉴얼 — B2B 모빌리티 SaaS 플랫폼 (Ground K).

🔗 **Live**: <https://soverdoes.github.io/t-riseup/>

## 페이지 구성

| 페이지 | URL | 설명 |
|---|---|---|
| 메인 | [`index.html`](./index.html) | 히어로 · 솔루션 4개 · PMS/TMS · RIDEUS · 면허솔루션 · 성공사례 · 고객사 |
| PMS Solution | [`pms.html`](./pms.html) | 예약·배차·관제·정산 통합 PMS |
| TMS Solution | [`tms.html`](./tms.html) | 상품 개발 · 노선 · QR검표 통합 TMS |
| K.RIDEUS | [`rideus.html`](./rideus.html) | 모빌리티 통합 판매 채널 (마켓플레이스) |
| 면허솔루션 | [`license.html`](./license.html) | 타입1 면허 9개 심사영역 검증 완료 |
| 도입사례 | [`cases.html`](./cases.html) | 카테고리 필터링 + 21개 도입사례 카드 |
| 도입문의 | [`contact.html`](./contact.html) | Request a Consultation 폼 (소속·이름·연락처·이메일·문의종류·내용) |

## 기술 스택

- **No-build 정적 사이트** — HTML + CSS + Vanilla JS
- Pretendard (본문) · Montserrat (디스플레이) 웹폰트
- i18n 한국어/영어 토글 (`js/i18n.js`)
- Figma 디자인 토큰 기반 (`design-system/`)
- 모바일 360px · 태블릿 1024px · 데스크톱 1440px+ 반응형
- 스크롤 reveal · 카운트 업 · 드래그 캐러셀 · 자동 헤더 숨김 등 vanilla JS 인터랙션

## 로컬에서 실행

```bash
# Python 3
python -m http.server 8000

# 또는 Node
npx http-server -p 8000
```

브라우저에서 <http://localhost:8000/> 열기.

## 프로젝트 구조

```
.
├── index.html · pms.html · tms.html · rideus.html · license.html · cases.html
├── css/
│   ├── main.css         # 리셋 · 컨테이너 · 섹션 · 스크롤 리빌
│   ├── components.css   # 헤더 · 푸터 · 드롭다운 · 모바일 메뉴 · 버튼
│   ├── sections.css     # 홈 섹션들 · 도입사례 그리드 · CTA
│   └── solution.css     # 솔루션 페이지 공용 컴포넌트
├── js/
│   ├── i18n.js          # 한국어/영어 사전 + 토글
│   └── main.js          # 헤더 자동 숨김 · 스크롤 리빌 · 카운트업 · 필터
├── images/              # 사진 · 로고 · 일러스트 (이미지 매니페스트는 images/README.md)
├── design-system/       # Figma 디자인 토큰 (CSS + JSON)
└── tools/               # Figma 자산 추출용 Python 스크립트
```

## 디자인

Figma — `[디자인]티라이즈업 홈페이지 리뉴얼`

---

© Ground K. All rights reserved.
