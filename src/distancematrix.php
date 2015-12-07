<?php
echo file_get_contents('https://maps.googleapis.com/maps/api/distancematrix/json?origins=' . urlencode($_POST['from']) . '&destinations=' . urlencode($_POST['to']) . '&key='. urlencode(json_decode(file_get_contents('config.json'), true)['maps-key']) .'&mode=' . urlencode($_POST['mode']) . '&departure_time=now');
?>