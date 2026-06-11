# 💎 水晶男孩推廣部：SQL 三日修煉手冊

> **任務清單 (SOP)**
> * style(file): 檔案命名為 .md
> * fix(db): 確保最後不帶多餘逗號
> * perf(save): 隨手 Ctrl + S 存檔

---

## 📅 DAY 1：連連看基礎 (JOIN)
**邏輯**：用 album_id 把「歌曲」與「專輯」黏起來。
### 1. 傳統連表 (WHERE)
```sql
SELECT songs.title, albums.title 
FROM songs, albums 
WHERE songs.album_id = albums.id 
ORDER BY songs.id;
```

### 2. 標準內連線 (INNER JOIN)
```sql
SELECT songs.title, albums.title 
FROM songs
INNER JOIN albums ON songs.album_id = albums.id 
ORDER BY songs.id;
```
### 3. 左外連線 (LEFT JOIN)
```sql
SELECT songs.title, albums.title 
FROM songs
LEFT JOIN albums ON songs.album_id = albums.id;
```
### 4. 右外連線 (RIGHT JOIN)
```
SELECT songs.title, albums.title 
FROM songs
RIGHT JOIN albums ON songs.album_id = albums.id;
```
## 📅 DAY 2：資料美化與彙整
**邏輯**：處理空值與統計數量。

### 1. 處理空值 (IFNULL)
```sql
SELECT 
    IFNULL(songs.title, '未命名') AS '歌名',
    IFNULL(albums.title, '未知') AS '專輯'
FROM songs
RIGHT JOIN albums ON songs.album_id = albums.id;
```
### 2. 分組統計 (COUNT)
```sql
SELECT 
    albums.title AS '專輯名稱',
    COUNT(songs.id) AS '歌曲總數'
FROM albums
LEFT JOIN songs ON albums.id = songs.album_id
GROUP BY albums.id;
```
## 📅 DAY 3：魔王級子查詢 (Subquery)

### 1. 巢狀條件查詢
```sql
SELECT * FROM songs 
WHERE album_id = (SELECT id FROM albums WHERE title = 'Road Fighter');
```
-- 在每首歌後面顯示目前所有歌曲 album_id 的平均值（對比用）

### 2.多表關聯查詢
```sql
-- 邏輯：同時連三張表（歌曲、專輯、成員）
SELECT 
    songs.title AS '歌名',
    albums.title AS '專輯名稱',
    albums.release_date AS '發行日期'
FROM 
    songs, 
    albums
WHERE 
    songs.album_id = albums.id AND 
    albums.id = 1; -- 這裡的 1 代表第一張專輯（對應老師的 dept=1）

```
### 3. 計算式子查詢
```sql
SELECT 
    title, 
    album_id, 
    (SELECT AVG(album_id) FROM songs) AS '全庫平均編號'
FROM 
    songs;
```


## 🛠 努比的開發 SOP 筆記
- **feat(db)**: 修改語法後先按 `Ctrl + S` 存檔。
- **style(code)**: 關鍵字大寫，欄位名小寫。
- **fix(db)**: 確保最後一個欄位沒有多餘的逗號。
- **perf(note)**: 執行成功後，截圖貼到你的筆記網站。