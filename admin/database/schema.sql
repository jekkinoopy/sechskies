CREATE DATABASE IF NOT EXISTS sechskies_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sechskies_cms;
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS admin_users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(80) NOT NULL,
    email VARCHAR(190) NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    last_login_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS media_assets (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    display_name VARCHAR(160) NOT NULL,
    original_name VARCHAR(255) NULL,
    file_path VARCHAR(500) NOT NULL,
    media_type ENUM('image','video','pdf','other') NOT NULL DEFAULT 'image',
    mime_type VARCHAR(100) NULL,
    file_size INT UNSIGNED NULL,
    alt_text VARCHAR(255) NULL,
    source_note TEXT NULL,
    category VARCHAR(80) NULL,
    status ENUM('available','draft','archived') NOT NULL DEFAULT 'draft',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS albums (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(120) NOT NULL,
    title_ko VARCHAR(160) NULL,
    release_date DATE NULL,
    era ENUM('classic','reunion') NULL,
    cover_media_id INT UNSIGNED NULL,
    summary TEXT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    status ENUM('draft','coming_soon','published','archived') NOT NULL DEFAULT 'draft',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_albums_cover FOREIGN KEY (cover_media_id) REFERENCES media_assets(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS songs (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    album_id INT UNSIGNED NOT NULL,
    track_no SMALLINT UNSIGNED NULL,
    title VARCHAR(160) NOT NULL,
    title_ko VARCHAR(160) NULL,
    lyrics_url VARCHAR(500) NULL,
    video_url VARCHAR(500) NULL,
    is_title_track TINYINT(1) NOT NULL DEFAULT 0,
    status ENUM('draft','coming_soon','published','archived') NOT NULL DEFAULT 'draft',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_songs_album FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS stage_performances (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    song_id INT UNSIGNED NOT NULL,
    stage_date DATE NOT NULL,
    station VARCHAR(80) NOT NULL,
    program VARCHAR(120) NOT NULL,
    title VARCHAR(160) NOT NULL,
    youtube_url VARCHAR(500) NULL,
    note TEXT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    status ENUM('draft','coming_soon','published','archived') NOT NULL DEFAULT 'draft',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_stage_song FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS concert_events (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tour_name VARCHAR(180) NOT NULL,
    event_date DATE NOT NULL,
    country VARCHAR(80) NULL,
    city VARCHAR(80) NULL,
    venue VARCHAR(180) NULL,
    member_names VARCHAR(255) NULL,
    poster_media_id INT UNSIGNED NULL,
    source_url VARCHAR(500) NULL,
    notes TEXT NULL,
    status ENUM('draft','coming_soon','published','archived') NOT NULL DEFAULT 'draft',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_concert_poster FOREIGN KEY (poster_media_id) REFERENCES media_assets(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS variety_shows (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    series_name VARCHAR(180) NULL,
    platform VARCHAR(100) NULL,
    air_start DATE NULL,
    air_end DATE NULL,
    member_names VARCHAR(255) NULL,
    episode_info VARCHAR(100) NULL,
    video_url VARCHAR(500) NULL,
    summary TEXT NULL,
    tags VARCHAR(255) NULL,
    status ENUM('draft','coming_soon','published','archived') NOT NULL DEFAULT 'draft',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS locations (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    visit_date DATE NULL,
    day_label VARCHAR(40) NULL,
    address VARCHAR(255) NULL,
    latitude DECIMAL(10,7) NULL,
    longitude DECIMAL(10,7) NULL,
    member_names VARCHAR(255) NULL,
    description TEXT NULL,
    quote_text TEXT NULL,
    tags VARCHAR(255) NULL,
    media_id INT UNSIGNED NULL,
    source_url VARCHAR(500) NULL,
    sort_order INT NOT NULL DEFAULT 0,
    status ENUM('draft','coming_soon','published','archived') NOT NULL DEFAULT 'draft',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_location_media FOREIGN KEY (media_id) REFERENCES media_assets(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS fan_articles (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    board VARCHAR(100) NOT NULL,
    pub_date DATE NULL,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100) NULL,
    summary TEXT NULL,
    link_url VARCHAR(500) NULL,
    sort_order INT NOT NULL DEFAULT 0,
    status ENUM('draft','coming_soon','published','archived') NOT NULL DEFAULT 'draft',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO fan_articles (board, pub_date, title, author, summary, link_url, sort_order, status) VALUES
('PTT KoreaStar', '2016-05-09', '讓人變廢人的水晶男孩', 'l711470（nao）', '回歸浪潮剛掀起時的深度長文：從 DSP 娛樂當年「專輯只賣 50 萬張」的解散說法談起，逐一點評六人各自的魅力——隊長殷志源的領導力、張水院的獨特氣質、李宰鎮的四次元思維、隱藏成員高志溶的溫暖、主唱姜成勳的顏值歌聲、金在德的忠誠，並向《無限挑戰》讓水晶男孩重回舞台致謝。', 'fan-articles/水晶男孩-六人六色.html', 0, 'published');

CREATE TABLE IF NOT EXISTS variety_member_highlights (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    member_key VARCHAR(20) NOT NULL,
    member_name VARCHAR(50) NOT NULL,
    member_role VARCHAR(60) NULL,
    score INT UNSIGNED NOT NULL DEFAULT 0,
    is_estimate TINYINT(1) NOT NULL DEFAULT 0,
    works TEXT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    status ENUM('draft','coming_soon','published','archived') NOT NULL DEFAULT 'draft',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO variety_member_highlights (member_key, member_name, member_role, score, is_estimate, works, sort_order, status) VALUES
('group', '我是團飯！！六顆都要', NULL, 7, 0, '《無限挑戰》重組特輯\n《無本質青春旅行》\n《三時四餐》\n《不要回頭看》\n《在峇里島的大小事》', 0, 'published'),
('jiwon', '殷志源', 'Leader・Rapper', 50, 1, '《兩天一夜》第一季\n《新西遊記》系列\n《姜食堂》系列', 1, 'published'),
('jaejin', '李宰鎮', 'Rapper・Dancer', 5, 0, '《打工達人的誕生》\n《花樣旅行》\n《全知干預視角》', 2, 'published'),
('jaeduck', '金在德', 'Rapper・Dancer', 10, 1, '《Tony An的魅力TV》\n《介紹美食店的男人》\n《我家的熊孩子》', 3, 'published'),
('sunghoon', '姜成勳', 'Vocalist', 5, 0, '《神秘音樂秀：蒙面歌王》\n《二重唱歌謠祭》\n《能力者們》', 4, 'published'),
('suwon', '張水院', 'Vocalist', 20, 1, '《全知干預視角》\n《演員學校》\n《本月的活動王》', 5, 'published'),
('jiyong', '高志溶', 'Vocalist', 3, 0, '《超人回來了》\n《新穎的整理》\n《非首腦會談》', 6, 'published');

CREATE TABLE IF NOT EXISTS njtw5_blocks (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    block_type ENUM('member','team') NOT NULL DEFAULT 'member',
    slot_class VARCHAR(30) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    title VARCHAR(100) NULL,
    subtitle VARCHAR(150) NULL,
    body TEXT NULL,
    stats TEXT NULL,
    tags VARCHAR(255) NULL,
    face_images VARCHAR(255) NULL,
    status ENUM('draft','coming_soon','published','archived') NOT NULL DEFAULT 'draft',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO njtw5_blocks (block_type, slot_class, sort_order, title, subtitle, body, stats, tags, face_images, status) VALUES
('member', 'm1', 1, '姜鎬臉男 姜鎬童', NULL, '吃得津津有味的鬼怪', '視覺:5\n注目度:5\n可愛:1', '#吃貨精靈 #低聲細語', NULL, 'published'),
('member', 'm2', 2, '鬼娃恰吉 李壽根', NULL, '不搞笑會死的鬼怪', '娃娃美:3\n語言能力:5\n體能:5', '#最強短腿 #瘋狂跑動', NULL, 'published'),
('member', 'm3', 3, '陰間使者 殷志源', NULL, '戴上黑帽子 神志源回來了！', '化妝消化力:7\n黑眼圈:4\n暴走:6', '#瘋子使者 #最帥鬼怪', NULL, 'published'),
('team', 'ob-panel', 4, 'OB 隊：老練的瘋子們', NULL, '看他們玩遊戲不是在看技術，是在看如何「鑽漏洞」和「互相背叛」。他們不用說話，光是一個眼神就能知道對方在想什麼（通常是壞主意）。\n圈粉亮點：鎬童的食量、壽根的即興才藝、志源那種「初丁」卻天才的直覺。\n口頭禪：喔嗚！吃吧！', '老練度:5\n體力值:1', NULL, '1.png,2.png,3.png', 'published'),
('team', 'yb-panel', 5, 'YB 隊：新瘋子隊', NULL, '一開始以為是來幫哥哥們打雜的，結果卻是一個比一個還瘋的「瘋子新秀」。他們擁有體力優勢，卻常常在簡單的常識題中全軍覆沒。\n圈粉亮點：安宰賢的紙片人運動神經、宋旻浩的藝術靈魂與神手指、P.O 的超大聲反應。\n口頭禪：哥！對不起！', '老練度:1\n體力值:5', NULL, '4.png,5.png,6.png', 'published'),
('member', 'm4', 6, '帥氣殭屍 安宰賢', NULL, '美貌&藝能兼具 八面玲瓏的帥氣殭屍', '帥氣度:5\n瘋癲:4\n臉紅紅:2', '#美男殭屍 #運動白痴', NULL, 'published'),
('member', 'm5', 7, '現代鬼 宋旻浩', NULL, '獨特的文藝青年 現代鬼怪', '髮型:3\n清純美:5\n時髦度:7', '#長髮宋 #綜藝神降臨', NULL, 'published'),
('member', 'm6', 8, '德古拉 P.O', NULL, '新血降臨！華麗誤答轟炸機！', '腦力:1\n披風+領子:6\n藝能感:6', '#新弟子 #德古拉', NULL, 'published');

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    admin_user_id INT UNSIGNED NULL,
    action_name VARCHAR(40) NOT NULL,
    entity_type VARCHAR(80) NOT NULL,
    entity_id INT UNSIGNED NULL,
    details_json JSON NULL,
    ip_address VARCHAR(45) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_entity (entity_type, entity_id),
    CONSTRAINT fk_audit_admin FOREIGN KEY (admin_user_id) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB;
