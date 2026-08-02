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

CREATE TABLE IF NOT EXISTS dance_applications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(80) NOT NULL,
    email VARCHAR(190) NOT NULL,
    dance_years TINYINT UNSIGNED NULL,
    available_date DATE NULL,
    attended_20th ENUM('attended','watched_video','first_time') NULL,
    participate_content VARCHAR(255) NOT NULL,
    song VARCHAR(80) NULL,
    reference_file_name VARCHAR(100) NULL,
    reference_original_name VARCHAR(255) NULL,
    reference_mime_type VARCHAR(100) NULL,
    reference_file_size INT UNSIGNED NULL,
    message_30th TEXT NULL,
    status ENUM('new','contacted','confirmed','declined','archived') NOT NULL DEFAULT 'new',
    admin_notes TEXT NULL,
    submitted_ip VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_dance_applications_status_created (status, created_at),
    INDEX idx_dance_applications_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS dance_practice_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(160) NOT NULL,
    tags VARCHAR(255) NULL,
    practice_focus TEXT NOT NULL,
    video_url VARCHAR(500) NULL,
    difficulty ENUM('easy','medium','hard') NOT NULL DEFAULT 'medium',
    progress_status ENUM('not_started','practicing','review','completed') NOT NULL DEFAULT 'not_started',
    note_text VARCHAR(255) NULL,
    is_featured TINYINT(1) NOT NULL DEFAULT 0,
    sort_order INT NOT NULL DEFAULT 0,
    status ENUM('draft','coming_soon','published','archived') NOT NULL DEFAULT 'draft',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_dance_practice_order (status, sort_order, id),
    INDEX idx_dance_practice_title (title)
) ENGINE=InnoDB;

INSERT INTO dance_practice_items
    (title, tags, practice_focus, difficulty, progress_status, note_text, is_featured, sort_order, status)
SELECT 'Couple', 'Dance,Vocal', '副歌動作、隊形感、甜感表情', 'easy', 'not_started', '可作為第一首示範歌', 1, 10, 'published'
WHERE NOT EXISTS (SELECT 1 FROM dance_practice_items WHERE title = 'Couple');

INSERT INTO dance_practice_items
    (title, tags, practice_focus, difficulty, progress_status, note_text, is_featured, sort_order, status)
SELECT 'Com'' Back', 'Dance,Rap', '強拍、Rap 段落、舞台氣勢', 'medium', 'not_started', '未來擴充', 0, 20, 'coming_soon'
WHERE NOT EXISTS (SELECT 1 FROM dance_practice_items WHERE title = 'Com'' Back');

INSERT INTO dance_practice_items
    (title, tags, practice_focus, difficulty, progress_status, note_text, is_featured, sort_order, status)
SELECT 'Road Fighter', 'Dance,Rap,Performance', '節奏、力量、舞台感', 'hard', 'not_started', '未來擴充', 0, 30, 'coming_soon'
WHERE NOT EXISTS (SELECT 1 FROM dance_practice_items WHERE title = 'Road Fighter');

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
