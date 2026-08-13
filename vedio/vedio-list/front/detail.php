<?php
$id = $_GET['id'] ?? 0;
$row = $Drama->find($id);

if (!$row || (int)$row['sh'] !== 1) {
    echo '<p class="empty-hint">找不到這部作品，或它目前未公開顯示。</p>';
    echo '<p class="empty-hint"><a href="?do=main">回清單</a></p>';
    return;
}

$typeLabels = [
    'variety' => '綜藝',
    'drama' => '戲劇',
];
$statusLabels = [
    'want' => '想看',
    'watching' => '追劇中',
    'done' => '已追完',
    'paused' => '暫停',
    'dropped' => '棄劇',
];

$typeText = $typeLabels[$row['type']] ?? $row['type'];
$statusText = $statusLabels[$row['status']] ?? $row['status'];
?>

<section class="detail-block">
    <span class="detail-block__eyebrow"><?= htmlspecialchars($typeText . '｜' . $row['platform'], ENT_QUOTES, 'UTF-8') ?></span>
    <h2 class="detail-block__title"><?= htmlspecialchars($row['title'], ENT_QUOTES, 'UTF-8') ?></h2>

    <?php if (!empty($row['intro'])): ?>
        <p><?= nl2br(htmlspecialchars($row['intro'], ENT_QUOTES, 'UTF-8')) ?></p>
    <?php endif; ?>

    <div class="detail-block__progress-box">
        <p>
            觀看進度：第 <?= (int)$row['current_season'] ?> 季｜第 <?= (int)$row['current_episode'] ?> 集
            <?php if (!empty($row['current_position'])): ?>
                ｜<?= htmlspecialchars($row['current_position'], ENT_QUOTES, 'UTF-8') ?>
            <?php endif; ?>
        </p>
        <?php if (!empty($row['progress_note'])): ?>
            <p><?= htmlspecialchars($row['progress_note'], ENT_QUOTES, 'UTF-8') ?></p>
        <?php endif; ?>
    </div>

    <p>狀態：<?= htmlspecialchars($statusText, ENT_QUOTES, 'UTF-8') ?>
        <?php if ($row['rating'] !== null && $row['rating'] !== ''): ?>
           　·　評分：<?= htmlspecialchars($row['rating'], ENT_QUOTES, 'UTF-8') ?>
        <?php endif; ?>
    </p>

    <?php if (!empty($row['note'])): ?>
        <p><?= nl2br(htmlspecialchars($row['note'], ENT_QUOTES, 'UTF-8')) ?></p>
    <?php endif; ?>

    <div class="detail-block__actions">
        <?php if (!empty($row['watch_url'])): ?>
            <a class="is-primary" href="<?= htmlspecialchars($row['watch_url'], ENT_QUOTES, 'UTF-8') ?>"
               target="_blank" rel="noopener noreferrer">繼續觀看</a>
        <?php endif; ?>
        <a href="?do=progress&amp;id=<?= (int)$row['id'] ?>">更新進度</a>
        <a href="?do=main">回清單</a>
    </div>
</section>
