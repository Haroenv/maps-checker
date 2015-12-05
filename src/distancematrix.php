<?php
$key = 'YOUR_API_CODE'; //fill in!
$from = $_POST['from'];
$to = $_POST['to'];
$mode = $_POST['mode'];
$url = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=' . urlencode($from) . '&destinations=' . urlencode($to) . '&key='. urlencode($key) .'&travelmode=' . urlencode($mode) . '&departure_time=now';
$json = file_get_contents($url);
echo $json;
?>