<?php

// UTA Auth Module definitions
define( 'UTA_AUTHIDS', 'cortex-xenapi'); // currently, only cortex-XenAPI is supported, given we have history with vBulletin, it wouldn't take much to add that
define( 'XEN_API_KEY', 'YOUR_API_KEY_GOES_HERE'); // API key for XenAPI
define( 'XEN_API_URL', '//your.url.to/xenapi.php'); // URL to XenAPI

// MySQLi connection details (using Simply MySQLi)
define( 'DB_HOST', 'localhost' ); // set database host
define( 'DB_USER', 'root' ); // set database user
define( 'DB_PASS', 'password' ); // set database password
define( 'DB_NAME', 'yourdatabasename' ); // set database name
define( 'SEND_ERRORS_TO', 'you@yourwebsite.com' ); //set email notification email address
define( 'DISPLAY_DEBUG', true ); //display db errors?


?>