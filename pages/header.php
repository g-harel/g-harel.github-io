<!DOCTYPE html>
<html>
    <head>
        <?php
            session_start();
            // creating some js variables with the contents of the $_SESSION variables if they exist
            if(isset($_SESSION['username'])) {
                echo (
                    "<script>
                        var username = '$_SESSION[username]';
                        var part1 = '$_SESSION[part1]';
                        var part2 = '$_SESSION[part2]';
                        console.log('session variables : ' + username + ' ' + part1 + ' ' + part2);
                        // redirect to other page
                    </script>"
                );
            } else {echo ("<script> console.log('session not set'); </script>");}
        ?>
        <title>Agenda</title>
        <link rel='icon' href='../res/favicon.ico'>
        <link href='https://fonts.googleapis.com/css?family=Open+Sans:800,700,600' rel='stylesheet' type='text/css'>
        <script src='../js/jquery-2.2.3.js'></script>
        <script src='../js/bridge.js'></script>
        <script src='../js/sha3.js'></script>
        <link rel='stylesheet' href='../css/style.css'>
    </head>
    <body>
        <div id='message'></div>
