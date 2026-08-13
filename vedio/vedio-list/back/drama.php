<?php
$typeLabels = [
    'variety' => '綜藝',
    'drama' => '戲劇',
];
$rows = $Drama->all(" ORDER BY `rank` ASC, `id` ASC");
?>

<section>
    <h2 class="section-title">追劇管理</h2>
    <div class="admin-toolbar">
        <a href="?do=add">新增作品</a>
    </div>

    <div class="drama-list">
        <?php foreach ($rows as $idx => $row): ?>
            <?php
            $prev = ($idx === 0) ? $row['id'] : $rows[$idx - 1]['id'];
            $next = ($idx === count($rows) - 1) ? $row['id'] : $rows[$idx + 1]['id'];
            $typeText = $typeLabels[$row['type']] ?? $row['type'];
            ?>
            <div class="drama-row">
                <div class="drama-row__info">
                    <strong><?= htmlspecialchars($row['title'], ENT_QUOTES, 'UTF-8') ?></strong><br>
                    <?= htmlspecialchars($typeText . '｜' . $row['platform'], ENT_QUOTES, 'UTF-8') ?><br>
                    進度：第 <?= (int)$row['current_season'] ?> 季・第 <?= (int)$row['current_episode'] ?> 集
                    <?php if (!empty($row['current_position'])): ?>
                        ・<?= htmlspecialchars($row['current_position'], ENT_QUOTES, 'UTF-8') ?>
                    <?php endif; ?>
                </div>
                <div class="drama-row__actions">
                    <button type="button" class="show" data-id="<?= (int)$row['id'] ?>">
                        <?= ((int)$row['sh'] === 1) ? '顯示' : '隱藏' ?>
                    </button>
                    <button type="button" class="switch-rank" data-ids="<?= (int)$row['id'] . '-' . (int)$prev ?>">往上</button>
                    <button type="button" class="switch-rank" data-ids="<?= (int)$row['id'] . '-' . (int)$next ?>">往下</button>
                    <a class="btn-like" href="?do=edit&amp;id=<?= (int)$row['id'] ?>">編輯</a>
                    <button type="button" class="del-drama" data-id="<?= (int)$row['id'] ?>">刪除</button>
                </div>
            </div>
        <?php endforeach; ?>

        <?php if (count($rows) === 0): ?>
            <p class="admin-lead">尚無資料，先新增一部作品吧。</p>
        <?php endif; ?>
    </div>
</section>

<script>
$(".switch-rank").on("click", function () {
    let ids = $(this).data("ids").toString().split("-");
    $.post("./api/sw.php", { ids, table: "Drama" }, function () {
        location.reload();
    });
});

$(".show").on("click", function () {
    let id = $(this).data("id");
    $.post("./api/show.php", { id }, function () {
        location.reload();
    });
});

$(".del-drama").on("click", function () {
    if (!confirm("確定刪除這部作品？")) return;
    let id = $(this).data("id");
    $.post("./api/del.php", { id, table: "Drama" }, function () {
        location.reload();
    });
});
</script>
