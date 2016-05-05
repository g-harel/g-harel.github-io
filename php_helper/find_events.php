<?php

//connecting to the database and picking the table to read from
require_once('connect.php');
mysqli_select_db($conn, 'events');

// creating an empty array that will be sent back as a response
$array = array();

// array with the names of the required fields in the post array
$required_fields = array('part1', 'part2', 'type');

// going through the required fields to check that they exist in the post array
foreach($required_fields as $field) {
    if(empty($_POST[$field])) {
        $array['status'] = 'missing information';
    }
}

if(empty($array['status'])) {
    // preparing the sql statement
    $stmt = mysqli_prepare($conn, 'SELECT data1, data2, data3 FROM agenda_users.events WHERE part1=? AND part2=? AND type=?;');
    // binding the values in the statement to the post values
    mysqli_stmt_bind_param($stmt, 'ssi', $_POST['part1'], $_POST['part2'], $_POST['type']);
    // executing the statement
    mysqli_stmt_execute($stmt);
    // storing the result of the executed statement
    $result = mysqli_stmt_get_result($stmt);
    
    $counter = 0;
    while($row = mysqli_fetch_array($result)) {
        $array[$counter] = $row;
        $counter++;
    }
    $array['counter'] = $counter;
    
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
