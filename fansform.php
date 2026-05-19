<?php
/**
 * 水晶男孩入坑申請書（表單練習用）
 * POST 送回本頁；尚未寫入資料庫。
 */
declare(strict_types=1);

function fansform_h(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function fansform_post(string $key, string $default = ''): string
{
    return isset($_POST[$key]) ? (string) $_POST[$key] : $default;
}

function fansform_post_array(string $key): array
{
    if (!isset($_POST[$key]) || !is_array($_POST[$key])) {
        return [];
    }
    return array_map('strval', $_POST[$key]);
}

$isPost = $_SERVER['REQUEST_METHOD'] === 'POST';
$submitted = false;
$errors = [];

if ($isPost) {
    $nickname = trim(fansform_post('fan_nickname'));
    $email = trim(fansform_post('fan_email'));

    if ($nickname === '') {
        $errors['fan_nickname'] = '請填寫應援小黃暱稱';
    }
    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['fan_email'] = '請填寫有效的聯絡信箱';
    }

    if ($errors === []) {
        $submitted = true;
    }
}

$biasChecked = ($isPost && !$submitted) ? fansform_post_array('bias') : [];
$eventPoll = fansform_post('event_poll');
$favoriteSong = fansform_post('favorite_song');
?>
<!DOCTYPE html>
<html lang="zh-TW">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>水晶男孩｜入坑申請書</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="assets/css/tablet.css">
    <style>
        body.fansform-page main.fansform-main {
            max-width: min(880px, 94vw);
            margin-inline: auto;
            padding-top: clamp(28px, 4vw, 48px);
            padding-bottom: clamp(40px, 6vw, 72px);
        }

        body.fansform-page .fansform-lead {
            text-align: center;
            max-width: 36em;
            margin: 0 auto 2rem;
            color: var(--text-muted);
            line-height: 1.65;
        }

        body.fansform-page .fansform-notice {
            margin: 0 0 1.5rem;
            padding: 1rem 1.25rem;
            border-radius: 12px;
            font-weight: 600;
            text-align: center;
        }

        body.fansform-page .fansform-notice--ok {
            background: var(--surface-soft);
            border: 1px solid var(--primary);
            color: var(--dark-yellow);
        }

        body.fansform-page .fansform-notice--err {
            background: #fff5f5;
            border: 1px solid #c0392b;
            color: #922b21;
        }

        body.fansform-page .field-error {
            margin: 0;
            font-size: 0.85rem;
            color: #c0392b;
        }

        body.fansform-page .sechskies-form {
            width: 100%;
            padding: clamp(20px, 3vw, 2rem);
            background: var(--surface);
            border: 1px solid rgba(255, 204, 0, 0.22);
            border-radius: 16px;
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
        }

        body.fansform-page .form-title {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            margin-bottom: 2.5rem;
        }

        body.fansform-page .form-title h2 {
            --form-title-diamond: calc(1.15em * 0.8);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-wrap: nowrap;
            gap: 0.35em;
            max-width: 100%;
            margin: 0;
            padding: 0 0.5rem;
            font-size: clamp(1.6rem, 4vw, 2.25rem);
            line-height: 1.15;
            font-weight: 900;
            color: var(--primary);
            letter-spacing: 0.12em;
            text-align: center;
            white-space: nowrap;
        }

        body.fansform-page .form-title h2::before,
        body.fansform-page .form-title h2::after {
            content: "";
            flex: 0 0 var(--form-title-diamond);
            align-self: center;
            width: var(--form-title-diamond);
            height: var(--form-title-diamond);
            margin: 0;
            background: url("assets/svg/crystal-diamond.svg") no-repeat center / contain;
        }

        body.fansform-page .form-title p {
            width: 100%;
            max-width: 28em;
            margin: 0.65rem 0 0;
            font-size: 0.9rem;
            color: var(--dark-yellow);
            font-weight: 600;
            letter-spacing: 0.15em;
            text-align: center;
        }

        body.fansform-page .sechskies-form fieldset {
            border: 2px solid var(--primary);
            background: transparent;
            border-radius: 24px;
            padding: clamp(1.5rem, 3vw, 2.5rem);
            margin: 0 0 2rem;
        }

        body.fansform-page .sechskies-form legend {
            font-weight: 900;
            color: var(--primary);
            padding: 0 12px;
            font-size: 1.05rem;
            border-left: 4px solid var(--primary);
            border-right: 4px solid var(--primary);
            margin-inline: auto;
        }

        body.fansform-page .sechskies-form fieldset>div {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 1.25rem;
        }

        body.fansform-page .sechskies-form fieldset>div:last-child {
            margin-bottom: 0;
        }

        body.fansform-page .main-label {
            font-weight: 700;
            color: var(--dark-yellow);
        }

        body.fansform-page .sechskies-form input[type="text"],
        body.fansform-page .sechskies-form input[type="url"],
        body.fansform-page .sechskies-form input[type="tel"],
        body.fansform-page .sechskies-form input[type="email"],
        body.fansform-page .sechskies-form input[type="password"],
        body.fansform-page .sechskies-form input[type="date"],
        body.fansform-page .sechskies-form input[type="number"],
        body.fansform-page .sechskies-form input[type="time"],
        body.fansform-page .sechskies-form input[type="datetime-local"],
        body.fansform-page .sechskies-form input[type="file"],
        body.fansform-page .sechskies-form select,
        body.fansform-page .sechskies-form textarea {
            width: 100%;
            padding: 10px 14px;
            border: 1.5px solid var(--dark-yellow);
            border-radius: 16px;
            font-size: 0.95rem;
            box-sizing: border-box;
            background-color: #fff;
            color: var(--text-color);
            font-family: inherit;
        }

        body.fansform-page .sechskies-form input:focus,
        body.fansform-page .sechskies-form select:focus,
        body.fansform-page .sechskies-form textarea:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(255, 204, 0, 0.25);
        }

        body.fansform-page input[type="range"] {
            -webkit-appearance: none;
            width: 100%;
            height: 30px;
            background: transparent;
            accent-color: var(--primary);
        }

        body.fansform-page input[type="range"]::-webkit-slider-runnable-track {
            height: 10px;
            background: var(--primary);
            border-radius: 5px;
        }

        body.fansform-page input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: var(--surface);
            border: 3px solid var(--primary);
            margin-top: -5px;
        }

        body.fansform-page input[type="file"]::file-selector-button {
            background: var(--surface);
            color: var(--dark-yellow);
            border: 1px solid var(--primary);
            border-radius: 12px;
            padding: 6px 14px;
            cursor: pointer;
            font-weight: 700;
            margin-right: 10px;
        }

        body.fansform-page input[type="file"]::file-selector-button:hover {
            background: var(--primary);
            color: var(--black);
        }

        body.fansform-page .option-row {
            display: flex;
            flex-wrap: wrap;
            gap: 10px 14px;
            margin-top: 4px;
        }

        body.fansform-page .option-row.grid-3 {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
            gap: 10px;
        }

        body.fansform-page .option-item {
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
        }

        body.fansform-page .sechskies-form input[type="radio"],
        body.fansform-page .sechskies-form input[type="checkbox"] {
            width: auto;
            accent-color: var(--primary);
        }

        body.fansform-page .sechskies-form .submit {
            display: flex;
            flex-direction: row;
            gap: 12px;
            margin-top: 0.5rem;
        }

        body.fansform-page .sechskies-form .submit input {
            flex: 1;
            padding: 14px;
            border-radius: 50px;
            font-weight: 700;
            cursor: pointer;
            font-family: inherit;
            font-size: 1rem;
            transition: background 0.25s, color 0.25s, border-color 0.25s;
        }

        body.fansform-page .sechskies-form input[type="submit"] {
            background: var(--primary);
            color: var(--black);
            border: 2px solid var(--primary);
        }

        body.fansform-page .sechskies-form input[type="submit"]:hover {
            background: var(--dark-yellow);
            border-color: var(--dark-yellow);
            color: var(--surface);
        }

        body.fansform-page .sechskies-form input[type="reset"] {
            background: var(--surface);
            color: var(--dark-yellow);
            border: 2px solid var(--primary);
        }

        body.fansform-page .sechskies-form input[type="reset"]:hover {
            background: #c0392b;
            border-color: #c0392b;
            color: #fff;
        }

        body.fansform-page input[type="color"] {
            height: 40px;
            width: 80px;
            padding: 0;
            border: 1.5px solid var(--dark-yellow);
            border-radius: 12px;
            cursor: pointer;
        }
    </style>
