<?php

session_start();

if(isset($_SESSION['username']) && isset($_SESSION['password'])) {
	//connecting to the database and picking the table to read from
	require_once('connect.php');
	mysqli_select_db($conn, 'events');

	// creating an empty array that will be sent back as a response
	$array = array();

	// array with the names of the required fields in the post array
	$required_fields = array('type', 'columns');

	// going through the required fields to check that they exist in the post array
	foreach($required_fields as $field) {
	    if(empty($_POST[$field])) {
	        $array['status'] = 'missing information';
	    }
	}

	// code to run if the required fields are all found
	if(empty($array['status'])) {

		// $_SESSION['hash'] = crypt($_SESSION['username'], '$1$username$');
		$_SESSION['hash'] = 'test';

		// sets which columns are going to be read
		if(isset($_POST['columns'])) {
			$columns = '';
			foreach($_POST['columns'] as $column) {
				$columns .= $column.', ';
			}
			$columns = substr($columns, 0, -2).' ';
		} else {
			$columns = '*';
		}

		//sets the sorting of the rows
		$sort = '';
		if(isset($_POST['sort'])) {
			$sort = ' ORDER BY '.$_POST['sort'];
		}

	    // preparing the sql statement
	    $stmt = mysqli_prepare($conn, "SELECT $columns FROM agenda_users.events WHERE hash=? AND type=? $sort;");
		error_log("SELECT $columns FROM agenda_users.events WHERE hash=? AND type=? $sort ;");
	    // binding the values in the statement to the post values
	    mysqli_stmt_bind_param($stmt, 'si', $_SESSION['hash'], $_POST['type']);
	    // executing the statement
	     mysqli_stmt_execute($stmt);
	    // storing the result of the executed statement
	    $result = mysqli_stmt_get_result($stmt);

	    $array['length'] = 0;
	    while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
	        $array[$array['length']] = $row;
	        $array['length']++;
	    }

	    // adding a key to $array to pass status information
	    if(!empty($array)) {
	        $array['status'] = 'success';
	    } else {
	        $array['status'] = 'no results found';
	    }
	}

	// closing the statement and the connection
	mysqli_stmt_close($stmt);
	mysqli_close($conn);
	// echoing $array for the js
	echo json_encode($array);
} else {
	//echo json_encode(array('status'=>'empty session variables'));
	echo(json_encode($_SESSION));
}

?>
