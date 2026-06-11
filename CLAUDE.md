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

---

## 目前工作狀態

<!-- 每次對話結束後更新這個區塊 -->

**最後更新：** 2026-06-11

**進行中：**
- 初次設定，尚未開始具體任務

**待確認：**
- developer-rules 健檢結果待站主確認（本次對話尚未執行）

**已完成：**
- 建立 CLAUDE.md 跨裝置上下文檔案

---

## 如何使用這個檔案

換裝置後，告訴 AI：
> 「請先讀 CLAUDE.md，再讀 developer-rules/rules/ 裡的所有規範，然後繼續 [任務]。」
