<?php
$filename = $_POST['name'];
$data = $_POST['data'];
list($type, $data) = explode(';', $data);
list(, $data)      = explode(',', $data);
$data = base64_decode($data);

// $image = explode('base64,',$data);
// file_put_contents('../img/' . $filename, base64_decode($image[1]));
file_put_contents('../img/' . $filename, $data);
 ?>