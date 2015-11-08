<?php
// v1 using basic curl functionality, TO-DO: Update to Guzzle (via Composer)

function curlAPI($method, $url, $data = false) {
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_VERBOSE, true);
    
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false); // THIS NEEDS FIXING

    switch ($method) {
        case "POST":
            curl_setopt($curl, CURLOPT_POST, 1);
            if ($data)
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            break;
        case "PUT":
            curl_setopt($curl, CURLOPT_PUT, 1);
            break;
        default:
            if ($data)
                $url = sprintf("%s?%s", $url, http_build_query($data));
    }

    // Optional Authentication:
    // curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    // curl_setopt($curl, CURLOPT_USERPWD, "username:password");

    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    // echo "URL:".$url;
    $result = curl_exec($curl);

    curl_close($curl);

    return $result;
}

function handleLogin($request="") {
    if (defined('COOKIE_EXPIRY')) {
        $cookieExpiry = (24*60*60)*COOKIE_EXPIRY;
    } else {
        $cookieExpiry = 1814400; // 21 days as seconds
    }
    //$cookieDomain = ".utassault.net";
    $cookieDomain = "";


    if (isset($_POST['uta_username']) && isset($_POST['uta_password'])) {
        // Step 1 - getUser with the API key first, to get the XenForo username and other details
        // Step 2 - Authenticate the user with XenForo username & password

        // Prepare REST data to send

        // $username = addslashes(mks($_POST['uta_username'],1));
        // $password = addslashes(mks($_POST['uta_password'],1));
        $username = $_POST['uta_username'];
        $password = $_POST['uta_password'];
        $data = array(
                    'action'=>'getUser',
                    'hash'=>XEN_API_KEY,
                    'value'=>$username
        );

        $return = curlAPI("GET",XEN_API_URL,$data);
        
        if (isset($return)) {
            $result = json_decode($return,true);
            if (isset($result['username'])) {
                $userid = $result['user_id'];
                $username = $result['username'];
                $useremail = $result['email'];
                $userstate = $result['user_state'];
                $useradmin = $result['is_admin'];
                $userprimarygroup = $result['user_group_id'];
                $userbanned = $result['is_banned'];

                // Now we have a valid user, validate the password
                $data = array(
                            'action'=>'authenticate',
                            'username'=>$username,
                            'password'=>$password
                        );
                $return = curlAPI("GET",XEN_API_URL,$data);
                if (isset($return)) {
                    $result = json_decode($return,true);
                    if (isset($result['hash'])) {
                        $_SESSION['uta_user'] = $username;
                        $_SESSION['uta_hash'] = $result['hash'];
                        
                        setcookie("uta_user", $username, (time()+$cookieExpiry), "", $cookieDomain);
                        setcookie("uta_hash", $result['hash'], (time()+$cookieExpiry), "", $cookieDomain);
                        setcookie("uta_lastvisit", time(), (time()+$cookieExpiry), "", $cookieDomain);
                    } else {
                        // Failed to authenticate the user, check JSON result, e.g.
                        // $result['error'] => 0
                        // $result['message'] => Argument: "password", is empty/missing a value                        
                    }

                } else {
                    // Failed to hit the API, probably need to sort something here
                }


            } else {
                // Failed to get a valid user, check JSON result, e.g.
                // $result['error'] => 0
                // $result['message'] => Argument: "password", is empty/missing a value
            }
        } else {
            // Failed to hit the API, probably need to sort something here
        }
        // print_r($_SESSION);
        // exit(0);
        return true;
    } else {
        return false;
    }
}

function handleLogout($request="") {
    unset($_SESSION['uta_user']);
    unset($_SESSION['uta_hash']);
    setcookie("uta_user","",(time()-3600));
    setcookie("uta_hash","",(time()-3600));
    setcookie("uta_lastvisit","",(time()-3600));
    if (defined('SITE_ROOT')) {
        header('Location: '.SITE_ROOT);
    } else {
        header('Location: /');
    }
}

