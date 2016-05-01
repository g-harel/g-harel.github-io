<?php

require_once('connect.php');

$response = mysqli_query($conn, "INSERT INTO agenda_users.users (username, hash, email, time) VALUES ('".$_POST['username']."', '".$_POST['hash']."', '".$_POST['email']."', ".$_POST['time'].");");

if($response) {
    $array = array(
        'status' => 'success'
    );
} else {
    $array = array(
        'status' => 'could not instert'
    );
}

echo json_encode($array);

?>
