<?php

// session_start();
//
//if(isset($_SESSION['username']) && isset($_SESSION['password']) && isset($_POST['id'])) {
//
//    // preparing the mysql statement
//    $stmt = mysqli_prepare($conn, 'INSERT INTO agenda_users.users (username, email, hash) VALUES (?,?,?);');
//    // binding the values in the statement
//    mysqli_stmt_bind_param($stmt, 'sss', $_POST['username'], $_POST['email'], $hash);
//    // executing the statement and storing the result
//    $result = mysqli_stmt_execute($stmt);
//    // adding a status key to $array to pass information to the output
//    if($result) {
//        $response = 'success';
//    } else {
//        $response = 'username/email already in use';
//    }
//
//	// closing the statement and the connection
//	mysqli_stmt_close($stmt);
//	mysqli_close($conn);
//	// sending back a JSON encoded string
//	echo $response;
//}
echo 'success';

?>
