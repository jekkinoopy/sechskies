<?php
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

$filter = $_GET['type'] ?? 'all';
$where = ['sh' => 1];
if ($filter === 'variety' || $filter === 'drama') {
    $where['type'] = $filter;
}
$rows = $Drama->all($where, " ORDER BY `rank` ASC, `id` ASC");
?>

<section class="vedio-intro">
    <h2 class="section-title">正在追的那些夜晚</h2>
    <p>
        有些夜晚適合考古黃色奇蹟，有些夜晚則是——螢幕一亮，人就栽進另一個世界。
        綜藝裡的失控笑聲、戲劇裡的心跳停拍，都值得被好好記下來：看到哪一季、哪一集、哪一句台詞剛把你釘在沙發上。
    </p>
    <p>
        這裡的清單來自資料庫：類型先分<span class="mark_y">綜藝</span>與<span class="mark_b">戲劇</span>，
        進度與「繼續觀看」入口都能改。慢慢養也很好看。
    </p>
</section>

<section class="list-section" aria-labelledby="vedio-list-heading">
    <h2 class="section-title" id="vedio-list-heading">追劇清單</h2>
    <p class="list-lead">先用類型找——綜藝還是戲劇，跟 OTT 首頁那排分類一樣直覺。</p>

    <div class="type-tabs" role="tablist" aria-label="作品類型">
        <a class="type-tab<?= $filter === 'all' ? ' is-active' : '' ?>" href="?do=main&amp;type=all">全部</a>
        <a class="type-tab<?= $filter === 'variety' ? ' is-active' : '' ?>" href="?do=main&amp;type=variety">綜藝</a>
        <a class="type-tab<?= $filter === 'drama' ? ' is-active' : '' ?>" href="?do=main&amp;type=drama">戲劇</a>
    </div>

    <?php if (count($rows) === 0): ?>
        <p class="empty-hint">這個類型目前還沒有作品——換「全部」看看，或到後台新增一筆。</p>
    <?php else: ?>
        <div class="drama-grid">
            <?php foreach ($rows as $row): ?>
                <?php
                $typeText = $typeLabels[$row['type']] ?? $row['type'];
                $statusText = $statusLabels[$row['status']] ?? $row['status'];
                $posterLabel = htmlspecialchars(strtoupper($row['platform']) . ' · ' . $typeText, ENT_QUOTES, 'UTF-8');
                ?>
                <article class="drama-card" data-type="<?= htmlspecialchars($row['type'], ENT_QUOTES, 'UTF-8') ?>">
                    <div class="drama-card__poster" aria-hidden="true"><?= $posterLabel ?></div>
                    <div class="drama-card__meta">
                        <span class="drama-tag"><?= htmlspecialchars($typeText, ENT_QUOTES, 'UTF-8') ?></span>
                        <span class="drama-tag drama-tag--platform"><?= htmlspecialchars($row['platform'], ENT_QUOTES, 'UTF-8') ?></span>
                    </div>
                    <h3 class="drama-card__title"><?= htmlspecialchars($row['title'], ENT_QUOTES, 'UTF-8') ?></h3>
                    <p class="drama-card__progress">
                        觀看進度：第 <?= (int)$row['current_season'] ?> 季・第 <?= (int)$row['current_episode'] ?> 集
                        <?php if (!empty($row['current_position'])): ?>
                            ・看到 <?= htmlspecialchars($row['current_position'], ENT_QUOTES, 'UTF-8') ?>
                        <?php endif; ?>
                    </p>
                    <?php if (!empty($row['progress_note'])): ?>
                        <p class="drama-card__note"><?= htmlspecialchars($row['progress_note'], ENT_QUOTES, 'UTF-8') ?></p>
                    <?php else: ?>
                        <p class="drama-card__note">狀態：<?= htmlspecialchars($statusText, ENT_QUOTES, 'UTF-8') ?></p>
                    <?php endif; ?>
                    <div class="drama-card__actions">
                        <?php if (!empty($row['watch_url'])): ?>
                            <a class="is-primary" href="<?= htmlspecialchars($row['watch_url'], ENT_QUOTES, 'UTF-8') ?>"
                               target="_blank" rel="noopener noreferrer">繼續觀看</a>
                        <?php endif; ?>
                        <a href="?do=detail&amp;id=<?= (int)$row['id'] ?>">查看詳情</a>
                        <a href="?do=progress&amp;id=<?= (int)$row['id'] ?>">更新進度</a>
                    </div>
                </article>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</section>
