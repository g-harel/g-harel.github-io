<?php

// checking that all the required fields are defined
$required_fields = array('username', 'email', 'password');
foreach($required_fields as $field) {
    if(empty($_POST[$field])) {
        $response = 'missing information';
        exit();
    }
}

// connecting to the database and picking the table to read from
require_once('connect.php');
//creating a hash for the password
$hash = password_hash($_POST['password'], PASSWORD_BCRYPT);
// preparing the mysql statement
$stmt = mysqli_prepare($conn, 'INSERT INTO agenda.users (username, email, hash) VALUES (?,?,?);');
// binding the values in the statement
mysqli_stmt_bind_param($stmt, 'sss', $_POST['username'], $_POST['email'], $hash);
// executing the statement and storing the result
$result = mysqli_stmt_execute($stmt);
// adding a status key to $array to pass information to the output
if($result) {
    $response = 'success';
} else {
    $response = 'username/email already in use';
}
// closing the statement and the connection
mysqli_stmt_close($stmt);
mysqli_close($conn);
// sending back a JSON encoded string
echo $response;

?>
