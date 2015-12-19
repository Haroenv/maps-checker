<?php
$filename = $_POST['name'];
$data = $_POST['data'];
list($type, $data) = explode(';', $data);
list(, $data)      = explode(',', $data);
$data=str_replace(" ", "+", $data);
$data = base64_decode($data);
file_put_contents('../img/' . $filename, $data);
?>