<?php
declare(strict_types=1);

session_start();
$config = require __DIR__ . '/config.php';

function db(): PDO
{
    static $pdo;
    global $config;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    $db = $config['db'];
    $dsn = "mysql:host={$db['host']};port={$db['port']};dbname={$db['name']};charset=utf8mb4";
    $pdo = new PDO($dsn, $db['user'], $db['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
}

function h(?string $value): string
{
    return htmlspecialchars($value ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function redirect(string $path): never
{
    header('Location: ' . $path);
    exit;
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function verify_csrf(): void
{
    $token = (string) ($_POST['csrf'] ?? '');
    if (!hash_equals((string) ($_SESSION['csrf'] ?? ''), $token)) {
        http_response_code(419);
        exit('表單已過期，請返回後重新操作。');
    }
}

function require_login(): void
{
    if (empty($_SESSION['admin_id'])) {
        redirect('login.php');
    }
}

function flash(string $type, string $message): void
{
    $_SESSION['flash'] = ['type' => $type, 'message' => $message];
}

function take_flash(): ?array
{
    $flash = $_SESSION['flash'] ?? null;
    unset($_SESSION['flash']);
    return is_array($flash) ? $flash : null;
}

function modules(): array
{
    return [
        'albums' => [
            'label' => '專輯管理', 'icon' => 'disc', 'table' => 'albums', 'order' => 'release_date DESC, id DESC',
            'fields' => [
                'title' => ['label' => '專輯名稱', 'type' => 'text', 'required' => true],
                'title_ko' => ['label' => '韓文／英文名稱', 'type' => 'text'],
                'release_date' => ['label' => '發行日期', 'type' => 'date'],
                'era' => ['label' => '時期', 'type' => 'select', 'options' => ['classic' => '輝煌全盛期', 'reunion' => '啟動新篇章']],
                'cover_media_id' => ['label' => '封面媒體編號', 'type' => 'number'],
                'summary' => ['label' => '專輯簡介', 'type' => 'textarea'],
                'sort_order' => ['label' => '排序', 'type' => 'number', 'default' => '0'],
                'status' => ['label' => '公開狀態', 'type' => 'status', 'required' => true],
            ],
            'list' => ['title', 'release_date', 'era', 'status', 'updated_at'],
        ],
        'songs' => [
            'label' => '歌曲管理', 'icon' => 'music-note-list', 'table' => 'songs', 'order' => 'album_id, track_no, id',
            'fields' => [
                'album_id' => ['label' => '所屬專輯', 'type' => 'relation', 'table' => 'albums', 'required' => true],
                'track_no' => ['label' => '曲序', 'type' => 'number'],
                'title' => ['label' => '歌名', 'type' => 'text', 'required' => true],
                'title_ko' => ['label' => '韓文歌名', 'type' => 'text'],
                'lyrics_url' => ['label' => '歌詞頁連結', 'type' => 'url'],
                'video_url' => ['label' => '影片連結', 'type' => 'url'],
                'is_title_track' => ['label' => '主打歌', 'type' => 'checkbox'],
                'status' => ['label' => '公開狀態', 'type' => 'status', 'required' => true],
            ],
            'list' => ['title', 'album_id', 'track_no', 'is_title_track', 'status', 'updated_at'],
        ],
        'concerts' => [
            'label' => '演唱會管理', 'icon' => 'ticket-perforated', 'table' => 'concert_events', 'order' => 'event_date DESC, id DESC',
            'fields' => [
                'tour_name' => ['label' => '巡演／活動名稱', 'type' => 'text', 'required' => true],
                'event_date' => ['label' => '演出日期', 'type' => 'date', 'required' => true],
                'country' => ['label' => '國家', 'type' => 'text'],
                'city' => ['label' => '城市', 'type' => 'text'],
                'venue' => ['label' => '場館', 'type' => 'text'],
                'member_names' => ['label' => '演出成員', 'type' => 'text'],
                'poster_media_id' => ['label' => '海報媒體編號', 'type' => 'number'],
                'source_url' => ['label' => '資料來源', 'type' => 'url'],
                'notes' => ['label' => '備註', 'type' => 'textarea'],
                'status' => ['label' => '公開狀態', 'type' => 'status', 'required' => true],
            ],
            'list' => ['tour_name', 'event_date', 'city', 'venue', 'status', 'updated_at'],
        ],
        'variety' => [
            'label' => '綜藝節目管理', 'icon' => 'tv', 'table' => 'variety_shows', 'order' => 'air_start DESC, id DESC',
            'fields' => [
                'title' => ['label' => '節目名稱', 'type' => 'text', 'required' => true],
                'series_name' => ['label' => '系列／單元', 'type' => 'text'],
                'platform' => ['label' => '播出平台', 'type' => 'text'],
                'air_start' => ['label' => '開始日期', 'type' => 'date'],
                'air_end' => ['label' => '結束日期', 'type' => 'date'],
                'member_names' => ['label' => '參與成員', 'type' => 'text'],
                'episode_info' => ['label' => '集數', 'type' => 'text'],
                'video_url' => ['label' => '影片連結', 'type' => 'url'],
                'summary' => ['label' => '節目簡介', 'type' => 'textarea'],
                'tags' => ['label' => '標籤', 'type' => 'text'],
                'status' => ['label' => '公開狀態', 'type' => 'status', 'required' => true],
            ],
            'list' => ['title', 'platform', 'air_start', 'member_names', 'status', 'updated_at'],
        ],
        'locations' => [
            'label' => 'Yellow Note', 'icon' => 'geo-alt', 'table' => 'locations', 'order' => 'visit_date DESC, sort_order, id',
            'fields' => [
                'title' => ['label' => '地點名稱', 'type' => 'text', 'required' => true],
                'visit_date' => ['label' => '行程日期', 'type' => 'date'],
                'day_label' => ['label' => '日次', 'type' => 'text'],
                'address' => ['label' => '地址', 'type' => 'text'],
                'latitude' => ['label' => '緯度', 'type' => 'number', 'step' => 'any'],
                'longitude' => ['label' => '經度', 'type' => 'number', 'step' => 'any'],
                'member_names' => ['label' => '參與成員', 'type' => 'text'],
                'description' => ['label' => '行程說明', 'type' => 'textarea'],
                'quote_text' => ['label' => '引言', 'type' => 'textarea'],
                'tags' => ['label' => '標籤', 'type' => 'text'],
                'media_id' => ['label' => '圖片媒體編號', 'type' => 'number'],
                'source_url' => ['label' => '來源連結', 'type' => 'url'],
                'sort_order' => ['label' => '排序', 'type' => 'number', 'default' => '0'],
                'status' => ['label' => '公開狀態', 'type' => 'status', 'required' => true],
            ],
            'list' => ['title', 'visit_date', 'member_names', 'tags', 'status', 'updated_at'],
        ],
        'media' => [
            'label' => '媒體庫', 'icon' => 'images', 'table' => 'media_assets', 'order' => 'id DESC',
            'fields' => [
                'display_name' => ['label' => '管理名稱', 'type' => 'text', 'required' => true],
                'file_path' => ['label' => '檔案', 'type' => 'file'],
                'media_type' => ['label' => '類型', 'type' => 'select', 'default' => 'image', 'options' => ['image' => '圖片', 'video' => '影片', 'pdf' => 'PDF', 'other' => '其他']],
                'alt_text' => ['label' => '替代文字', 'type' => 'text'],
                'source_note' => ['label' => '來源／授權註記', 'type' => 'textarea'],
                'category' => ['label' => '分類', 'type' => 'text'],
                'status' => ['label' => '使用狀態', 'type' => 'select', 'default' => 'draft', 'options' => ['available' => '可使用', 'draft' => '待整理', 'archived' => '封存']],
            ],
            'list' => ['display_name', 'media_type', 'category', 'file_path', 'status', 'updated_at'],
        ],
    ];
}

function module_config(string $key): array
{
    $all = modules();
    if (!isset($all[$key])) {
        http_response_code(404);
        exit('找不到管理模組。');
    }
    return $all[$key];
}

function status_label(string $status): string
{
    return ['draft' => '草稿', 'coming_soon' => '籌備中', 'published' => '公開', 'archived' => '封存', 'available' => '可使用'][$status] ?? $status;
}

function audit(string $action, string $entityType, ?int $entityId, array $details = []): void
{
    $stmt = db()->prepare('INSERT INTO audit_logs (admin_user_id, action_name, entity_type, entity_id, details_json, ip_address) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->execute([$_SESSION['admin_id'] ?? null, $action, $entityType, $entityId, json_encode($details, JSON_UNESCAPED_UNICODE), $_SERVER['REMOTE_ADDR'] ?? null]);
}

function render_header(string $title, string $active = ''): void
{
    global $config;
    $flash = take_flash();
    $mods = modules();
    ?>
<!doctype html>
<html lang="zh-Hant">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= h($title) ?>｜<?= h($config['site_name']) ?> Admin</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="assets/admin.css">
</head>
<body>
<header class="admin-topbar">
    <a class="admin-brand" href="index.php" aria-label="水晶男孩推廣部後台首頁">
        <img class="admin-brand__logo" src="../assets/images/logov.svg" alt="SECHSKIES 水晶男孩推廣部">
        <small>Admin</small>
    </a>
    <div class="admin-topbar__actions"><span><?= h($_SESSION['admin_name'] ?? '') ?></span><a href="../index.html" target="_blank" rel="noopener">查看前臺</a><a href="logout.php">登出</a></div>
</header>
<div class="admin-shell">
    <aside class="admin-sidebar" id="admin-sidebar">
        <nav aria-label="後臺管理選單">
            <a class="<?= $active === 'dashboard' ? 'active' : '' ?>" href="index.php"><i class="bi bi-speedometer2"></i>控制台</a>
            <p>內容資料</p>
            <?php foreach ($mods as $key => $mod): ?>
                <a class="<?= $active === $key ? 'active' : '' ?>" href="records.php?module=<?= h($key) ?>"><i class="bi bi-<?= h($mod['icon']) ?>"></i><?= h($mod['label']) ?></a>
            <?php endforeach; ?>
            <p>系統</p>
            <a class="<?= $active === 'publishing' ? 'active' : '' ?>" href="publishing.php"><i class="bi bi-eye"></i>公開狀態</a>
            <a class="<?= $active === 'admins' ? 'active' : '' ?>" href="admins.php"><i class="bi bi-shield-lock"></i>管理者帳號</a>
        </nav>
    </aside>
    <main class="admin-main">
        <button class="sidebar-toggle" type="button" data-sidebar-toggle aria-label="開啟管理選單"><i class="bi bi-list"></i></button>
        <?php if ($flash): ?><div class="notice notice--<?= h($flash['type']) ?>"><?= h($flash['message']) ?></div><?php endif; ?>
        <div class="page-heading"><div><p class="eyebrow">CONTENT MANAGEMENT</p><h1><?= h($title) ?></h1></div></div>
    <?php
}

function render_footer(): void
{
    ?>
    </main>
</div>
<script src="assets/admin.js"></script>
</body>
</html>
    <?php
}
