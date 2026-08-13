<?php
require __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');
$rows = $pdo->query('SELECT stage_date,youtube_id,station,program,title,note,sort_order FROM stages WHERE is_visible=1 ORDER BY sort_order,stage_date,id')->fetchAll();
echo json_encode(['stages'=>$rows], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
