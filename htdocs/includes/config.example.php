<?php


// UTA Auth Module definitions
define( 'UTA_AUTHIDS', 'xenforo_cortex'); // currently, only Cortex' XenAPI is supported, given we have history with vBulletin, it wouldn't take much to add that
define( 'XEN_API_KEY', 'YOUR_API_KEY_GOES_HERE'); // API key for XenAPI
define( 'XEN_API_URL', '//your.url.to/xenapi.php'); // URL to XenAPI

// MySQLi connection details (using Simply MySQLi)
define( 'DB_HOST', 'localhost' ); // set database host
define( 'DB_USER', 'root' ); // set database user
define( 'DB_PASS', 'password' ); // set database password
define( 'DB_NAME', 'yourdatabasename' ); // set database name
define( 'SEND_ERRORS_TO', 'you@yourwebsite.com' ); //set email notification email address
define( 'DISPLAY_DEBUG', true ); //display db errors?

// --// WWW Specific //--
define('SITE_ROOT',"/"); // Set site root.
define('CODEPAGE', "utf-8");
define('COOKIE_EXPIRY',21); // Cookie expiry, in days

// --// Security Definitions //--
$ALLOWED_GFX = array(".gif", ".jpg", ".png", ".doc", ".xls", ".txt", ".pdf", ".cdr", ".swf", ".pps", ".fla", ".psd", ".zip", ".rar", ".ace",".tif");
$ALLOWED_EREG_FILES = "(.rar)|(.zip)|(.pdf)|(.doc)|(.xls)|(.html)|(.htm)|(.ppt)|(.pps)";
$ALLOWED_EREG_GFX ="(.jpg)|(.png)|(.gif)";
$SPECIAL_CHARS = array('?', '$', '%', '/', '\\');
$NOT_ALLOWED = array('chr(', 'wget', 'cmd=', 'rush=', 'union', 'UNION', 'echr(', 'esystem(', 'cp%20', 'mdir%20', 'mcd%20', 'mrd%20', 'rm%20', 'mv%20',
		 				'rmdir%20', 'chmod(', 'chmod%20', 'chown%20', 'chgrp%20', 'locate%20', 'grep%20', 'diff%20', 'kill%20', 'kill(', 'killall', 'passwd%20',
					 	'telnet%20', 'vi(', 'vi%20', 'INSERT%20INTO', 'SELECT%20', 'fopen', 'fwrite', '$_REQUEST', '$_GET');

