<?php

$success = mail('pabombs@gmail.com', 'Unapologetic Stylist - Form', $HTTP_RAW_POST_DATA);
echo $success;
exit();

?>
