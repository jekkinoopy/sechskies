<?php include_once "./api/db.php"; ?>
<!DOCTYPE html>
<html lang="zh-TW">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>水晶男孩｜深夜清單</title>
    <link rel="stylesheet" href="../../assets/css/style.css">
    <link rel="stylesheet" href="../../assets/css/index.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../../assets/css/tablet.css">
    <link rel="stylesheet" href="css/vedio-list.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
</head>

<body class="vedio-list-page">
    <header class="inner-page-header">
        <div class="header-inner site-header-inner">
            <h1 class="main-title">深夜清單</h1>
            <div class="subtitle-wrap">
                <span class="sub-title">DRAMA &amp; VARIETY WATCH LIST</span>
            </div>
        </div>
    </header>

    <nav class="portal-nav" aria-label="水晶男孩推廣部導覽" data-portal-nav></nav>
    <canvas id="particles"></canvas>

    <div class="container">
        <?php
        $do = $_GET['do'] ?? 'main';
        $file = "front/$do.php";
        if (file_exists($file)) {
            include $file;
        } else {
            include "front/main.php";
        }
        ?>
    </div>

    <footer>
        <p>SECHSKIES Fanpage &copy; 2026 - 黃色氣球永遠飄揚</p>
        <a href="https://jekkinoopy.github.io/Portfolio/" class="studio-link" target="_blank" rel="noopener noreferrer">
            Design by <span class="mark_b">Jekkinoopy Studio</span>
        </a>
        <p class="vedio-admin-link"><a href="admin.php">管理後台</a></p>
    </footer>

    <script src="../../assets/js/particles.js"></script>
    <script src="../../assets/js/portal-nav.js"></script>
</body>

</html>
