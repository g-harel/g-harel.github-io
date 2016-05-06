<?php session_start(); ?>

<!DOCTYPE html>
<html>
    <head>
        <title>Agenda</title>
        <link rel='icon' href='../res/favicon.ico'>
        <link href='https://fonts.googleapis.com/css?family=Open+Sans:800,700,600' rel='stylesheet' type='text/css'>
        <script src='../js/jquery-2.2.3.js'></script>
        <script src='../js/bridge.js'></script>
        <link rel='stylesheet' href='../css/style.css'>
    </head>
    <body>
        <div id='message'></div>

<?php
if(isset($_SESSION['username']) && isset($_SESSION['password'])) {
	// include('login.html');
	include('agenda.html');
} else {
	include('login.html');
}
?>

	</body>
</html>
