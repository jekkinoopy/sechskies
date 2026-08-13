# 水晶男孩推廣部 — AI 工作上下文

> 這個檔案讓 AI 在任何裝置（家／學校）都能快速恢復上下文。
> **每次對話做了重要決定，請叫我更新這裡，然後 git commit。**

---

## 專案簡介

水晶男孩（Sechs Kies）推廣粉絲網站。靜態 HTML + PHP + 原生 CSS/JS，無框架。
站主（Noopy）2016 年入坑，藝廊式創作風格。

---

## 規範速查（詳細見 `developer-rules/rules/`）

| 規範 | 檔案 |
|------|------|
| 改檔行為守則（必問再改） | `agent-must-ask.md` |
| 變更邊界（只改被點名的） | `ai-change-boundaries.md` |
| CSS 顏色 Token | `color-tokens.md` |
| 版面視覺預設 | `design-defaults.md` |
| Git commit 規範 | `git-commit-required.md` |
| 導覽邏輯（portal-nav） | `portal-nav-rules.md` |
| 文案語調 | `site-voice.md` |

**最重要的三條：**
1. 沒說「執行」→ 不改檔
2. 只改被點名的那一頁／區塊
3. 改完必附 commit 指令（禁止在 sandbox 跑 git）

---

## 架構重點

- **全站導覽**：`assets/js/portal-nav.js`（`COMING_SOON_PAGES` 控制開放）
- **全站 CSS**：`assets/css/style.css`（定義所有 color token）
- **首頁**：`index.html`
- **站主索引**（自用）：`extra/site-guide.html`（`data-portal-nav-all-open`，不對外）
- **內頁 header class**：`inner-page-header`（禁改回舊名）

### vedio/ 頁面（原 variety/，已改名）

| 檔案 | 頁面標題 | 說明 |
|------|----------|------|
| `vedio/bangxiao.html` | 世紀級寶藏 / 爆笑養老院 | 甜蜜負擔計量器；六人卡片選取 + jQuery 計算；CTA → `totoga2/ebook.html` |
| `vedio/variety-shows.html` | 全員發瘋 | 綜藝節目存檔表；tabs + 搜尋；已對齊 albums.html 扁平結構 |
| `vedio/NJTW/NJTW5.html` | 新西遊記5 | 各自暴走專頁 |
| `vedio/vedio-list.html` | 影視清單 | 追劇進度預覽頁（乙級第三題骨架，PHP 後台在 `vedio/vedio-list/`） |

---

## portal-nav 操作守則（血淚版）

> 每次新增或修改導覽，必須先讀這裡再動手。

1. **先查 `extra/site-guide.html` 確認層級**，再動 `portal-nav.js`。  
   site-guide 的 depth 數字 = nav 的層級：depth-1 是第一層 `<li>`，depth-2 是子選單項目，depth-3 是 subgroup 裡的巢狀項目。

2. **`COMING_SOON_PAGES` 只放檔名**（不含路徑）。  
   `normalizePageKey` 只取 href 最後一段，所以 `vedio/bangxiao.html` → 比對 `bangxiao.html`。

3. **直接連結不需要 subgroup**。  
   子選單內只要 `<li><a>` 就夠；`portal-nav__subgroup` 只在該項目還有巢狀子項目時才用（例如「傳奇的轉折」有時間軸、電子書等四項）。

4. **site-guide.html 要同步更新**，否則站主索引頁會顯示舊名稱。

5. **commit 前網站不會更新**。本地端強制重整用 `Ctrl+Shift+R`；GitHub Pages 需 `git push` 後等約 1 分鐘。

---

## 目前工作狀態

<!-- 每次對話結束後更新這個區塊 -->

**最後更新：** 2026-08-13

**進行中：**
- 無

**待確認：**
- developer-rules 健檢尚未執行

**已完成：**
- 建立 CLAUDE.md 跨裝置上下文檔案
- 新增 `vedio/bangxiao.html`（世紀級寶藏 / 爆笑養老院，甜蜜負擔計量器）
- `vedio/variety-shows.html` 重構：移除多層包裝，對齊 albums.html 扁平結構
- portal-nav 新增世紀級寶藏，正確放入淪陷瞬間子選單
- `extra/site-guide.html` 同步更新：全員發瘋 → 世紀級寶藏
- `variety/` 資料夾整個改名為 `vedio/`，同步修正 portal-nav.js、site-guide.html、style.css 註解、docs/site-structure.md、portal-nav-rules.md 等連結

---

## 如何使用這個檔案

換裝置後，告訴 AI：
> 「請先讀 CLAUDE.md，再讀 developer-rules/rules/ 裡的所有規範，然後繼續 [任務]。」
