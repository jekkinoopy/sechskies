<?php
include_once "db.php";

$table = ${$_POST['table']};
$row1 = $table->find($_POST['ids'][0]);
$row2 = $table->find($_POST['ids'][1]);

$tmp = $row1['rank'];
$row1['rank'] = $row2['rank'];
$row2['rank'] = $tmp;

$table->save($row1);
$table->save($row2);
