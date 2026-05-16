# 內頁頂部 header／header-inner 差異整理

站主自用；整理日：2026-05。程式真值以 repo 為準，改檔前請再對一次檔案。

---

## 重點

- **全 repo 沒有任何 `.header-inner` 的 CSS**；差異在外層 `header` 的 class 與內層 `.main-title`、`.subtitle-wrap`、`.sub-title`。
- 標準內頁 HTML 幾乎相同；視覺不統一多半是 **CSS 疊加** 或 **少數頁根本沒用同一套 class**。

---

## 一、HTML 結構對照

| 類型 | 頁面 | 結構 |
|------|------|------|
| **標準** | `extra/totoga2-copy-ebook.html`、`extra/totoga2-copy-timeline.html`、`concert/concert.html`、`yellow-note/map.html`、`member/member.html`、`albums/albums.html`、`variety/variety.html`、`fallen/totoga2.html`、`extra/site-guide.html`、`extra/sunghoon.html`、`yellow-note/minister.html`、`extra/minister_ge.html`、`extra/totoga2 copy.html` 等 | `header.map-archive-header` → `motion.header-inner` → `h1.main-title` + `motion.subtitle-wrap` → `span.sub-title` |
| **首頁** | `index.html` | `header#origin` → `motion.hero`（**無** `header-inner`） |
| **無 header** | `extra/totoga2-video.html` | 無頂部 banner 區塊 |
| **另一套** | `extra/grok.html` | 裸 `<header>` → `motion.hero` |
| **另一套** | `variety/NJTW/NJTW5.html` | `header.main-header`（無 `header-inner`） |

---

## 二、CSS 來源（誰在管頂部）

### 1. 多數內頁共用 — `assets/css/style.css`

| 選擇器 | 內容摘要 |
|--------|----------|
| `header.map-archive-header` | `height: auto`；`min-height: clamp(14rem, 38vh, 24rem)`；`background-position: center 78%`；`background-size: cover`；`padding: clamp(1.75rem, 4vh, 2.75rem) 20px` |
| `.map-archive-header .main-title` | `clamp(2rem, 4.5vw, 3.2rem)`、黃字、字距 6px |
| `.map-archive-header .subtitle-wrap` | `margin-top: 20px` |
| `.map-archive-header .subtitle-wrap::before/::after` | 黃線 3px、`max-width: 56px` |
| `.map-archive-header .sub-title` | `0.92rem`、`#d4d4d4`、`letter-spacing: 4px` |
| `@media (max-width: 920px)` `.map-archive-header .main-title` | `letter-spacing: 4px` |

**沒有** `.header-inner { … }`。

### 2. 首頁專用（不套在內頁 `map-archive-header`）

| 檔案 | 選擇器 | 與內頁差異 |
|------|--------|------------|
| `style.css` | `header#origin` | **100vh**、背景 `center`、`background-size: 108%` |
| `style.css` | `.hero`、`.hero h1`、`.hero p` | 首頁 hero 字級 |
| `index.css` | `.home-page header .hero .subtitle-wrap` 等 | 副標更大、描邊、字距不同 |

### 3. 容易造成「這頁長不一樣」的例外

| 頁面 | 額外 CSS | 說明 |
|------|----------|------|
| **`concert/concert.html`** | `assets/css/concert.css`（載入順序：**先** concert，**後** style） | 檔內有**裸** `.main-title`、`.subtitle-wrap`、`.sub-title`（無 `.map-archive-header` 前綴）→ 會影響**整頁**同名 class；header 內仍以 `.map-archive-header .…` 為準（優先權較高） |
| **`extra/minister_ge.html`** | 多載 `index.css`，`body.home-page` | 只改 `.home-page header .hero`，不直接改 `map-archive-header` |
| **全站** | `style.css` 裸 `.subtitle-wrap`、`.sub-title`（約 577 行起） | 區塊內非 header 的副標也會用到；header **內**由 `.map-archive-header .…` 覆寫 |

`concert.css` 裸選擇器摘要（與 `style.css` 內頁 header 不同）：

```css
.main-title { font-size: 3.5rem; letter-spacing: 8px; … }
.subtitle-wrap { margin-top: 25px; … }
.subtitle-wrap::before/::after { max-width: 60px; height: 3px; … }
.sub-title { font-size: 1rem; letter-spacing: 6px; margin: 0 25px; … }
```

### 4. 完全不是 `map-archive-header` 的頁

| 頁面 | CSS | 說明 |
|------|-----|------|
| `variety/NJTW/NJTW5.html` | `variety/NJTW/njtw5.css` | `body.njtw5-page header.main-header`：自訂背景圖、`aspect-ratio: 1280/706`、全寬 breakout，**無** 氣球 `header.jpg` |
| `extra/grok.html` | 僅 `style.css` | 裸 `header` + `.hero` |

