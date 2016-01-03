<?php
// two possible ways to get the API key: 
// 1. an environment variable (heroku) called MAPS-KEY
// 2. a different json file called config.json, check out config.example.json
// if those all don't work, duration_in_traffic will not work, and the site will use duration from the other api.
echo file_get_contents('https://maps.googleapis.com/maps/api/distancematrix/json?origins=' . urlencode($_POST['from']) . '&destinations=' . urlencode($_POST['to']) . '&key='. (getenv('MAPS-KEY') ? getenv('MAPS-KEY') : urlencode(json_decode(file_get_contents('config.json'), true)['maps-key'])) .'&mode=' . urlencode($_POST['mode']) . '&departure_time=now');
?>
