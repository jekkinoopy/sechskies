-- 深夜清單 / 追劇資料庫
-- 本機 XAMPP：phpMyAdmin 匯入此檔即可

CREATE DATABASE IF NOT EXISTS `vedio_list` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `vedio_list`;

DROP TABLE IF EXISTS `dramas`;

CREATE TABLE `dramas` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL COMMENT '劇名／節目名',
  `type` varchar(20) NOT NULL DEFAULT 'drama' COMMENT 'variety=綜藝, drama=戲劇',
  `platform` varchar(50) NOT NULL COMMENT '上架平台',
  `watch_url` varchar(500) DEFAULT NULL COMMENT '作品直接觀看網址',
  `current_season` int(10) UNSIGNED NOT NULL DEFAULT 1 COMMENT '目前第幾季',
  `current_episode` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '目前第幾集',
  `current_position` varchar(50) DEFAULT NULL COMMENT '該集看到的位置',
  `progress_note` varchar(255) DEFAULT NULL COMMENT '進度情節備註',
  `status` varchar(20) NOT NULL DEFAULT 'watching' COMMENT 'want/watching/done/paused/dropped',
  `rating` decimal(3,1) DEFAULT NULL COMMENT '評分',
  `intro` text COMMENT '簡介',
  `note` text COMMENT '心得備註',
  `sh` tinyint(1) UNSIGNED NOT NULL DEFAULT 1 COMMENT '是否顯示',
  `rank` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '排列順序',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `dramas`
(`title`, `type`, `platform`, `watch_url`, `current_season`, `current_episode`, `current_position`, `progress_note`, `status`, `rating`, `intro`, `note`, `sh`, `rank`)
VALUES
(
  '三傻遊肯亞',
  'variety',
  'Netflix',
  'https://www.netflix.com/title/82031207',
  1,
  2,
  '28:40',
  '三人剛被扔進野外，表情比獅子還慌。',
  'watching',
  8.5,
  '三個人、一座肯亞，以及無數個「這也能出事？」的現場。笑點來得又急又野，像把旅行節目的安全感整袋拆掉，只留下腎上腺素與默契。',
  '羅PD 首登 Netflix；志源在裡面，小黃更沒有藉口不補。',
  1,
  1
),
(
  '請回答1997',
  'drama',
  'Disney+',
  'https://www.disneyplus.com/en-tw/browse/entity-3979fb82-8681-44e8-b7be-e313091f0d73',
  1,
  5,
  '41:12',
  '宿舍夜談剛結束，收音機還在響，心卻已經開始亂。',
  'watching',
  9.0,
  '把 1997 寫進宿舍、收音機與那一聲來不及說出口的喜歡。甜的時候甜到發亮，疼的時候又老實得讓人不敢快轉。',
  '下一集容易哭，衛生紙先備好。',
  1,
  2
);
