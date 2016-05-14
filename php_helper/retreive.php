<?php

session_start();

// checking that the necessary values are set
if(!(isset($_SESSION['username']) && isset($_SESSION['password']))) {
	echo json_encode(array('status'=>'user not logged in'));
	exit();
}
//connecting to the database and picking the table to read from
require_once('connect.php');
mysqli_select_db($conn, 'agenda');
// creating an empty array that will be sent back as a response
$array = array();
// preparing the sql statement
$stmt = mysqli_prepare($conn, 'SELECT * FROM agenda.tasks WHERE username=?;');
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
$counter = 0;
while($row = mysqli_fetch_array($result, MYSQLI_NUM)) {
	array_push($array, $row);
    //$array[$counter] = $row;
    $counter++;
}
//$array['status'] = 'success';
// closing the statement and the connection
mysqli_stmt_close($stmt);
mysqli_close($conn);
// echoing $array for the js
echo json_encode($array);

?>
