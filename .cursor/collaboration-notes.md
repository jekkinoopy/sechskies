# 站主與助手協作備忘

由對話整理；**程式真值**仍以 repo 與 `.cursor/rules/*.mdc` 為準。本檔僅記「這次講定的做事方式」，不取代規則檔。

---

## 1. 邊界（站主明講）

- **沒有叫你做的，不要順手做**（含刪註解、順手整理、自訂「以後我都會……」流程）。
- **看不懂先問**；你說「執行」再改檔。你說「檢查」就只對照回報，**不擅自改**。
- **不要自己訂規則**代替站主（例如自創「只調樣式就保留註解」這類概括）。

---

## 2. 參考圖怎麼讀

- **畫線／粉線**：提醒「這一段要看」，**不是**「整段都要包 span」或「這裡一定要 `mark_b`」。
- **實際標記**：對照圖裡**字重、黃標、一般內文**，再對應既有 class（`mark_y`、`mark_b`），自己判斷。
- **開發者工具截圖**（勾選／刪除線）：照**屬性開關**改 CSS；沒叫動註解就不要動註解。

---

## 3. 首頁 `#mission`（做法，非定稿內容）

- 第一段：站主若只說調 span，**只**增刪 `<span>` 與既有 class；未要求不改 CSS。實際哪些詞要 `mark_y`／`mark_b` **會變**，以當下 `index.html` 與站主圖為準，**不寫死**在筆記。
- 第二段金句：未要求時**只改內文**、不改 span 結構。
- devtools 截圖：照屬性開關改；沒叫動註解就不要動註解。

---

## 4. 籌備中連結（`portal-nav.js`，若後續對話有改動以檔案為準）

- 頂欄與頁內按鈕：**`NAV_SOON_PHRASES` 隨機氣泡**（滑過）；無障礙 aria「尚無開放」。
- 頁內按鈕：**不加**可見「（籌備中）」後綴。
- `totoga2/timeline.html` 在 `COMING_SOON_PAGES`（時間軸不公開）；圖文好讀版為 `totoga2/readable.html`。

---

## 5. 2026-05 慘痛教訓（務必讀 `agent-must-ask.mdc`）

- 用 PowerShell 批次改全站 HTML **沒 UTF-8** → 首頁中文全毀、`</span>` 露出；已 `git checkout` 還原 HTML。
- **擅自**把 `map-archive-header` 改成 `inner-page-header`（站主沒點頭、沒給名字）。
- 站主說先電子書 + dev `center 78%`，助手卻自加 `clamp`／全站 `100vh`／又全站改掉。
- 頂欄擅自「傳奇的轉折（六六歌2）」— 已改回「傳奇的轉折」；以後 nav 文案不自擴。
- **擅自 `git push`**（站主只貼 push 失敗錯誤、沒說「幫我 push」）— 禁止再犯；修 push 問題只動本機，結尾給站主自己下的 `git push` 指令。

---

## 6. 改完就給 commit（站主訂）

**每做完一項改動**，回覆末尾**直接附**一段（不要為此反覆跑 `git status`／`git diff` 確認；助手自己知道改了什麼）：

```bash
git add .
git commit -m "類型 修改重點"
```

| 項目 | 約定 |
|------|------|
| **類型** | 三選一，以本次修改**為主**的那一種：`feat`（新功能／新行為）、`fix`（修 bug／修壞掉的行为）、`style`（純樣式／排版，無新功能） |
| **格式** | 類型後**空一格**，再接修改重點；整段 `""` 內建議維持 `類型 + 空格 + 重點` 一行 |
| **字數** | 修改重點**15 字以內**（中文為主，標點計入字數；過長請精簡） |
| **`git add`** | **一律只寫 `git add .`**；**禁止** `git add 單一檔案路徑`（易漏同次改動的 `portal-nav.js` 等，側邊欄會留 **M**） |
| **側邊欄 M** | VS Code 檔名旁 **M = Modified（有未 commit 變更）**，與 `commit -m` 無關；`add` 後要 **commit** 才會消失 |

**範例**

```bash
git add .
git commit -m "feat 頂欄992px漢堡選單"
```

```bash
git add .
git commit -m "fix 三層子選單hover接軌"
```

```bash
git add .
git commit -m "style 內頁標題深灰配色"
```

- 站主若只說「檢查」、未說執行：**不附** commit（也沒有改檔）。
- 一次對話若分多項獨立交辦，**每項做完各附一段** commit，不要合併成一句含糊帶過。

---

## 6.1 Git：只附 commit，**禁止擅自 push**（站主訂）

| 可以做 | 不可以做 |
|--------|----------|
| 改檔後末尾附 `git add .` + `git commit -m "…"`（§6） | **`git push`**、**`git push -u origin …`**、代站主推遠端 |
| 站主貼 push 失敗：查原因、本機 amend／壓圖／改 `.gitignore`，**說明後請站主自己 push** | 以為「幫他推上去比較省事」就 push |
| 站主明講「幫我 push」「推上去」 | 用 push 當改完的預設收尾 |

**結尾範例（修完 push 擋下時）：**

```bash
git push origin main
```

（由站主在本機執行；助手不代跑。）

### 大檔／備份（2026-05 push 擋下）

- GitHub 單檔 **> 100 MB** 會拒 push；`totoga2/readable/` 曾卡 `13-7_生氣在錫大頭版.png` 與 **`.png.bak`**。
- 已加 repo 根 **`.gitignore`**：`*.png.bak`。**勿** `git add .` 把 `.bak` 送進 commit。
- 壓圖只改工作區檔案時，若需改寫**已 commit 未 push** 的歷史，先問站主是否同意 amend／filter-branch；**仍不代 push**。

---

## 7. 相關規則檔

| 檔案 | 用途 |
|------|------|
| `.cursor/collaboration-notes.md` §6、§6.1 | **改完附 commit**；**禁止擅自 push** |
| `.cursor/rules/agent-must-ask.mdc` | **必問再改**、禁止批次毀 UTF-8、header／nav 勿擅自改名 |
| `.cursor/rules/ai-change-boundaries.mdc` | 變更範圍、共用 CSS |
| `.cursor/rules/user-scope-and-nav.mdc` | 導覽開放、錨點刪除 |
| `.cursor/rules/portal-nav-rules.mdc` | `portal-nav.js` 技術細節 |