</head>

<body class="fansform-page">
    <header class="inner-page-header">
        <div class="header-inner site-header-inner">
            <h1 class="main-title">入坑申請書</h1>
            <div class="subtitle-wrap">
                <span class="sub-title">SECHSKIES JOINING APPLICATION</span>
            </div>
        </div>
    </header>

    <nav class="portal-nav" aria-label="水晶男孩推廣部導覽" data-portal-nav></nav>

    <canvas id="particles"></canvas>

    <main class="content-container fansform-main">
        <p class="fansform-lead">填寫這份申請書，正式宣告你加入小黃行列。表單以 PHP 處理 POST（練習用，尚未寫入資料庫）。</p>

        <?php if ($submitted): ?>
            <p class="fansform-notice fansform-notice--ok" role="status">
                收到啦，<?= fansform_h(fansform_post('fan_nickname')) ?>！申請已通過基本驗證（暱稱＋信箱）。
            </p>
        <?php elseif ($isPost && $errors !== []): ?>
            <p class="fansform-notice fansform-notice--err" role="alert">請修正標示的欄位後再送出。</p>
        <?php endif; ?>

        <form action="<?= fansform_h($_SERVER['PHP_SELF'] ?? 'fansform.php') ?>" method="post" class="sechskies-form"
            enctype="multipart/form-data" aria-labelledby="fansform-heading"<?= $submitted ? ' hidden' : '' ?>>
            <div class="form-title">
                <h2 id="fansform-heading">水晶男孩入坑申請書</h2>
                <p>SECHSKIES JOINING APPLICATION</p>
            </div>

            <fieldset>
                <legend>💛 第一階段：小黃身分驗證</legend>
                <div>
                    <label class="main-label" for="fan-nickname">應援小黃</label>
                    <input type="text" id="fan-nickname" name="fan_nickname" placeholder="輸入你的暱稱"
                        autocomplete="nickname" value="<?= fansform_h(fansform_post('fan_nickname')) ?>" required>
                    <?php if (isset($errors['fan_nickname'])): ?>
                        <p class="field-error"><?= fansform_h($errors['fan_nickname']) ?></p>
                    <?php endif; ?>
                </div>
                <div>
                    <label class="main-label" for="fan-email">聯絡信箱</label>
                    <input type="email" id="fan-email" name="fan_email" placeholder="example@mail.com"
                        autocomplete="email" value="<?= fansform_h(fansform_post('fan_email')) ?>" required>
                    <?php if (isset($errors['fan_email'])): ?>
                        <p class="field-error"><?= fansform_h($errors['fan_email']) ?></p>
                    <?php endif; ?>
                </div>
                <div>
                    <label class="main-label" for="fan-password">輸入你的密碼</label>
                    <input type="password" id="fan-password" name="fan_password" autocomplete="new-password">
                </div>
                <div>
                    <label class="main-label" for="fan-tel">聯絡電話（發放週邊通知用）</label>
                    <input type="tel" id="fan-tel" name="fan_tel" placeholder="0912-345-678" autocomplete="tel"
                        value="<?= fansform_h(fansform_post('fan_tel')) ?>">
                </div>
            </fieldset>

            <fieldset>
                <legend>🎤 第二階段：見面會應援調查</legend>
                <div>
                    <span class="main-label" id="bias-label">本命成員</span>
                    <div class="option-row" role="group" aria-labelledby="bias-label">
                        <?php
                        $members = [
                            'ejw' => '殷志源 은지원',
                            'ljj' => '李宰鎮 이재진',
                            'kjd' => '金在德 김재덕',
                            'ksh' => '姜成勳 강성훈',
                            'jsw' => '張水院 장수원',
                            'gjy' => '高志溶 고지용',
                        ];
                        foreach ($members as $val => $label):
                            $checked = in_array($val, $biasChecked, true) ? ' checked' : '';
                            ?>
                            <label class="option-item"><input type="checkbox" name="bias[]"
                                    value="<?= fansform_h($val) ?>"<?= $checked ?>><?= fansform_h($label) ?></label>
                        <?php endforeach; ?>
                    </div>
                </div>
                <div>
                    <label class="main-label" for="event-time">最希望舉辦見面會的時間</label>
                    <input type="time" id="event-time" name="event_time"
                        value="<?= fansform_h(fansform_post('event_time')) ?>">
                </div>
                <div>
                    <label class="main-label" for="favorite-song">最期待聽到的歌曲</label>
                    <select id="favorite-song" name="favorite_song">
                        <option value="">請選擇歌曲</option>
                        <optgroup label="《學園別曲》（학원별곡）">
                            <option value="school_anthem"<?= $favoriteSong === 'school_anthem' ? ' selected' : '' ?>>
                                학원별곡（學園別曲）</option>
                            <option value="heartbreak"<?= $favoriteSong === 'heartbreak' ? ' selected' : '' ?>>연정（戀情）
                            </option>
                            <option value="pom_saeng_pom_sa"<?= $favoriteSong === 'pom_saeng_pom_sa' ? ' selected' : '' ?>>
                                사나이 가는 길（폼생폼사）</option>
                            <option value="confirmation"<?= $favoriteSong === 'confirmation' ? ' selected' : '' ?>>확인 /
                                確認</option>
                            <option value="betrayal"<?= $favoriteSong === 'betrayal' ? ' selected' : '' ?>>배신감 / 背叛感
                            </option>
                            <option value="remember_me"<?= $favoriteSong === 'remember_me' ? ' selected' : '' ?>>
                                기억해줄래 / 請記得好嗎</option>
                            <option value="walking_in_the_rain"<?= $favoriteSong === 'walking_in_the_rain' ? ' selected' : '' ?>>
                                Walking In The Rain</option>
                            <option value="dream_comes_true"<?= $favoriteSong === 'dream_comes_true' ? ' selected' : '' ?>>
                                Dream Comes True</option>
                            <option value="love_declaration"<?= $favoriteSong === 'love_declaration' ? ' selected' : '' ?>>
                                사랑 신고식 / 愛的宣言</option>
                            <option value="together"<?= $favoriteSong === 'together' ? ' selected' : '' ?>>다같이 해요 / 一起來吧
                            </option>
                        </optgroup>
                        <optgroup label="《Special》">
                            <option value="leaving_you"<?= $favoriteSong === 'leaving_you' ? ' selected' : '' ?>>
                                너를내며 / 送你離開</option>
                            <option value="couple"<?= $favoriteSong === 'couple' ? ' selected' : '' ?>>커플（Couple） / 戀人
                            </option>
                            <option value="unseen_world"<?= $favoriteSong === 'unseen_world' ? ' selected' : '' ?>>
                                네겐 보일수 없었던 세상</option>
                            <option value="while_you_sleep"<?= $favoriteSong === 'while_you_sleep' ? ' selected' : '' ?>>
                                그대가 잠든 사이에</option>
                            <option value="know_my_heart"<?= $favoriteSong === 'know_my_heart' ? ' selected' : '' ?>>
                                내맘을 알고있니</option>
                            <option value="celebrate_tonight"<?= $favoriteSong === 'celebrate_tonight' ? ' selected' : '' ?>>
                                Celebrate Tonight</option>
                            <option value="transformation"<?= $favoriteSong === 'transformation' ? ' selected' : '' ?>>
                                변신 / 改變</option>
                            <option value="giving_up"<?= $favoriteSong === 'giving_up' ? ' selected' : '' ?>>단념 / 死心
                            </option>
                            <option value="prayer"<?= $favoriteSong === 'prayer' ? ' selected' : '' ?>>기도 / 祈禱</option>
                            <option value="goodbye_party"<?= $favoriteSong === 'goodbye_party' ? ' selected' : '' ?>>
                                Goodbye Party</option>
                            <option value="soaring"<?= $favoriteSong === 'soaring' ? ' selected' : '' ?>>비상 / 飛翔</option>
                        </optgroup>
                    </select>
                </div>
                <div>
                    <span class="main-label" id="event-poll-label">最期待的見面會環節</span>
                    <div class="option-row grid-3" role="radiogroup" aria-labelledby="event-poll-label">
                        <?php
                        $polls = [
                            'dance' => '隨機舞蹈挑戰',
                            'battle' => '黑白水晶對抗賽',
                            'capsule' => '時光膠囊對話',
                            'unplugged' => '抒情版 Unplugged',
                            'yellow-note' => 'Yellow Note 心願投稿',
                            'balloon' => '黃色氣球海大合唱',
                        ];
                        foreach ($polls as $val => $label):
                            $checked = $eventPoll === $val ? ' checked' : '';
                            ?>
                            <label class="option-item"><input type="radio" name="event_poll"
                                    value="<?= fansform_h($val) ?>"<?= $checked ?>><?= fansform_h($label) ?></label>
                        <?php endforeach; ?>
                    </div>
                </div>
                <div>
                    <label class="main-label" for="album-count">想簽名的專輯數</label>
                    <input type="number" id="album-count" name="album_count" min="0" placeholder="0"
                        value="<?= fansform_h(fansform_post('album_count')) ?>">
                </div>
            </fieldset>

            <fieldset>
                <legend>📂 第三階段：資格審核與提交</legend>
                <div>
                    <label class="main-label" for="join-date">入坑日期</label>
                    <input type="date" id="join-date" name="join_date"
                        value="<?= fansform_h(fansform_post('join_date')) ?>">
                </div>
                <div>
                    <label class="main-label" for="join-story">入坑原因（最感動的一瞬間）</label>
                    <textarea id="join-story" name="join_story" rows="8"
                        placeholder="分享你入坑的故事"><?= fansform_h(fansform_post('join_story')) ?></textarea>
                </div>
                <div>
                    <label class="main-label" for="proof-file">上傳你的小黃應援證物（PDF／圖片）</label>
                    <input type="file" id="proof-file" name="proof_file" accept="image/*,.pdf">
                </div>
                <div>
                    <label class="main-label" for="fan-level">淪陷指數</label>
                    <input type="range" id="fan-level" name="fan_level" min="0" max="100"
                        value="<?= fansform_h(fansform_post('fan_level', '80')) ?>">
                </div>
                <div>
                    <label class="main-label" for="fan-color">你最愛的應援色定義</label>
                    <input type="color" id="fan-color" name="fan_color"
                        value="<?= fansform_h(fansform_post('fan_color', '#ffcc00')) ?>">
                </div>
                <div>
                    <label class="main-label" for="share-url">必推連結!!不能只有我入坑</label>
                    <input type="url" id="share-url" name="share_url" placeholder="https://youtube.com/..."
                        value="<?= fansform_h(fansform_post('share_url')) ?>">
                </div>
            </fieldset>

            <div class="submit">
                <input type="reset" value="重置">
                <input type="submit" value="送出">
            </div>
        </form>

        <?php if ($submitted): ?>
            <p class="fansform-lead"><a href="<?= fansform_h($_SERVER['PHP_SELF'] ?? 'fansform.php') ?>">再填一份申請書</a></p>
        <?php endif; ?>
    </main>

    <footer>
        <p>SECHSKIES Fanpage &copy; 2026 - 黃色氣球永遠飄揚</p>
        <a href="https://jekkinoopy.github.io/Portfolio/" class="studio-link" target="_blank" rel="noopener noreferrer">
            Design by <span class="mark_b">Jekkinoopy Studio</span>
        </a>
    </footer>

    <script src="assets/js/particles.js"></script>
    <script src="assets/js/portal-nav.js"></script>
</body>

</html>
