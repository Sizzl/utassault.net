<?php
// --// List of global includes //--
include("config.php");
include("class.db.php");
include("function.general.php");

if (defined('UTA_AUTHIDS')) {
	include("function.api-".UTA_AUTHIDS.".php"); // only include what we need, this also includes any REST handling for now (cURL)
}

include("function.user-login.php");
// --// Begin request handling //--
$request = explode("/", substr(@$_SERVER['PATH_INFO'], 1));
if (isset($_SERVER["REQUEST_URI"])) {
  if ($_SERVER["REQUEST_URI"]=="/") {
    define('THIS_PAGE',SITE_ROOT.'index.php');
  } else {
    define('THIS_PAGE',$_SERVER["REQUEST_URI"]);
  }
} else {
  define('THIS_PAGE',SITE_ROOT.'index.php');
}

switch ($_SERVER['REQUEST_METHOD']) {
  case 'PUT':
    break;
  case 'GET':
    // Handle input and set options based on GET requests
    // --// Begin session handling //--
  	handleSession($request);
    break;
  case 'POST':
  	// Handle input and set options based on POST requests
    // --// Begin session and login handling //--
  	handleSession($request);
  	handleLogin($request);
    break;
  case 'HEAD':
    break;
  case 'DELETE':
    break;
  case 'OPTIONS':
    break;
  default:
    break;
}

