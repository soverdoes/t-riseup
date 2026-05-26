# t-riseup Design System

Figma 파일: `0bWv1E0X1AaqmKFkJHHMPU`
저장일: 2026-05-19
출처: **Figma 로컬 스타일 (figma-console MCP 플러그인 API로 직접 추출)** — 모든 값이 정확합니다.

## 추출 통계

| 종류 | 개수 |
|---|---|
| Color Styles | 28 |
| Text Styles | 40 |
| Effect Styles | 0 |
| Variables | 0 |

---

## ⚠️ 중요한 명명 규칙 (잘못 알기 쉬움)

- 텍스트 토큰 prefix는 **`tx/`** 다 (`text/` 아님)
- 흰색 텍스트 토큰명은 **`tx/white`** 다 (`tx/inverse` 아님)
- Figma 슬래시(`/`) → CSS 변수에서는 하이픈(`-`) (예: `tx/primary` → `--tx-primary`)

---

## Color Tokens

### Background (`bg/`)
| 토큰 | HEX |
|---|---|
| `bg/primary` | `#FFFFFF` |
| `bg/secondary` | `#F3F3F3` |
| `bg/surface` | `#F4F4F8` |
| `bg/accent` | `#F2F7F8` |
| `bg/dark` | `#231F20` |

### Text (`tx/`)
| 토큰 | HEX |
|---|---|
| `tx/primary` | `#222222` |
| `tx/secondary` | `#555555` |
| `tx/muted` | `#6F6F6F` |
| `tx/disabled` | `#CCCCCC` |
| `tx/white` | `#FFFFFF` |

### Interactive (`interactive/`)
| 토큰 | HEX |
|---|---|
| `interactive/primary` | `#2E3092` |
| `interactive/primary-dark` | `#1E2170` |
| `interactive/secondary` | `#6B6EC0` |
| `interactive/accent` | `#F37021` |
| `interactive/accent-blue` | `#0076FF` |

### Border (`border/`)
| 토큰 | HEX |
|---|---|
| `border/default` | `#CCCCCC` |
| `border/strong` | `#444444` |
| `border/light` | `#EFEDF0` |

### Gray Scale (`gray/`)
| 토큰 | HEX |
|---|---|
| `gray/900` | `#222222` |
| `gray/700` | `#444444` |
| `gray/600` | `#555555` |
| `gray/500` | `#6B6B6B` |
| `gray/300` | `#CCCCCC` |
| `gray/200` | `#EFEDF0` |
| `gray/100` | `#F3F3F3` |
| `gray/50` | `#F8F8F8` |

> 400/800은 의도적으로 없음.

### Icon (`icon/`)
| 토큰 | HEX |
|---|---|
| `icon/1` | `#222222` |
| `icon/2` | `#FFFFFF` |

---

## Typography (40 styles)

### 폰트 패밀리
- **기본:** `Pretendard`
- **Display 1, Display 4 전용:** `Montserrat`

### Display (4종, 각각 weight 1개씩만)
| 스타일 | 폰트 | 사이즈 | weight | line-height |
|---|---|---|---|---|
| `Display/1` | **Montserrat** | 74 | **Black (900)** | 100% |
| `Display/2` | Pretendard | 48 | **Bold (700)** | auto |
| `Display/3` | Pretendard | 60 | **Bold (700)** | auto |
| `Display/4` | **Montserrat** | 60 | **Black (900)** | 100% |

> Display는 weight가 각각 1개씩만 정의되어 있음 (다른 카테고리와 다름).

### Heading / Body / Caption (각 4 weight: Regular/Medium/SemiBold/Bold)
| 카테고리 | 사이즈 | line-height |
|---|---|---|
| H1(40) | 40 | auto |
| H2(32) | 32 | auto |
| H3(28) | 28 | auto |
| H4(24) | 24 | auto |
| H5(20) | 20 | **140%** |
| Body 1(18) | 18 | auto |
| Body 2(16) | 16 | auto |
| Caption 1(14) | 14 | auto |
| Caption 2(12) | 12 | auto |

각 카테고리에 4 weight: `Regular(400)`, `Medium(500)`, `SemiBold(600)`, `Bold(700)`
→ Figma에서는 `H1(40)/Regular`, `H1(40)/Bold` 식으로 등록되어 있음 (총 9 × 4 = 36 + Display 4 = 40 styles)

---

## 사용 방법

### CSS 변수
```css
@import "./design-system/design-tokens.css";

.cta-button {
  background: var(--interactive-accent-blue);
  color: var(--tx-white);
  font-size: var(--fs-body-1);
  font-weight: var(--fw-semibold);
  border: 1px solid var(--border-default);
}
```

### 유틸리티 클래스
```html
<h1 class="text-display-1">Your Ground Digital Partner</h1>
<h2 class="text-h2 fw-bold">올인원 모빌리티 운영을 위한</h2>
<p class="text-body-2 fw-regular">본문 텍스트</p>
```

> `.text-display-1` 클래스는 자동으로 Montserrat Black 900을 적용함.

### Figma 토큰 ↔ CSS 변수 매핑
| Figma | CSS |
|---|---|
| `bg/primary` | `--bg-primary` |
| `tx/white` | `--tx-white` |
| `interactive/primary` | `--interactive-primary` |
| `gray/500` | `--gray-500` |
| `Display/1` | `.text-display-1` 또는 `var(--fs-display-1)` |

---

## 미정의 / 추후 추가 가능

- spacing 토큰 (현재 미정의)
- radius 토큰 (현재 미정의)
- shadow / effect 토큰 (Figma에도 정의 안 됨)
- Variables (Figma에서 사용 안 함 — 모두 Styles로 관리)
