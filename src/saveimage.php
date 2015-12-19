<?php
$filename = $_POST['name'];
// $data = $_POST['data'];
$data = 'data:image/png;base64,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';
// list($type, $data) = explode(';', $data);
// list(, $data)      = explode(',', $data);
$img = str_replace('data:image/png;base64,', '', $data);
$img = str_replace(' ', '+', $data);
$img = base64_decode($data);
file_put_contents('../img/' . $filename, $img);

 ?>