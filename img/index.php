<?php
$images = array(); // An array which will hold all our images
$di = new DirectoryIterator(__DIR__);
foreach ($di as $file) {
  if (!$file->isDot() && !$file->isDir()) {
    if ($file->getExtension() === 'png') {
      $images [] = './' . $file;
    }
  }
}
?><!DOCTYPE html>
<!--
  Maps Checker is a checker for Google Maps travel time
  compared to actual time.
  Saved image page
  @author Haroen Viaene <hello@haroen.me>
-->
<html lang="en">

<head>
  <title> Maps Checker </title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="mobile-web-app-capable" content="yes" />
  <link rel="apple-touch-icon" href="../apple-touch-icon.png" />
  <link rel="icon" href="../apple-touch-icon.png" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="theme-color" content="#F44336">
  <link rel="stylesheet" href="../src/style.css" />
  <link rel="icon" type="image/png" href="../favicon.png" />
  <style>
  img {
    width: 100vw;
  }
  </style>
</head>

<body>
  <header>
    <h1><a href="../">Maps Checker</a></h1>
  </header>
  <div class="content">
    <p>Here you can see all the images that have been saved to this point.</p>
    <p>Beware: this can be slow to load if there are a lot of images</p>
    <?php
    foreach ($images as $img) {
       echo '<img src="' .  $img . '"></img>' . PHP_EOL;
     } ?>
  </div>
  <footer>
    <p>Made by <a href="https://haroen.me">Haroen Viaene</a> | code on <a href="https://github.com/haroenv/maps-checker">GitHub</a></p>
  </footer>
</body>
</html>