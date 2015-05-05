<?php

$user1 = $_GET['user1'];
$user2 = $_GET['user2'];
$rest_json = file_get_contents("https://hbird-cmp-node.herokuapp.com/compatibility/anime?user1=$user1&user2=$user2"); echo $rest_json;

?>