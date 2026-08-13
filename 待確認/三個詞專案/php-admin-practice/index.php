<?php
require __DIR__ . '/config.php';
requireLogin();
$edit = ['id'=>'','stage_date'=>'','youtube_id'=>'','station'=>'','program'=>'','title'=>'','note'=>'','sort_order'=>0,'is_visible'=>1];
if (isset($_GET['edit'])) {
    $stmt = $pdo->prepare('SELECT * FROM stages WHERE id = ?'); $stmt->execute([(int)$_GET['edit']]);
    $edit = $stmt->fetch() ?: $edit;
}
$stages = $pdo->query('SELECT * FROM stages ORDER BY sort_order ASC, stage_date ASC, id ASC')->fetchAll();
?>
<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>打歌舞台後台</title><link rel="stylesheet" href="style.css"></head><body>
<header><div><p class="eyebrow">THREE WORDS · 10TH</p><h1>打歌舞台後台</h1></div><nav><a href="stages.php" target="_blank">查看前台 ↗</a><a href="api.php" target="_blank">JSON API ↗</a><a href="logout.php">登出</a></nav></header>
<main class="adminGrid">
<section class="panel formPanel"><div class="panelTitle"><span>01</span><h2><?=$edit['id']?'修改舞台':'新增舞台'?></h2></div>
<form method="post" action="save.php"><input type="hidden" name="csrf" value="<?=csrf()?>"><input type="hidden" name="id" value="<?=e((string)$edit['id'])?>">
<div class="two"><label>播出日期<input type="date" name="stage_date" required value="<?=e($edit['stage_date'])?>"></label><label>顯示順序<input type="number" name="sort_order" value="<?=e((string)$edit['sort_order'])?>"></label></div>
<label>YouTube 網址或影片 ID<input name="youtube_url" required placeholder="https://www.youtube.com/watch?v=..." value="<?=e($edit['youtube_id'])?>"></label>
<div class="two"><label>電視台<input name="station" required placeholder="SBS" value="<?=e($edit['station'])?>"></label><label>節目名稱<input name="program" required placeholder="人氣歌謠" value="<?=e($edit['program'])?>"></label></div>
<label>舞台標題<input name="title" required value="<?=e($edit['title'])?>"></label><label>備註<textarea name="note" rows="3"><?=e($edit['note'])?></textarea></label>
<label class="check"><input type="checkbox" name="is_visible" value="1" <?=$edit['is_visible']?'checked':''?>> 前台顯示</label><div class="formActions"><button><?=$edit['id']?'儲存修改':'新增資料'?></button><?php if($edit['id']):?><a href="index.php">取消修改</a><?php endif;?></div></form></section>
<section class="panel listPanel"><div class="panelTitle"><span>02</span><h2>資料列表</h2><b><?=count($stages)?> 筆</b></div>
<div class="tableWrap"><table><thead><tr><th>順序</th><th>日期／縮圖</th><th>電視台／舞台</th><th>狀態</th><th>操作</th></tr></thead><tbody>
<?php foreach($stages as $row):?><tr><td><?=e((string)$row['sort_order'])?></td><td><time><?=e($row['stage_date'])?></time><img src="https://i.ytimg.com/vi/<?=e($row['youtube_id'])?>/mqdefault.jpg" alt="影片縮圖"></td><td><strong><?=e($row['station'])?> · <?=e($row['program'])?></strong><span><?=e($row['title'])?></span></td><td><i class="status <?=$row['is_visible']?'on':''?>"><?=$row['is_visible']?'顯示':'隱藏'?></i></td><td class="ops"><a href="?edit=<?=$row['id']?>">修改</a><form method="post" action="delete.php" onsubmit="return confirm('確定刪除這筆資料？')"><input type="hidden" name="csrf" value="<?=csrf()?>"><input type="hidden" name="id" value="<?=$row['id']?>"><button>刪除</button></form></td></tr><?php endforeach; ?>
</tbody></table></div></section></main></body></html>
