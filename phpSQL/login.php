<?php

$array = array(
    'username' => $_POST['identifier'],
    'password' => $_POST['password'],
    'status' => 'success'
);

echo json_encode($array);

?>
