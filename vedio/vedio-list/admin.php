<?php include_once "./api/db.php"; ?>
<!DOCTYPE html>
<html lang="zh-TW">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>影片清單｜管理後台</title>
    <link rel="stylesheet" href="../../assets/css/style.css">
    <link rel="stylesheet" href="css/vedio-list.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
</head>

<body class="vedio-admin-page">
    <header class="inner-page-header">
        <div class="header-inner site-header-inner">
            <h1 class="main-title">影片清單後台</h1>
            <div class="subtitle-wrap">
                <span class="sub-title">ADMIN · CRUD</span>
            </div>
        </div>
    </header>

    <div class="container admin-wrap">
        <nav class="admin-nav">
            <a href="index.php">回前台</a>
            <a href="admin.php">後台首頁</a>
            <a href="?do=drama">追劇管理</a>
            <a href="?do=add">新增作品</a>
        </nav>

        <?php
        $do = $_GET['do'] ?? 'main';
        $file = "back/$do.php";
        if (file_exists($file)) {
            include $file;
        } else {
            include "back/main.php";
        }
        ?>
    </div>
</body>

</html>
