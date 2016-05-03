<?php

//connecting to the database and picking the table to read from
require_once('connect.php');
mysqli_select_db($conn, 'agenda_users');

// creating an empty array that will be sent back as a response
$array = array();

if(empty($_POST['identifier'])) {
    // no query is done if the value of identifier is empty
    $array['status'] = 'missing information';
} else {
    // preparing the sql statement
    $stmt = mysqli_prepare($conn, 'SELECT * FROM agenda_users.users WHERE username=? OR email =? LIMIT 1;');
    // binding the values in the statement to the post values
    mysqli_stmt_bind_param($stmt, 'ss', $_POST['identifier'], $_POST['identifier']);
    // executing the statement
    mysqli_stmt_execute($stmt);
    // storing the result of the executed statement
    $result = mysqli_stmt_get_result($stmt);
    // creating an array from the result and binding it to $array
    $array = mysqli_fetch_array($result);
    // adding a status key to $array to pass information to the js receiving this JSON output
    if(!empty($array)) {
        $array['status'] = 'success';
    } else {
        $array['status'] = 'username/email not found';
    }
}

// closing the statement and the connection
mysqli_stmt_close($stmt);
mysqli_close($conn);
// echoing $array for the js
echo json_encode($array);

?>
