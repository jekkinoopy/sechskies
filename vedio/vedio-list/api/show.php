<?php
include_once "db.php";

$row = $Drama->find($_POST['id']);
$row['sh'] = ((int)$row['sh'] + 1) % 2;
$Drama->save($row);
