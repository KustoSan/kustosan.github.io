<?php

$user = $_GET['user'];
$rest_json = file_get_contents("https://hummingbird.me/api/v1/users/$user"); echo $rest_json;

?>