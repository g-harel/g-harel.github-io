<?php

$success = mail('pabombs@gmail.com', 'Test', $HTTP_RAW_POST_DATA);
echo $success;
exit();

?>