### 5. 平板 — `assets/css/tablet.css`（≤1180px）

- `.map-archive-header .main-title`（與全站內頁相同）

---

## 三、為什麼會覺得 header-inner 不統一

1. `.header-inner` **零樣式**，只是包裝 div。
2. **演唱會**多 `concert.css` 裸 class，整頁標題語彙混在一起。
3. **首頁 / NJTW5 / grok / 影片頁**不是同一套 header 系統。
4. 全站裸 `.subtitle-wrap` 與 header 專用規則並存。

---

## 四、明天可決定的方向（改前請說「執行」）

1. **標準是否 = 電子書** — 現行 `header.map-archive-header` + `style.css` 約 1547 行起？
2. **`concert.css` 裸標題** — 改為只作用在主內容，或刪除改吃全站？
3. **是否新增** `.header-inner` 共用樣式？
4. **class 改名** — 全站內頁是否要改掉 `map-archive-header`（需站主指定新名稱；**禁止** PowerShell 批次改 HTML，須 UTF-8 安全）？
5. **grok / NJTW5 / 影片頁** — 併入標準 header，或維持特例？

---

## 五、相關檔案路徑

| 用途 | 路徑 |
|------|------|
| 內頁 banner 主規則 | `assets/css/style.css`（`header.map-archive-header` 區塊） |
| 首頁 hero | `assets/css/style.css`（`header#origin`）、`assets/css/index.css` |
| 演唱會頁額外 | `assets/css/concert.css` |
| NJTW5 頂部 | `variety/NJTW/njtw5.css` |
| 協作規則 | `.cursor/rules/agent-must-ask.mdc` |

---

## 六、有 `header-inner`：頂欄內標題／副標「長得不一樣」的 CSS 套別

只談 **`header.map-archive-header` → `.header-inner` 裡的 `h1.main-title`、`.subtitle-wrap`、`.sub-title`**（顏色、陰影、字級、字距、兩側黃線）。  
連結基準：`待確認/.cursor/` → `../../` 到站根，**Ctrl+點** 開 HTML。

> **線上 `assets/css/style.css` 現況**：內頁頂欄字樣幾乎都吃 **套別 A** 同一組 `.map-archive-header .…`；若你肉眼覺得某頁不同，先用下面代表頁並排，再回報頁名。

| 套別 | 頂欄內字樣差在哪（摘要） | CSS 來源 | 點一頁確認 |
|------|--------------------------|----------|------------|
| **A｜內頁標準** | 主標 `clamp(2rem, 4.5vw, 3.2rem)`、黃字、`text-shadow` 黃光；副標 `0.92rem`、`#d4d4d4`、字距 `4px`；黃線 `3px` / `max-width 56px` | `style.css` → `.map-archive-header .main-title` 等（約 1566 行起） | [六六歌2 電子書](../../extra/totoga2-copy-ebook.html) |
| **B｜演唱會** | 頂欄**仍應**是套別 A（`.map-archive-header .…` 優先）；另載 `concert.css` 的裸 `.main-title`（`3.5rem`）、`.sub-title`（`1rem`）主要搞**主內容**同名 class — 請專看 **banner 裡** 那組字與 A 是否真不同 | `concert.css` 先載 + `style.css` | [演唱會列表](../../concert/concert.html) |
| **C｜首頁 hero（對照）** | **沒有** `header-inner`；`header#origin` + `.hero`：`h1` 約 `2.5rem`，`index.css` 再疊**描邊＋暈光**；副標 `clamp(1.12rem～1.52rem)`、`#e6e6e6`、字距 `0.22em` — 通常比內頁副標**大、亮** | `style.css` `.hero h1` + `index.css` `.home-page header .hero …` | [首頁](../../index.html) |

**套別 A — 同套還有（頂欄字樣應與電子書相同，不必每頁點）**  
`member/member.html`、`variety/variety.html`、`yellow-note/map.html`、`yellow-note/minister.html`、`extra/site-guide.html`、`extra/sunghoon.html`、`extra/minister_ge.html`（頂欄是 `map-archive-header`，**不是** `.hero`；`index.css` 只改首頁 hero）、`fallen/totoga2.html`、`extra/totoga2-copy-timeline.html`、`albums/albums.html`（有載 `index.css` 但 `body` 無 `home-page`，頂欄不受影響）。

**沒有 `header-inner`、不列入上表**（結構就不是同一顆球）：`index` 以外見上文 §一 grok／NJTW5／影片／歌詞。

**備份勿當線上**：`待確認/assets/css/style.css` 曾有 `body.totoga2-page .map-archive-header` 壓矮 banner、舊版 `100vh` 氣球圖 — 與目前站根 `assets/css/style.css` 可能不一致。
