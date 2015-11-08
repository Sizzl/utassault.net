<?php
function handleSession($request="") {
	session_start();
	$cookieExpiry = 1814400; // 21 days as seconds
	if (isset($_COOKIE['uta_lastvisit'])) {
		if ($_COOKIE['uta_lastvisit']<=(time()-$cookieExpiry)) 	{
			// cookies should've been cleared by now, but handle anyway (old data).
			setcookie("uta_user","",(time()-3600));
			setcookie("uta_hash","",(time()-3600));
			setcookie("uta_lastvisit","",(time()-3600));
		} else {
			// was valid cookie time.
			if (isset($_COOKIE['uta_user']) && !(isset($_SESSION['uta_user']))) {
				// check users cookie data
				$utaUser = addslashes($_COOKIE['uta_user']);
				$utaHash = addslashes($_COOKIE['uta_hash']);
				$utaLast = $_COOKIE['uta_lastvisit'];
			} else {
			 // no cookies present or session'd mode; check session data for non-cookie enabled browsers!
				if ($_SESSION["uta_user"]) {
					getUserPermissions($_SESSION["uta_user"]);
				} else {
					getUserPermissions("none");
				}
			}
		}
	} else {
		// no cookies, or cookies blocked

	}
	// Check for logout request and call from here (TO-DO: can be optimized)
	if (isset($request)) {
		if (in_array("logout",$request)) {
			handleLogout($request);
			getUserPermissions("none");
		}
	}
}

function getUserPermissions($user="none") {
	if ($user=="none") {
		// Clear session vars safely
		if (isset($myclans)) {
			unset($myclans);
		}
	} else {
		$myclans = array();
		if ($_SESSION["uta_user"]==$user) {

		}
	}
	if (isset($myclans)) {
		$_SESSION['uta_clans'] = $myclans;
	}
}

/*
	The following functions should be defined in the relevant API for linking to other user management software:-

	function handleLogin($request="") {
 		// ...
	}

	function handleLogout($request="") {
 		// ...
	}


*/

