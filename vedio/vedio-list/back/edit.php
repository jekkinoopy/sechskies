<?php
$id = $_GET['id'] ?? 0;
$row = $Drama->find($id);

if (!$row) {
    echo '<p class="admin-lead">找不到這筆資料。</p>';
    return;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $row['title'] = trim($_POST['title'] ?? $row['title']);
    $row['type'] = $_POST['type'] ?? $row['type'];
    $row['platform'] = $_POST['platform'] ?? $row['platform'];
    $row['watch_url'] = trim($_POST['watch_url'] ?? '');
    $row['current_season'] = max(1, (int)($_POST['current_season'] ?? 1));
    $row['current_episode'] = max(0, (int)($_POST['current_episode'] ?? 0));
    $row['current_position'] = trim($_POST['current_position'] ?? '');
    $row['progress_note'] = trim($_POST['progress_note'] ?? '');
    $row['status'] = $_POST['status'] ?? $row['status'];
    $row['rating'] = ($_POST['rating'] !== '') ? $_POST['rating'] : '';
    $row['intro'] = trim($_POST['intro'] ?? '');
    $row['note'] = trim($_POST['note'] ?? '');
    $Drama->save($row);
    to("?do=drama");
    exit;
}
?>

<section>
    <h2 class="section-title">編輯作品</h2>

    <form class="admin-form" method="post" action="?do=edit&amp;id=<?= (int)$row['id'] ?>">
        <label for="title">劇名／節目名</label>
        <input type="text" id="title" name="title" required
               value="<?= htmlspecialchars($row['title'], ENT_QUOTES, 'UTF-8') ?>">

        <label for="type">類型</label>
        <select id="type" name="type">
            <option value="variety"<?= $row['type'] === 'variety' ? ' selected' : '' ?>>綜藝</option>
            <option value="drama"<?= $row['type'] === 'drama' ? ' selected' : '' ?>>戲劇</option>
        </select>

        <label for="platform">上架平台</label>
        <select id="platform" name="platform">
            <?php
            $platforms = ['Netflix', 'Disney+', 'friDay影音', '愛奇藝', 'LINE TV', 'YouTube', '其他'];
            foreach ($platforms as $p):
            ?>
                <option value="<?= htmlspecialchars($p, ENT_QUOTES, 'UTF-8') ?>"<?= $row['platform'] === $p ? ' selected' : '' ?>>
                    <?= htmlspecialchars($p, ENT_QUOTES, 'UTF-8') ?>
                </option>
            <?php endforeach; ?>
        </select>

        <label for="watch_url">直接觀看網址</label>
        <input type="url" id="watch_url" name="watch_url"
               value="<?= htmlspecialchars($row['watch_url'] ?? '', ENT_QUOTES, 'UTF-8') ?>"
               placeholder="https://...">

        <label for="current_season">目前看到第幾季</label>
        <input type="number" id="current_season" name="current_season" min="1"
               value="<?= (int)$row['current_season'] ?>">

        <label for="current_episode">目前看到第幾集</label>
        <input type="number" id="current_episode" name="current_episode" min="0"
               value="<?= (int)$row['current_episode'] ?>">

        <label for="current_position">這一集看到哪裡</label>
        <input type="text" id="current_position" name="current_position"
               value="<?= htmlspecialchars($row['current_position'] ?? '', ENT_QUOTES, 'UTF-8') ?>">

        <label for="progress_note">進度情節備註</label>
        <input type="text" id="progress_note" name="progress_note"
               value="<?= htmlspecialchars($row['progress_note'] ?? '', ENT_QUOTES, 'UTF-8') ?>">

        <label for="status">狀態</label>
        <select id="status" name="status">
            <?php
            $statuses = [
                'want' => '想看',
                'watching' => '追劇中',
                'done' => '已追完',
                'paused' => '暫停',
                'dropped' => '棄劇',
            ];
            foreach ($statuses as $key => $label):
            ?>
                <option value="<?= $key ?>"<?= $row['status'] === $key ? ' selected' : '' ?>><?= $label ?></option>
            <?php endforeach; ?>
        </select>

        <label for="rating">評分</label>
        <input type="number" id="rating" name="rating" min="0" max="10" step="0.1"
               value="<?= htmlspecialchars($row['rating'] ?? '', ENT_QUOTES, 'UTF-8') ?>">

        <label for="intro">簡介</label>
        <textarea id="intro" name="intro" rows="4"><?= htmlspecialchars($row['intro'] ?? '', ENT_QUOTES, 'UTF-8') ?></textarea>

        <label for="note">心得備註</label>
        <textarea id="note" name="note" rows="3"><?= htmlspecialchars($row['note'] ?? '', ENT_QUOTES, 'UTF-8') ?></textarea>

        <div class="form-actions" style="margin-top:1.25rem;display:flex;gap:10px;justify-content:center;">
            <button type="submit" class="is-primary" style="min-height:40px;padding:0.4rem 1.05rem;border-radius:999px;border:2px solid var(--color-brand);background:var(--color-brand);font-weight:700;cursor:pointer;">儲存</button>
            <a href="?do=drama" style="min-height:40px;padding:0.4rem 1.05rem;border-radius:999px;border:2px solid rgba(255,204,0,0.35);background:#fff;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;">取消</a>
        </div>
    </form>
</section>
