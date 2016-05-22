<?php

session_start();

// checking that the necessary values are set
if(!(isset($_SESSION['username']) && isset($_SESSION['password']))) {
	echo json_encode(array('status'=>'user not logged in'));
	exit();
}
//connecting to the database and picking the table to read from
require_once('connect.php');
// creating an empty array that will be sent back as a response
$response = array();
$tables = array('objectives', 'projects', 'tasks');
for ($i = 0; $i < 3; $i++) {
	// preparing the sql statement
	$stmt = mysqli_prepare($conn, "SELECT * FROM agenda.$tables[$i] WHERE username=? ORDER BY priority ASC;");
	// binding the values in the statement to the post values
	mysqli_stmt_bind_param($stmt, 's', $_SESSION['username']);
	// executing the statement
	mysqli_stmt_execute($stmt);
	// storing the result of the executed statement
	$result = mysqli_stmt_get_result($stmt);
	if($result == false) {
		echo json_encode(array('status'=>'query failed'));
		exit();
	}
	$response[$tables[$i]] = array();
	while($row = mysqli_fetch_array($result, MYSQLI_NUM)) {
		array_push($response[$tables[$i]], $row);
	}
}
$response['status'] = 'success';

// closing the statement and the connection
mysqli_stmt_close($stmt);
mysqli_close($conn);
// echoing $response for the js
echo json_encode($response);

?>
