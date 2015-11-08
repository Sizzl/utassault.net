<?php
/*
 Home of generic functions, string handling, formatting etc...

 Some (maybe much) of this is probably defunct now, but we are old-skool,
 so these functions have been pulled from years of prior work, and can be
 reviewed and pulled as needed.

*/

/* --------------------------------------------------- */
// string highlight - useful for search results
// How to call this function: 
// $what - string we are looking FOR
// $str - string we are looking IN
// $cyt [true/false] returns full $str as quote
function str_highlight($what, $str, $cyt) {
	$str = preg_replace('/\s+/', ' ', str_replace('&nbsp;',' ', trim(strip_tags($str))));
	if( (!empty($what)) && (!empty($str)) && (preg_match("/$what/i", $str)) ){
		if(strlen($str) > 200){
			$start = (strpos($str,$what) > 200) ? strpos($what,$str)-200 : '0';
			$end = strrev(substr(strstr(strrev($str), strrev($what)),strlen($what)));
			$str = substr($str, intval($start), intval($end+200)) ;
		}
	$str = preg_replace("/$what/i", "<span style=\"color:red; text-decoration:underline; font-weight:bold\">".mb_convert_case($what, MB_CASE_UPPER, "UTF-8")."</span>", $str);
	}
	if( (!empty($cyt)) && (!empty($str)) ){ $str = "<em>[ ... ".$str." ... ]</em>"; }
return $str;
}

/* --------------------------------------------------- */
// makesafe - cleaning variables from forbidden/dangerous strings/chars
// How to call this function:
// $str - string to make safe
// $level - level of safeness (0 = both, 1 = keywords only, 2 = special characters only)
// e.g. $foo = mks($_GET['foo']);
function mks($str,$level=0)
{
	global $NOT_ALLOWED, $SPECIAL_CHARS;
	if ($level == 1) {
		$str = str_replace($NOT_ALLOWED, '', $str);
	} elseif ($level == 2) {
		$str = str_replace($SPECIAL_CHARS, '', $str);
	} else {
		$str = str_replace($NOT_ALLOWED, '', $str);
		$str = str_replace($SPECIAL_CHARS, '', $str);
	}
	if (get_magic_quotes_gpc() == 0) { $str = addslashes(trim($str)); };
	return $str;
}

/* --------------------------------------------------- */
// Convert timestamp to reverse human readable date yyyy?mm?dd
function datestring($date, $sep) {
    $datearray = getdate ( $date);
    $month = str_pad($datearray['mon'], 2, "0", STR_PAD_LEFT);
    $day = str_pad($datearray['mday'], 2, "0", STR_PAD_LEFT);
    $year = $datearray['year'];
    return  $year.$sep.$month.$sep.$day;
}

/* --------------------------------------------------- */
// Strip the time from a datestamp
function stripTime($timestamp) {
        $timepieces             = getdate($timestamp);
        return mktime(  0,
                                        0,
                                        0,
                                        $timepieces["mon"],
                                        $timepieces["mday"],
                                        $timepieces["year"]);
}

/* --------------------------------------------------- */
// Convert time/datestamps
function convert_timestamp ($timestamp)
{
    $parts = sscanf($timestamp, '%04u%02u%02u%02u%02u%02u');
    $string = vsprintf('%04u-%02u-%02u %02u:%02u:%02u', $parts);

    return strtotime($string);
}
/* --------------------------------------------------- */
// Removes non-ascii characters from the string
function removenonascii( $str )
{
	$result = "";
	$i = 0;
	while ( $i < strlen($str) )
	{
		$ascval = ord(substr($str, $i, 1));
		if ( (($ascval > 31) && ($ascval < 127)) ) // || (($ascval > 64) && ($ascval < 91)) || (($ascval > 96) && ($ascval < 123)) )
			$result.= substr($str, $i, 1);
		else
			$result.= "*";
		$i++;
	}

	return $result;
}
/* --------------------------------------------------- */
// Checks for valid email address
function check_email_address ( $emailaddress )
{
	return ereg( '^[-!#$%&\'*+\\./0-9=?A-Z^_`a-z{|}~]+'.'@'.'[-!#$%&\'*+\\/0-9=?A-Z^_`a-z{|}~]+\.'.'[-!#$%&\'*+\\./0-9=?A-Z^_`a-z{|}~]+$', $emailaddress);
}

/* --------------------------------------------------- */
// Work out the date suffix
function getdatesuffix( $date )
{
	if ( ($date == 1) || ($date == 21) || ($date == 31)	)
		return "st";
	else if ( ($date == 2) || ($date == 22) )
		return "nd";
	else if	( ($date == 3) || ($date == 23) )
		return "rd";
	else
		return "th";
}
/* --------------------------------------------------- */
// Return number of days in month of timestamp given
function daysInMonth($timestamp) {
    $timepieces = getdate($timestamp);
    $thisYear = $timepieces["year"];
        $thisMonth = $timepieces["mon"];
        for($thisDay=1;checkdate($thisMonth,$thisDay,$thisYear);$thisDay++);
        return $thisDay;
}
/* --------------------------------------------------- */
// Returns integer number of days between timestamps given
function dayDiff($timestamp1,$timestamp2) {
    $dayInYear1 = getDayOfYear($timestamp1);
    $dayInYear2 = getDayOfYear($timestamp2);
        $retval=((getYear($dayInYear1)*365 + $dayInYear1) -
                        (getYear($dayInYear2)*365 + $dayInYear2));
        return  $retval;
}
/* --------------------------------------------------- */
// Returns integer value of day in year
function getDayOfYear($timestamp) {
        $timepieces             = getdate($timestamp);
        return intval($timepieces["yday"]);
}
/* --------------------------------------------------- */
// Returns the Year
function getYear($timestamp) {
        $timepieces             = getdate($timestamp);
        return intval($timepieces["year"]);
}
/* --------------------------------------------------- */
// Take time away from timestamp
function sub($timestamp, $seconds,$minutes,$hours,$days,$months,$years) {
        $mytime = mktime(1+$hours,0+$minutes,0+$seconds,1+$months,1+$days,1970+$years);
        return $timestamp - $mytime;
}
/* --------------------------------------------------- */
// Add time to timestamp
function add($timestamp, $seconds,$minutes,$hours,$days,$months,$years) {
        $mytime = mktime(1+$hours,0+$minutes,0+$seconds,1+$months,1+$days,1970+$years);
 return $timestamp + $mytime;
}
/* --------------------------------------------------- */
// Returns integer day of week. Sunday = 0
function dayOfWeek($timestamp) {
        return intval(strftime("%w",$timestamp));
}
/* --------------------------------------------------- */
// Returns the first day of the month from the timestamp given (useful for function below)
function firstDayOfMonth($timestamp) {
        $timepieces             = getdate($timestamp);
        return mktime(  $timepieces["hours"],
                                        $timepieces["minutes"],
                                        $timepieces["seconds"],
                                        $timepieces["mon"],
                                        1,
                                        $timepieces["year"]);
}
/* --------------------------------------------------- */
// Returns the day name of above function
function monthStartWeekDay($timestamp) {
        return dayOfWeek(firstDayOfMonth($timestamp));
}
/* --------------------------------------------------- */
// Return string weekday from dayOfWeek
function weekDayString($weekday) {
        $myArray = Array(               0 => "Sunday",
                                                        1 => "Monday",
                                                        2 => "Tuesday",
                                                        3 => "Wednesday",
                                                        4 => "Thursday",
                                                        5 => "Friday",
                                                        6 => "Saturday");
        return $myArray[$weekday];
}