<?php

    // creating an empty array that will be sent back as a response
    $array = array();

    // array with the names of the required fields in the post array
    $required_fields = array('username', 'part1', 'part2');

    // going through the required fields to check that they exist in the post array
    foreach($required_fields as $field) {
        if(empty($_POST[$field])) {
            $array['status'] = 'missing information';
        }
    }

    // creating the session and giving it some key/value pairs
    if(empty($array['status'])) {
        session_destroy();
        session_start();
        $array['status'] = 'success';
        foreach($required_fields as $field) {
            $_SESSION[$field] = $_POST[$field];
            $array[$field] = $_POST[$field];
        }
    }

    //  echoing the $array for the js
    echo json_encode($array);

?>
