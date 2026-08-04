# 對話紀錄：Bootstrap 5 作業（2026-07-08）

> 這份是這次對話的重點備份，不是規範檔。規範仍以 `developer-rules/rules/` 為準。

## 起因

老師的 Bootstrap 5 課堂範例重點：Navbar、RWD 格線（container/row/col）、錨點導覽、Carousel（同頁多組需不同 id、可放進 grid 欄位）。目標是做成符合本站風格的作業／作品展示頁，而不是照抄範例或做成教學筆記。

## 過程與轉折

1. **第一版**（`extra/hw-bootstrap.html` 初版）：做成「Bootstrap 元件練習誌」，內容偏向解釋 navbar/grid/carousel 是什麼 → 被打回，因為變成讀書筆記，沒有應用在專案內容上。
2. **第二版**：改寫同一檔案為「精華牆」，用真實內容（淪陷瞬間／完整的六顆／黃色留聲機／現場的震撼／Yellow Note）取代教學說明，Bootstrap 降到最後一行小字帶過。
3. 另外新增一頁 **`extra/bootstrap-navbar-carousel.html`**（跨時空精選）：Hero＋Sticky Navbar 錨點導覽＋兩組不同 id 的 Carousel（一組放進 grid 欄位）＋Grid 卡片區＋結尾備註，符合站主指定的頁面結構規範。
4. 最後一個任務：**把 Bootstrap 實際套進首頁**，但不能動到 `index.html` 本體 → 建立備份 **`index-bootstrap.html`**，只在這份備份裡：
   - 把既有的 `<nav class="portal-nav" data-portal-nav>` 疊加 `navbar navbar-expand-lg navbar-dark` 等真正的 Bootstrap navbar class（不碰 `assets/js/portal-nav.js`）。
   - `#timeline`「SECHSKIES STORY ARCHIVE」下方新增一排錨點快覽（傳奇誕生／凍結世界／完整回歸／夢境成真／九月首演／溫柔陪伴／未完待續），對應到下面每張時間軸卡片的新增 `id`。

## 過程中修掉的 bug（都只影響 `index-bootstrap.html`）

- **Bootstrap Reboot 蓋掉全站底色／字體／邊距** → 用同量級純標籤選擇器（`body.home-page{}`、`h1~h6,p,ul...{}`、`a{}`）疊在 Bootstrap 後面蓋回來。
- **`.section-title` 間距被吃掉**：一開始誤用 `body.home-page h2{margin:0}`（class+type）優先權太高，蓋過 `.section-title` 自己的 `margin-bottom:20px`。改回純標籤選擇器 `h2{margin:0}`，優先權只贏 Bootstrap Reboot，不會贏 class 選擇器。
- **頁尾連結變 Bootstrap 預設藍色底線**：`.studio-link` 沒有專屬顏色規則，靠全站 `a{color:...}`撐著，被 Bootstrap 同量級的 `a{}` 蓋掉，補回 `a{color:var(--color-text);text-decoration:none}`。
- **手機版漢堡選單失效**：Bootstrap 的 `.navbar{display:flex}` 沒寫在 media query 裡，跟站上桌機／手機兩種 `.portal-nav` 版面同量級、且載入在後，兩種寬度都被蓋成桌機版。改成照原本 `max-width:991px` 斷點分別把桌機／手機版面疊回去；另外先前加的 `#portal-primary-menu` id 選擇器優先權太強、蓋掉手機收合邏輯，已移除（内層 `.portal-nav>ul` 等選擇器本來就贏過 Bootstrap 的 `navbar-nav`/`nav-link`，不需要額外處理）。
- **錨點跳轉被 sticky nav 擋住／卡片年代標籤被裁切**：改用 JS 即時量測 `.portal-nav` 實際高度，加 24px 緩衝（年代標籤 `::after` 用絕對定位貼在卡片外側），寫進 CSS 變數 `--home-nav-offset`，取代原本用猜的固定值。

## 最終異動檔案

| 檔案 | 狀態 |
|---|---|
| `extra/hw-bootstrap.html` | 新增（精華牆） |
| `extra/bootstrap-navbar-carousel.html` | 新增（跨時空精選） |
| `extra/site-guide.html` | 新增兩行參照（未動其他內容） |
| `index-bootstrap.html` | 新增（`index.html` 的 Bootstrap 版備份，`index.html` 本體全程未動） |

## 學到的教訓（給下次疊 Bootstrap 到既有頁面用）

- 疊 Bootstrap 到已有完整樣式系統的頁面時，**优先權要「剛好贏過 Bootstrap 同層級選擇器」就好，不要過度加 class／id 硬贏**，否則會反過來蓋掉站上原本更細緻的規則（尤其是響應式 media query 那些）。
- 純標籤選擇器（`h2{}`、`a{}`）配合「寫在 Bootstrap CDN 連結之後」就足以贏過 Bootstrap Reboot，且不會蓋過站上任何 class 選擇器。
- 凡是原本就有分斷點（`@media`）的規則，疊加保護時也要照原本的斷點分開寫，不能只複製其中一種寬度的版本。
