<?php

session_start();

// checking that the necessary values are set and match certain patterns
if(!(isset($_SESSION['username']) &&
isset($_SESSION['password']) &&
isset($_POST['type']) &&
isset($_POST['field']) &&
isset($_POST['id']) &&
isset($_POST['value']) &&
preg_match('/'.$_POST['type'].'/', 'objectivesprojectstasks') &&
preg_match('/'.$_POST['field'].'/', 'descriptionpriorityobjectiveprojectweek_priorityday_priority'))) {
	echo 'user not logged in or query missing information';
	exit();
}
//connecting to the database and picking the table to read from
require_once('connect.php');
// preparing the mysql statement
$query = 'UPDATE agenda.'.$_POST['type'].' SET '.$_POST['field'].'=? WHERE username=? AND id=?;';
error_log($query.' '.$_POST['value'].' '.$_SESSION['username'].' '.$_POST['id']);
$stmt = mysqli_prepare($conn, $query);
// binding the values in the statement
mysqli_stmt_bind_param($stmt, 'ssi', $_POST['value'], $_SESSION['username'], $_POST['id']);
// executing the statement and storing the result
$result = mysqli_stmt_execute($stmt);
// adding a status key to $array to pass information to the output
if($result) {
    $response = 'success';
} else {
    $response = 'unable to edit the database';
}
// closing the statement and the connection
mysqli_stmt_close($stmt);
mysqli_close($conn);
// sending back a JSON encoded string
echo $response;

?>
