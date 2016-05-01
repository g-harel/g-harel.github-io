<?php

require_once('connect.php');

if(!empty($_POST['username'])) {
    $identifier = 'username="'.$_POST['username'].'"';
} else if(!empty($_POST['email'])) {
    $identifier = 'email="'.$_POST['email'].'"';
} else {
    $identifier = 'username="'.$_POST['identifier'].'"';
}

$response = mysqli_query($conn, 'SELECT * FROM agenda_users.users WHERE '.$identifier.' LIMIT 1;');

if(mysqli_num_rows($response) != 0) {
    $array = mysqli_fetch_array($response);
    $array['status'] = 'success';
} else {
    $array = array(
        'status' => 'not found'
    );
}

echo json_encode($array);

?>
