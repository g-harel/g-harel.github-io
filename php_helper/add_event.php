<?php

session_start();

// checking that the necessary values are set
if(!(isset($_SESSION['username']) && isset($_SESSION['password']) && isset($_POST['type']))) {
	echo json_encode(array('status'=>'user not logged in or query missing information'));
	exit();
}

//connecting to the database and picking the table to read from
require_once('connect.php');
mysqli_select_db($conn, 'events');
// $hash = crypt($_SESSION['username'], '$1$username$');
$hash = 'test';
// preparing the mysql statement
$stmt = mysqli_prepare($conn, 'INSERT INTO agenda_users.events (hash, type, data1, data2, data3) VALUES (?,?,?,?,?);');
// binding the values in the statement
mysqli_stmt_bind_param($stmt, 'sssss', $hash, $_POST['type'], $_POST['data1'], $_POST['data2'], $_POST['data3']);
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
