# 筆記：`extra/totoga2-video.html`（助手用，不對讀者顯示）

對應檔案：`extra/totoga2-video.html`。

- 以下為 Bilibili 嵌入播放器（16：9）。請用上集／中集／下集分頁切換；若無法播放請至站內搜尋同一 BV 號。中集、下集可將 iframe 的 `bvid` 換成分集連結。
- 中集、下集 iframe 使用 `data-src`，第一次切到該分頁時由頁內 script 寫入 `src`；改連結時請改 `data-src`（或已寫入後的 `src`）。
- 目前中／下集預設與上集同一 BV，僅作占位；正式替換時改各分頁 iframe 的 `data-src` 即可。
- 此頁 `body.totoga2-video-copy-page` 會覆寫 `.map-archive-header` 的整屏高度（`100vh`／`100dvh`），避免與導覽、影片疊加後出現整頁直向捲軸；其他全屏 banner 頁不受影響。
- 資訊架構：頂部黃色列僅 **上集／中集／下集**（`role="tab"`）；四入口為 `totoga2/` 下 `timeline.html`、`ebook.html`、`readable.html`、`video.html`，頁內四鈕列共用 `split-nav.css`。
