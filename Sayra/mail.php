<?php

$body = "";

foreach ($_POST as $key => $value) {
    $body .= $key.":\r\n".($value?$value:'not specified')."\r\n\r\n";
}

mail('gabrielj.harel@gmail.com', 'Unapologetic Stylist - Form', $body);
/*mail('sayracashqar@gmail.com', 'Unapologetic Stylist - Form', $body);*/
header('Location: http://unapologeticstylist.com/');

?>
