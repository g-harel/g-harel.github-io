<?php

// connecting to the database and picking the table to read from
require_once('connect.php');
mysqli_select_db($conn, 'agenda_users');

// creating an empty array that will be sent back as a response
$array = array();

// array with the names of the required fields in the post array
$required_fields = array('username', 'hash', 'email', 'time');

// going through the required fields to check that they exist in the post array
foreach($required_fields as $field) {
    if(empty($_POST[$field])) {
        $array['status'] = 'missing information';
    }
}

// code to execute if all required post keys have values
if(empty($array['status'])) {
    // preparing the sql statement
    $stmt = mysqli_prepare($conn, 'INSERT INTO agenda_users.users (username, hash, email, time) VALUES (?,?,?,?);');
    // binding the values in the statement to the post values
    mysqli_stmt_bind_param($stmt, 'sssi', $_POST['username'], $_POST['hash'], $_POST['email'], $_POST['time']);
    // executing the statement and storing the result
    $result = mysqli_stmt_execute($stmt);
    // adding a status key to $array to pass information to the js receiving this JSON output
    if($result) {
        $array['status'] = 'success';
    } else {
        $array['status'] = 'username/email already in use';
    }
}


// closing the statement and the connection
mysqli_stmt_close($stmt);
mysqli_close($conn);
//achoing $array to the js
echo json_encode($array);

?>
