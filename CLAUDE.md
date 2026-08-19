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
| `vedio/bangxiao.html` | 世紀級寶藏 / 爆笑養老院 | 甜蜜負擔計量器；六人卡片選取 + jQuery 計算；CTA → `vedio/variety-shows.html` |
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

6. **頂層 `<li>` 固定 5 個，沒有例外**（淪陷瞬間、完整的六顆、現場的震撼、黃色留聲機、Yellow Note）。「小黃練習室」籌備中佔位也收進「Yellow Note」子選單，不再獨立於頂層。新頁面／佔位一律收進其中一項的子選單，不要自己開新的頂層項目。詳見 `developer-rules/rules/portal-nav-rules.md` §8。

---

## 目前工作狀態

<!-- 每次對話結束後更新這個區塊 -->

**最後更新：** 2026-08-19

**進行中：**
- `calendar2026.html` 的 `<h1>` 標題「水晶萬年曆」還在想更好的名字（要求：不用「水晶」前綴、不重複站上已用意象詞、要有典故／查證過的出處），已否決多輪提案，暫緩

**待確認：**
- developer-rules 健檢尚未執行

**已完成：**
- 新增「打歌舞台管理」後台模組（key `stages`，歌曲管理正下方）：`admin/database/schema.sql` 新增 `stage_performances` 表（`song_id` 外鍵關聯 `songs`，欄位含播出日期／電視台／節目名稱／舞台標題／YouTube 連結／備註／排序／公開狀態四態）；`admin/bootstrap.php` 的 `modules()` 加對應設定，沿用既有通用 CRUD（`records.php`／`record-form.php`／`publishing.php`），沒新增獨立頁面。概念取自 `待確認/三個詞專案/php-admin-practice/`（THREE WORDS·10TH 打歌舞台練習專案）的資料結構，但該資料夾本身維持原樣不動、資料庫也不共用，純粹借用欄位設計。**尚待做：**既有 `sechskies_cms` 資料庫要重新匯入一次 `schema.sql`（`CREATE TABLE IF NOT EXISTS` 不會動到既有表，只會補上新表）
- 「水晶練習室」全站更名為「小黃練習室」（英文副標 CRYSTAL PRACTICE ROOM → YEKKI PRACTICE ROOM，「小黃」英文簡稱定為 Yekki，「水晶男孩」簡稱 Jekki，站上不再使用 crystal 字樣指稱練習室）：`yellow-note/practice-room.html`（title／h1／h2／hero 文案／CSS 註解）、`assets/js/portal-nav.js`（Yellow Note 子選單標籤與註解）、`extra/site-guide.html` 心智圖同步；CLAUDE.md／AGENTS.md／portal-nav-rules.md 內提到此頁名稱的歷史記錄一併同步（已拆到獨立專案 sechskies_fans 的舊「水晶熱舞社／水晶練習室／偶像練習生」歷史敘述維持原樣，不屬於本站現名範圍）
- `yellow-note/minister.html`（視覺進化論）Journey 時間軸重構：3 個大 `<article data-era="2016/2017/NOW">` 拆成每個月獨立一個 `story-node`（`data-era="2016.07"` 格式），套用 `.merged-storyline` 既有奇偶交錯排版，不再手寫「07 月｜」字樣。真實照片只有 `2018.07`「415 天健身挑戰」（`fitness-calendar.png`，7/13 李宰鎮生日發起的每日健身計畫，年份待查證）；其餘節點 `data-photo-pending="true"`、不渲染 `<figure>`，等後台控制方式定案後再補真照片
- `yellow-note/minister.html` 與 `calendar2026.html` 內文提到「水晶廢人字幕組」處都連到頻道（`youtube.com/channel/UCJnhlm_t9C7BmcILcjHDk_w`），minister.html 用 `.story-external-inline` 外部連結樣式
- `yellow-note/practice-room.html`（小黃練習室）練舞清單接上第一支影片（SECHSKIES 回歸編舞練習），新增 `yellow-note/dance-practices-data.php` 靜態資料端點頂著（完整 MySQL 後台版在獨立專案 `sechskies_fans`，未部署）
- portal-nav 全開檢查用的 `TEMP_OPEN_ALL_FOR_REVIEW` 已還原為 `false`；`minister.html` 正式從 `COMING_SOON_PAGES` 移除（今天做完，永久開放），「小黃練習室」改為永久真連結（今天做完），「隊長的氣場」維持籌備中（今天沒動它，回到原狀）
- 建立 CLAUDE.md 跨裝置上下文檔案
- 新增 `vedio/bangxiao.html`（世紀級寶藏 / 爆笑養老院，甜蜜負擔計量器）
- `vedio/variety-shows.html` 重構：移除多層包裝，對齊 albums.html 扁平結構
- portal-nav 新增世紀級寶藏，正確放入淪陷瞬間子選單
- `extra/site-guide.html` 同步更新：全員發瘋 → 世紀級寶藏
- `variety/` 資料夾整個改名為 `vedio/`，同步修正 portal-nav.js、site-guide.html、style.css 註解、docs/site-structure.md、portal-nav-rules.md 等連結
- `calendar2026.html` 新增「粉絲應援 / 字幕作品」(`fanwork`) 分類，收錄「水晶廢人字幕組」頻道全部 8 支影片＋ MTV 我愛偶像報導影片（4/4，重啟活動20週年），依上架日期分布；`assets/css/calendar.css` 新增對應淺金配色（比生日金淺、hover 提亮）
- 修正 portal-nav.js 兩次頂層項目迴歸：「世紀級寶藏」移回「淪陷瞬間」子選單、「小黃練習室」移入「Yellow Note」子選單；`portal-nav-rules.md` 新增 §8 頂層 5 主項上限規則（無例外），`extra/site-guide.html` 心智圖同步

---

## 如何使用這個檔案

換裝置後，告訴 AI：
> 「請先讀 CLAUDE.md，再讀 developer-rules/rules/ 裡的所有規範，然後繼續 [任務]。」
