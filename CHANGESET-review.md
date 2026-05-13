# 變更檢查清單（工作區 vs `HEAD`）

> **說明：** 此為對話當初「第一批」完整筆記存檔（五檔：`archive`／`index.css`／`index.html`／`style.css`／`portal-nav`）。**目前工作區是否仍為下列每一項，請以 `git diff` 與實際檔案為準**，本文不作為程式真值來源。

本文依 **`git diff`** 對照 **`HEAD`** 整理，方便逐項核對；不含未在本 diff 出現之檔案或臆測內容。

**涉及檔案（5）**：`archive.html`、`index.css`、`index.html`、`portal-nav.js`、`style.css`  
**統計**：以 `git diff --stat` 為準（以下內容對應該批變更初版筆記）。

---

## 1. `archive.html`

### 目的

- 年表區塊（「啟動新篇章」「輝煌全盛期」）每一資料列：**點列上非連結區域**時，於新分頁開對應 **Spotify 專輯**。
- 列內既有 `<a>`（本站 `lyrics.html`、`concert.html`、`classic.html`）維持原行為。

### 標記與無障礙

每一列 `<tr>` 增加：

| 屬性 | 說明 |
|------|------|
| `class="archive-row-spotify"` | 供腳本與樣式選取 |
| `tabindex="0"` | 鍵盤可聚焦列 |
| `data-spotify-url="https://open.spotify.com/album/…"` | 要開啟的專輯網址 |
| `aria-label="…"` | 螢幕閱讀器簡述 |

### Spotify 連結對照（請自行點連結確認標題是否仍正確）

| 區塊 | 年份／列語意 | `data-spotify-url`（專輯頁） |
|------|----------------|------------------------------|
| 啟動新篇章 | 2016 數位單曲（THREE WORDS） | `https://open.spotify.com/album/1Dijv8G0wnCN8PzFZoC8bN` |
| 啟動新篇章 | 2017 ANOTHER LIGHT | `https://open.spotify.com/album/5f2LzIFxljQF4FH7w3rXcQ` |
| 啟動新篇章 | 2020 ALL FOR YOU | `https://open.spotify.com/album/7vqIRL00YfTtuO0sSAK3Uv` |
| 輝煌全盛期 | 1997 學園別曲（School Byeolgok） | `https://open.spotify.com/album/18P1aqSLQA9WdNljjEhv9q` |
| 輝煌全盛期 | 1998 Road Fighter | `https://open.spotify.com/album/08TW1bmGzSg172Db8C2Bde` |
| 輝煌全盛期 | 1999 Com' Back | `https://open.spotify.com/album/3XWtqLXDZycu7Q0BGofhiq` |

### 內嵌腳本（`</body>` 前，`portal-nav.js` 之後）

- `querySelectorAll('tr.archive-row-spotify[data-spotify-url]')` 綁定：
  - **click**：若 `e.target.closest('a')` 則不處理；否則 `window.open(url, '_blank', 'noopener,noreferrer')`
  - **keydown**：僅 `Enter` / `空白鍵`；同樣避開錨點焦點；`preventDefault()` 後同上開新分頁

---

## 2. `index.css`

### 新增選擇器（僅作用於 `.archive-discography` 內）

| 規則 | 效果 |
|------|------|
| `tbody tr.archive-row-spotify` | `cursor: pointer` |
| `tbody tr.archive-row-spotify:hover td` | 淡黃底 `rgba(255, 204, 0, 0.06)` |
| `tbody tr.archive-row-spotify:focus-visible` | 黃色外框約 2px、`outline-offset: -2px` |

---

## 3. `index.html`

### 變更位置

- 時間軸／故事區：**「傳奇回歸：重逢的感動合體」**那一段（`data-era="2016"`）。

### 具體修改

1. `<article class="story-node">` 追加 modifier：`story-node--ebook-ssg2`。
2. 在該篇 `<p>…</p>` 之後新增：
   - `<a href="ssg2-ebook.html" class="timeline-ebook-cta">`
   - Font Awesome：`fa-solid fa-hand-pointer`（`aria-hidden="true"`）
   - 文案：「點這裡翻開《六六歌2》紀實電子書」

### 相依性（請檢查）

- 頁面須已載入 Font Awesome（與現有 `<link>` 一致），否則圖示不顯示。
- `ssg2-ebook.html` 須存在且路徑正確。

---

## 4. `style.css`

### 區塊註解

`/* 跨時空軌跡：2016 六六歌節點 — 強調電子書 CTA */`

### 新增樣式摘要

| 選擇器 | 用途 |
|--------|------|
| `.merged-storyline .story-node.story-node--ebook-ssg2` | 2016 卡片邊框、陰影、淺黃漸層背景 |
| `.merged-storyline .story-node.story-node--ebook-ssg2 p:last-of-type` | 末段 `<p>` 下緣縮排，預留按鈕間距 |
| `.merged-storyline .timeline-ebook-cta` | 膠囊按鈕（flex、字重、黃色漸層、圓角、`hover` 上移與陰影） |
| `.merged-storyline .timeline-ebook-cta:focus-visible` | 鍵盤焦點外框 |
| `.merged-storyline .timeline-ebook-cta .fa-hand-pointer` | 略放大 + 動畫 `timeline-finger-nudge` |
| `@keyframes timeline-finger-nudge` | 輕微位移循環 |
| `@media (prefers-reduced-motion: reduce)` | 關閉手指動畫 |

**注意**：樣式皆掛在 `.merged-storyline` 底下，請確認首頁時間軌 DOM 仍使用 `.merged-storyline` 包住對應節點，否則樣式不會套用。

---

## 5. `portal-nav.js`

### 目的

- **隱藏**導覽中「消失的真相」（`sunghoon.html`）整個頂層 `<li>`＋子選單，且**不以 `//` 寫在 HTML 模板字串內**（避免字面文字注入 `innerHTML`）。

### 實作

- 新增常數：`const SHOW_NAV_SUNGHOON = false;`
- 將該段 `<li>…</li>` 包在 template literal 插值：  
  `${SHOW_NAV_SUNGHOON ? \` … \` : ''}`
- 簡短註解說明為何不可用 `//` 註解模板內 HTML。

### 還原方式

- 將 `SHOW_NAV_SUNGHOON` 改為 `true` 即可重新顯示該區塊。

---

## 建議檢查步驟（逐項勾選）

1. **`archive.html`**：每列空白處／封面／年份點擊 → 新分頁 Spotify 正確專輯；點列內本站連結 → 仍進本站、不開 Spotify。
2. **`archive.html`**：鍵盤 Tab 聚焦列後 Enter／空白 → 開 Spotify；聚焦在 `<a>` 上時 Enter → 遵循連結。
3. **`index.html` + `style.css`**：2016 卡片外觀與 CTA 按鈕、`hover`、`focus-visible`、縮減動態偏好設定下手勢動畫關閉。
4. **`portal-nav.js`**：全站注入後選單無「消失的真相」；改 `true` 後該項回來。
5. **跨頁**：任意頁載入 `portal-nav.js` 後行為一致。

---

## 備註

- Spotify 專輯 ID 會隨平台重新發行／區域而變動；若連結失效請重新對照官方頁面更新 `data-spotify-url`。
- 若你要把「檢查清單」與 git 提交對齊，可在提交前再跑一次：`git diff` 確認與本文及實際檔案一致。
