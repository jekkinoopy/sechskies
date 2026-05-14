# 全站導覽列規則（`portal-nav.js`）

之後**每新增一個要上線、可點的 HTML 頁面**，請一併完成導覽更新；規則都集中在 **`portal-nav.js`**。

---

## 1. 必做：把頁面掛進導覽 HTML

在 **`buildPortalNavInnerHTML`**（`portal-nav.js`）裡維護連結：

- 依資訊架構放在對應的 **`<li>`** 底下；需要子選單時用 **`portal-submenu`**。
- `href` 使用**站根相對路徑**（腳本會依當前頁深度加上前綴 `rp`）：例如 `` `${rp}jiwon/jiwon.html` ``、`` `${rp}index.html#section` ``。
- Logo 列：`` `${rp}index.html` `` 與 `` `${rp}img/logov.svg` ``。

新增或調整完後，所有帶 **`data-portal-nav`** 的 `<nav class="portal-nav">` 都會在載入腳本時被注入同一份 HTML。

---

## 2. 可點 vs「籌備中」：`COMING_SOON_PAGES`

腳本會對導覽裡的連結做 **`applyComingSoonToNav`**：

- 若連結的**檔名**（小寫）出現在 **`COMING_SOON_PAGES`** 這個 `Set` 裡，該連結會被改成 **`href="#"`**、加上 **`data-coming-soon="true"`**，點擊無法前往（顯示隨機籌備中文案）。
- **不要出現在 Set 裡**＝視為已開放，維持真實 `href`。

因此：

| 需求 | 做法 |
|------|------|
| 新頁要**正式開放** | 寫進 `PORTAL_NAV_INNER_HTML`，並**確認檔名不在** `COMING_SOON_PAGES`。若曾暫時關閉，記得從 Set **刪除**該檔名。 |
| 新頁先**占位、不開放** | 可選擇：仍寫進導覽，但把檔名**加進** `COMING_SOON_PAGES`；或暫時不要放進導覽。 |

（目前 Set 內含哪些檔，以 `portal-nav.js` 為準；例如 `totoga2.html` 若已開放，就不應出現在 Set 裡。）

---

## 3. 首頁錨點：`INDEX_NAV_OPEN_HASHES`

指向 **`index.html#...`** 的連結，除了檔名判斷外，還會看 **錨點**：

- 若 `href` 是 `index.html#某錨點`，且該錨點**不在** **`INDEX_NAV_OPEN_HASHES`**，會被當成籌備中（與整頁關閉不同，是「這個錨點未開」）。
- 新增首頁區塊且要從導覽直達時：在 **`INDEX_NAV_OPEN_HASHES`** 加上對應字串，例如 `"#story"`（**僅在使用者要求開放該錨點時**；若約定維持關閉則勿加入）。

---

## 4. 新頁面 HTML 檢查清單

- 在 `<body>` 內適當位置放：

  ```html
  <nav class="portal-nav" aria-label="水晶男孩推廣部導覽" data-portal-nav></nav>
  ```

- 在 `</body>` 前載入（順序可與現有頁一致）：

  ```html
  <script src="portal-nav.js"></script>
  ```

- 若該頁有 **`particles.js`**／共用樣式，比照其他內頁一併引入即可。

---

## 5. 刻意不進導覽的頁面

若某頁只給自己用（例如站內索引、草稿），**不要**寫進 `PORTAL_NAV_INNER_HTML` 即可；不必改 `COMING_SOON_PAGES`。

---

## 6. 改完請自檢

1. 從導覽點進新頁是否正常。  
2. 若應為開放頁，確認不會變成「尚無開放」、不會被改成 `href="#"`。  
3. 若為首頁錨點，確認已加入 `INDEX_NAV_OPEN_HASHES`（若有需要）。

---

## 7. 與使用者約定：開放範圍

- **不要**在未經使用者**明確交代**的情況下，自行把導覽改為「可點進入」或更換目標頁（例如把「傳奇的轉折」改成連到 `totoga2.html`）。
- 「傳奇的轉折」是否開放、連到哪裡，**只依使用者指示**；實作細節亦寫在專案規則 **`.cursor/rules/user-scope-and-nav.mdc`**（給 Cursor 代理讀取）。

---

## 相關檔案

| 檔案 | 用途 |
|------|------|
| `portal-nav.js` | `PORTAL_NAV_INNER_HTML`、`COMING_SOON_PAGES`、`INDEX_NAV_OPEN_HASHES`、籌備中邏輯 |
| `style.css` | `.portal-nav`、子選單、`.nav-current` 等樣式 |

（導覽文案隨機句：`NAV_SOON_PHRASES`，僅影響籌備中連結的提示，與新頁是否開放無關。）
