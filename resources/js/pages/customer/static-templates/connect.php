<?php

date_default_timezone_set("Asia/Kolkata");
session_start();
if($_SERVER['HTTP_HOST']=="localhost"){$connect=mysqli_connect("localhost","root","","u620508530_theinvitify") or die ('Database not available...');}else {$connect=mysqli_connect("localhost","u620508530_theinvitify","theinvitifyA123456","u620508530_theinvitify") or die ('Connection issue #567845 Error');}
$date=date('Y-m-d H:i:s');


?>

<title>User Panel</title>

<head>

 <meta name="keywords" content="Digital Visiting Card">
 
 <meta name="description" content="Best digital visiting card online with great design">
  <!-- Required meta tags -->
  <meta charset="utf-8" />
  <link rel='stylesheet' href='../all.css' integrity='sha384-lZN37f5QGtY3VHgisS14W3ExzMWZxybE1SJSEsQp9S+oqd12jhcu+A56Ebc1zFSJ' crossorigin='anonymous'>
  
  <link rel="stylesheet" href="../awesome.min.css">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
 <meta      name='viewport'      content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
<link rel="fav-icon" href="images/cropped-vcardin-1.png" type="image/png">
<link rel="stylesheet" href="css.css" >
<link rel="stylesheet" href="mobile_css.css" >
<script src="master_js.js"></script>



</head>

