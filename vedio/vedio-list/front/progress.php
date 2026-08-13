<?php
$id = $_GET['id'] ?? 0;
$row = $Drama->find($id);

if (!$row) {
    echo '<p class="empty-hint">找不到這部作品。</p>';
    echo '<p class="empty-hint"><a href="?do=main">回清單</a></p>';
    return;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $row['current_season'] = max(1, (int)($_POST['current_season'] ?? 1));
    $row['current_episode'] = max(0, (int)($_POST['current_episode'] ?? 0));
    $row['current_position'] = trim($_POST['current_position'] ?? '');
    $row['progress_note'] = trim($_POST['progress_note'] ?? '');
    $row['status'] = $_POST['status'] ?? $row['status'];
    $Drama->save($row);
    to("?do=detail&id=" . (int)$row['id']);
    exit;
}
?>

<section class="vedio-intro">
    <h2 class="section-title">更新進度</h2>
    <p>記下你停在哪一季、哪一集、哪一秒——以及當時螢幕上正在發生什麼，之後才找得回那個心跳瞬間。</p>
</section>

<form class="progress-form" method="post" action="?do=progress&amp;id=<?= (int)$row['id'] ?>">
    <h3 class="drama-card__title"><?= htmlspecialchars($row['title'], ENT_QUOTES, 'UTF-8') ?></h3>

    <label for="current_season">目前看到第幾季</label>
    <input type="number" id="current_season" name="current_season" min="1"
           value="<?= (int)$row['current_season'] ?>">

    <label for="current_episode">目前看到第幾集</label>
    <input type="number" id="current_episode" name="current_episode" min="0"
           value="<?= (int)$row['current_episode'] ?>">

    <label for="current_position">這一集看到哪裡</label>
    <input type="text" id="current_position" name="current_position"
           value="<?= htmlspecialchars($row['current_position'] ?? '', ENT_QUOTES, 'UTF-8') ?>"
           placeholder="例如 35:20、剩下 10 分鐘、片尾前">

    <label for="progress_note">進度情節備註</label>
    <input type="text" id="progress_note" name="progress_note"
           value="<?= htmlspecialchars($row['progress_note'] ?? '', ENT_QUOTES, 'UTF-8') ?>"
           placeholder="例如：女主角剛看到手機裡的影片">

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

    <div class="form-actions">
        <button type="submit" class="is-primary">儲存進度</button>
        <a href="?do=detail&amp;id=<?= (int)$row['id'] ?>">取消</a>
    </div>
</form>
