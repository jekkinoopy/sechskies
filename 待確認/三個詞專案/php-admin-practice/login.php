<?php
require __DIR__ . '/config.php';
if (loggedIn()) { header('Location: index.php'); exit; }
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    checkCsrf();
    $stmt = $pdo->prepare('SELECT * FROM admins WHERE account = ? AND password = SHA2(?, 256)');
    $stmt->execute([trim($_POST['account'] ?? ''), $_POST['password'] ?? '']);
    if ($admin = $stmt->fetch()) {
        session_regenerate_id(true);
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_account'] = $admin['account'];
        header('Location: index.php'); exit;
    }
    $error = '帳號或密碼錯誤';
}
?>
<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>後台登入</title><link rel="stylesheet" href="style.css"></head>
<body class="loginPage"><main class="loginCard"><p class="eyebrow">THREE WORDS · ADMIN</p><h1>舞台資料管理</h1><p>乙級練習：Session 登入與資料庫驗證</p><?php if ($error): ?><div class="alert"><?=e($error)?></div><?php endif; ?>
<form method="post"><input type="hidden" name="csrf" value="<?=csrf()?>"><label>帳號<input name="account" required autofocus value="admin"></label><label>密碼<input type="password" name="password" required value="1234"></label><button>登入後台</button></form></main></body></html>
