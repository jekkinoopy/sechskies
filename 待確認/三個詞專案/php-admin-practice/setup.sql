CREATE DATABASE IF NOT EXISTS three_words_10th CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE three_words_10th;

CREATE TABLE IF NOT EXISTS admins (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  account VARCHAR(50) NOT NULL UNIQUE,
  password CHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS stages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  stage_date DATE NOT NULL,
  youtube_id VARCHAR(11) NOT NULL,
  station VARCHAR(30) NOT NULL,
  program VARCHAR(100) NOT NULL,
  title VARCHAR(150) NOT NULL,
  note VARCHAR(255) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  is_visible TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO admins (account, password) VALUES ('admin', SHA2('1234', 256));
INSERT INTO stages (stage_date, youtube_id, station, program, title, note, sort_order)
SELECT '2016-12-04', '8HTqr3Wp-R0', 'SBS', '인기가요 · Inkigayo', 'THREE WORDS · Goodbye Stage', '十週年收藏舞台', 10
WHERE NOT EXISTS (SELECT 1 FROM stages WHERE youtube_id = '8HTqr3Wp-R0');
