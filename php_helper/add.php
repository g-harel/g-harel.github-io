<?php

session_start();

// checking that the necessary values are set
if(!(isset($_SESSION['username']) &&
isset($_SESSION['password']) &&
isset($_POST['type']) &&
isset($_POST['description']) &&
isset($_POST['priority']) &&
isset($_POST['objective']) &&
isset($_POST('project')) &&
preg_match('/'.$_POST['type'].'/', 'objectives projects tasks'))) {
	echo 'user not logged in or query missing information';
	exit();
}
//connecting to the database and picking the table to read from
require_once('connect.php');
// preparing the mysql statement
if ($_POST['type'] != task) {
	$stmt = mysqli_prepare($conn, "INSERT INTO agenda.$_POST[type] (username, description, priority) VALUES (?,?,?);");
	// binding the values in the statement
	mysqli_stmt_bind_param($stmt, 'ssi', $_SESSION['username'], $_POST['description'], $_POST['priority']);
} else {
	$stmt = mysqli_prepare($conn, 'INSERT INTO agenda.tasks (username, description, priority, objective, project) VALUES (?,?,?,?,?);');
	// binding the values in the statement
	mysqli_stmt_bind_param($stmt, 'ssiss', $_SESSION['username'], $_POST['description'], $_POST['priority'], $_POST['objective'], $_POST['project']);
}
// executing the statement and storing the result
$result = mysqli_stmt_execute($stmt);
// adding a status key to $array to pass information to the output
if($result) {
    $response = 'success';
} else {
    $response = 'unable to add to the database';
}
// closing the statement and the connection
mysqli_stmt_close($stmt);
mysqli_close($conn);
// sending back a JSON encoded string
echo $response;

?>
