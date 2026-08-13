<?php
require __DIR__ . '/config.php'; requireLogin(); checkCsrf();
$id = (int)($_POST['id'] ?? 0);
$youtube = youtubeId(trim($_POST['youtube_url'] ?? ''));
if (!$youtube) exit('YouTube 網址或 ID 格式錯誤');
$data = [$_POST['stage_date'] ?? '', $youtube, trim($_POST['station'] ?? ''), trim($_POST['program'] ?? ''), trim($_POST['title'] ?? ''), trim($_POST['note'] ?? ''), (int)($_POST['sort_order'] ?? 0), isset($_POST['is_visible']) ? 1 : 0];
if ($id) {
    $stmt = $pdo->prepare('UPDATE stages SET stage_date=?,youtube_id=?,station=?,program=?,title=?,note=?,sort_order=?,is_visible=? WHERE id=?');
    $data[] = $id; $stmt->execute($data);
} else {
    $stmt = $pdo->prepare('INSERT INTO stages(stage_date,youtube_id,station,program,title,note,sort_order,is_visible) VALUES(?,?,?,?,?,?,?,?)');
    $stmt->execute($data);
}
header('Location: index.php');
