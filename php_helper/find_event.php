<?php

session_start();

// checking that the necessary values are set
if(!(isset($_SESSION['username']) && isset($_SESSION['password']) && isset($_POST['type']) && isset($_POST['columns']))) {
	echo json_encode(array('status'=>'user not logged in or query missing information'));
	exit();
}

//connecting to the database and picking the table to read from
require_once('connect.php');
mysqli_select_db($conn, 'events');

// creating an empty array that will be sent back as a response
$array = array();

// $hash = crypt($_SESSION['username'], '$1$username$');
$hash = 'test';

// sets which columns are going to be read
$columns = 'id, ';
foreach($_POST['columns'] as $column) {
	$columns .= $column.', ';
}
$columns = substr($columns, 0, -2).' ';

//sets the sorting of the rows
$sort = '';
if(isset($_POST['sort'])) {
	$sort = ' ORDER BY '.$_POST['sort'];
}

// preparing the sql statement
$stmt = mysqli_prepare($conn, "SELECT $columns FROM agenda_users.events WHERE hash=? AND type=? $sort;");
// binding the values in the statement to the post values
mysqli_stmt_bind_param($stmt, 'si', $hash, $_POST['type']);
// executing the statement
mysqli_stmt_execute($stmt);
// storing the result of the executed statement
$result = mysqli_stmt_get_result($stmt);

$counter = 0;
while($row = mysqli_fetch_array($result, MYSQLI_BOTH)) {
    $array[$counter] = $row;
    $counter++;
}
if ($counter != 0) {
	$array['length'] = $counter;
}
$array['status'] = 'success';

// closing the statement and the connection
mysqli_stmt_close($stmt);
mysqli_close($conn);
// echoing $array for the js
echo json_encode($array);

?>
