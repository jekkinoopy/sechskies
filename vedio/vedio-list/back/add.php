<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $maxRank = $Drama->q("SELECT MAX(`rank`) AS m FROM `dramas`");
    $nextRank = ((int)($maxRank[0]['m'] ?? 0)) + 1;

    $data = [
        'title' => trim($_POST['title'] ?? ''),
        'type' => $_POST['type'] ?? 'drama',
        'platform' => $_POST['platform'] ?? '其他',
        'watch_url' => trim($_POST['watch_url'] ?? ''),
        'current_season' => max(1, (int)($_POST['current_season'] ?? 1)),
        'current_episode' => max(0, (int)($_POST['current_episode'] ?? 0)),
        'current_position' => trim($_POST['current_position'] ?? ''),
        'progress_note' => trim($_POST['progress_note'] ?? ''),
        'status' => $_POST['status'] ?? 'want',
        'rating' => $_POST['rating'] !== '' ? $_POST['rating'] : null,
        'intro' => trim($_POST['intro'] ?? ''),
        'note' => trim($_POST['note'] ?? ''),
        'sh' => 1,
        'rank' => $nextRank,
    ];

    // DB::save 用字串拼接；null 改空字串避免 SQL 破掉
    if ($data['rating'] === null) {
        $data['rating'] = '';
    }

    $Drama->save($data);
    to("?do=drama");
    exit;
}
?>

<section>
    <h2 class="section-title">新增作品</h2>

    <form class="admin-form" method="post" action="?do=add">
        <label for="title">劇名／節目名</label>
        <input type="text" id="title" name="title" required>

        <label for="type">類型</label>
        <select id="type" name="type">
            <option value="variety">綜藝</option>
            <option value="drama" selected>戲劇</option>
        </select>

        <label for="platform">上架平台</label>
        <select id="platform" name="platform">
            <option value="Netflix">Netflix</option>
            <option value="Disney+">Disney+</option>
            <option value="friDay影音">friDay影音</option>
            <option value="愛奇藝">愛奇藝</option>
            <option value="LINE TV">LINE TV</option>
            <option value="YouTube">YouTube</option>
            <option value="其他">其他</option>
        </select>

        <label for="watch_url">直接觀看網址</label>
        <input type="url" id="watch_url" name="watch_url" placeholder="https://...">

        <label for="current_season">目前看到第幾季</label>
        <input type="number" id="current_season" name="current_season" min="1" value="1">

        <label for="current_episode">目前看到第幾集</label>
        <input type="number" id="current_episode" name="current_episode" min="0" value="0">

        <label for="current_position">這一集看到哪裡</label>
        <input type="text" id="current_position" name="current_position" placeholder="例如 35:20">

        <label for="progress_note">進度情節備註</label>
        <input type="text" id="progress_note" name="progress_note" placeholder="例如：女主角剛看到手機裡的影片">

        <label for="status">狀態</label>
        <select id="status" name="status">
            <option value="want">想看</option>
            <option value="watching" selected>追劇中</option>
            <option value="done">已追完</option>
            <option value="paused">暫停</option>
            <option value="dropped">棄劇</option>
        </select>

        <label for="rating">評分</label>
        <input type="number" id="rating" name="rating" min="0" max="10" step="0.1" placeholder="例如 8.5">

        <label for="intro">簡介</label>
        <textarea id="intro" name="intro" rows="4"></textarea>

        <label for="note">心得備註</label>
        <textarea id="note" name="note" rows="3"></textarea>

        <div class="form-actions" style="margin-top:1.25rem;display:flex;gap:10px;justify-content:center;">
            <button type="submit" class="is-primary" style="min-height:40px;padding:0.4rem 1.05rem;border-radius:999px;border:2px solid var(--color-brand);background:var(--color-brand);font-weight:700;cursor:pointer;">儲存</button>
            <a href="?do=drama" style="min-height:40px;padding:0.4rem 1.05rem;border-radius:999px;border:2px solid rgba(255,204,0,0.35);background:#fff;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;">取消</a>
        </div>
    </form>
</section>
