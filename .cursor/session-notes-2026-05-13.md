# 對話紀要 · 2026-05-13（深夜）

供之後自己或助手對齊脈絡用；**程式真值**仍以 repo 內檔案與 `.cursor/rules` 為準。

---

## 1. 需求：`variety/variety.html` 刪除 `#stage`

- **意圖**：刪除該頁內 **`id="stage"` 的整個 `<section>`**（「隊長的氣場」），**不是**刪整頁、不是刪 `variety/` 資料夾、不是刪頂欄「全員發瘋」整段。
- **實作**：已從 `variety/variety.html` 移除該區塊；站內原指向 `variety.html#stage` 的連結改為仍存在的錨點（例如 `#variety`），見 `assets/js/portal-nav.js`、`extra/site-guide.html`。
- **誤會澄清**：瀏覽器網址列若仍顯示 `#stage`，多半是舊書籤／歷史網址，**不代表** HTML 裡還有該 `id`。畫面上的「瘋子與天才」是 **header 大標**，不是已刪除的 `#stage` 區內文。

---

## 2. 寫入規則（給「明天的電腦」）

已更新 Cursor 規則（`alwaysApply`）：

| 檔案 | 補充內容 |
|------|----------|
| `.cursor/rules/user-scope-and-nav.mdc` | **頁面錨點刪除**：先改頁面 DOM，再修死錨；禁止只改導覽不刪區塊、禁止擅自擴大刪頂欄／整頁。 |
| `.cursor/rules/portal-nav-rules.mdc` | §0 加第 6 點，指回上一條。 |
| `.cursor/rules/ai-change-boundaries.mdc` | **站主版面與元件預設**：同行預設等高、同類 CARD 等預設等寬；短字層單行置中、長文換行置左；預設不出現區塊內捲軸除非站主明講。 |

---

## 3. 站主口述的設計大原則（摘要）

- 同一列：除非特別說，**等高**。
- 同屬性（如 CARD）：**等寬**。
- 「十字以內」等級的短標：**盡量不換行、置中**；超過則**內文層（body）可換行、置左**（規則與 CSS 依 `body.頁面類名 … p`，不依 `*-intro-lead` class 名）。
- **不要**隨便出現內嵌捲軸；除非站主對該區有強烈／明確規定。

細節與實作注意已寫在 `ai-change-boundaries.mdc` 該節。

---

## 4. 本檔說明

- 由 2026-05-13 對話整理；若與後續 commit 不一致，以 git 與規則檔為準。
