<?php

$conn = mysqli_connect('localhost', 'root', '');
            /*
            agenda_users >
            CREATE TABLE IF NOT EXISTS 'users' (
              'id' int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
              'username' varchar(20) NOT NULL,
              'time' int(11) NOT NULL,
              'email' varchar(45) NOT NULL,
              'hash' varchar(64) NOT NULL,
              PRIMARY KEY ('id'),
              UNIQUE KEY 'username_UNIQUE' ('username'),
              UNIQUE KEY 'id_UNIQUE' ('id'),
              UNIQUE KEY 'email_UNIQUE' ('email')
            ) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
            */

?>
