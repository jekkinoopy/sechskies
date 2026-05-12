

-- 水晶男孩資料庫備份

-- 1. 建立專輯表
CREATE TABLE `albums` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(50) NOT NULL,
  `release_date` DATE
);

-- 2. 建立歌曲表
CREATE TABLE `songs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `album_id` INT NOT NULL,
  `title` VARCHAR(100) NOT NULL
);

-- 3. 匯入專輯資料
INSERT INTO `albums` (`id`, `title`, `release_date`) VALUES
(1, '學園別曲', '1997-05-14'),
(2, 'Welcome To The Sechskies Land', '1997-11-01'),
(3, 'Road Fighter', '1998-07-15');

-- 4. 匯入第一張專輯曲目
INSERT INTO `songs` (`album_id`, `title`) 
VALUES              (1, '學園別曲'), 
                    (1, '戀情'), 
                    (1, '男兒之路（品生品死）'), 
                    (1, '確認'), 
                    (1, '背叛感'), 
                    (1, '請記得好嗎'), 
                    (1, 'Walking In The Rain'), 
                    (1, 'Dream Comes True'), 
                    (1, '愛的宣言'), 
                    (1, '一起來吧'), 
                    (1, '戀情（Remix）'), 
                    (1, '男兒之路（品生品死）（Remix）');