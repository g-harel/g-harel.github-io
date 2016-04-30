<?php

$array = array(
    'username' => $_POST['username'],
    'time' => $_POST['time'],
    'hash' => $_POST['hash'],
    'email' => $_POST['email'],
    'status' => 'success'
);

echo json_encode($array);

?>
