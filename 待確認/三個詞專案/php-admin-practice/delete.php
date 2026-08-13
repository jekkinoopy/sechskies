<?php
require __DIR__ . '/config.php'; requireLogin(); checkCsrf();
$stmt = $pdo->prepare('DELETE FROM stages WHERE id = ?');
$stmt->execute([(int)($_POST['id'] ?? 0)]);
header('Location: index.php');
