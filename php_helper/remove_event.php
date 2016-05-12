<?php

session_start();

// checking that the necessary values are set
if(!(isset($_SESSION['username']) && isset($_SESSION['password']) && isset($_POST['id']))) {
	echo json_encode(array('status'=>'user not logged in or query missing information'));
	exit();
}

//connecting to the database and picking the table to read from
require_once('connect.php');
mysqli_select_db($conn, 'events');
// $hash = crypt($_SESSION['username'], '$1$username$');
$hash = 'test';
error_log("DELETE FROM agenda_users.events WHERE id=$_POST[id] AND hash=$hash;");
// preparing the mysql statement
$stmt = mysqli_prepare($conn, 'DELETE FROM agenda_users.events WHERE id=? AND hash=?;');
// binding the values in the statement
mysqli_stmt_bind_param($stmt, 'is', $_POST['id'], $hash);
// executing the statement and storing the result
$result = mysqli_stmt_execute($stmt);
// adding a status key to $array to pass information to the output
if($result) {
	$response = 'success';
} else {
	$response = 'delete operation failed'.$_SESSION['username'].$_SESSION['password'].$_POST['id'];
}

// closing the statement and the connection
mysqli_stmt_close($stmt);
mysqli_close($conn);
// sending back a JSON encoded string
echo $response;

?>
