<!DOCTYPE html>
<html>
<head>
	<!-- META -->
	<title>Welcome - Unreal Tournament Assault League</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
	<meta name="description" content="Unreal Tournament 4 Assault's Competitive League. Come join professional players from around the world for FREE! Register now!" />
	<meta name="author" content="Geoff Wade" />
	<?php
		if (defined('SITE_ROOT')) {
			echo "<base href=\"".SITE_ROOT."\" />";
		}
	?>
	<link href="images/favico.ico" rel="shortcut icon">
	
	<!-- CSS -->
	<link rel="stylesheet" type="text/css" href="css/kickstart.css" media="all" />
	<link rel="stylesheet" type="text/css" href="style.css" media="all" />
	<link rel="stylesheet" type="text/css" href="css/banner-rotator.css" media="all" />
	
	<!-- JAVASCRIPT -->
	<!-- <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script> -->
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
	<script type="text/javascript" src="js/kickstart.js"></script>
	<script type="text/javascript" src="js/jquery.flashblue-plugins.js"></script>
	<script type="text/javascript" src="js/jquery.simple-text-rotator.js"></script>
	<!-- <script type="text/javascript" src="js/jquery.leanModal.js"></script> -->
	<script type="text/javascript" src="js/jquery.banner-rotator.js"></script>
	<script type="text/javascript">
		$(function() {
			$('#TopPanel').data('clickState',0);
			$('#TopBar-TopLinks-Login').click(function(){

				if (!($('#TopPanel').data('clickState'))) {
					$('#TopPanel').data('clickState',1);
   					$('#TopPanel').slideDown();
   				} else {
   					$('#TopPanel').data('clickState',0);
					$('#TopPanel').slideUp();
   				}
			});
		});
  </script>
</head>
<body>
  <!-- TOP BAR -->
  <div id="TopBar">
    <a id="top"></a>
    <div class="grid">
      <div id="TopLinks">
      <?php 
      	if (isset($_SESSION['uta_user'])) {
      		echo "Welcome <i class=\"fa fa-user\"></i> ".$_SESSION['uta_user']." | ";
       		echo "<i class=\"fa fa-sign-out\"></i> <a id=\"TopBar-TopLinks-Logout\" href=\"".THIS_PAGE."/logout\">LOG OUT</a></div>";
      	} else {
      		echo "<i class=\"fa fa-user\"></i> <a href=\"https://forums.utassault.net/index.php?register\" target=\"_blank\">REGISTER</a> | ";
       		echo "<i class=\"fa fa-sign-in\"></i> <a id=\"TopBar-TopLinks-Login\" href=\"".THIS_PAGE."#\">LOGIN</a></div>";
      	}
      ?>
    </div>
    <br style="clear: both;" />
  </div>
  <!-- TOP PANEL -->
  <div id="TopPanel">
  	<div class="user_login">
	<!-- Username & Password Login form -->
        <form name="mail_login" method="POST">
            <div class="one_sixth">
			  	<div class="social_login">
				    <i class="fa fa-envelope-square fa-2x"></i> <i class="fa fa-steam-square fa-2x"></i> <br />
				    <i class="fa fa-google-plus-square fa-2x" style="color: #DD4B39;"></i> <i class="fa fa-facebook-square fa-2x" style="color: #3B5998;"></i>     
			    </div>
            </div>
        	<div class="one_third next">
                <label>Email / Username</label>
                <input type="text" name="uta_username" tabindex="1" />
            </div>
            <div class="one_third next">
            	<label>Password</label> &nbsp; <i><a class="forgot_password" href="#">(Reset password)</a></i>
            	<input type="password" name="uta_password" tabindex="2" />
            </div>
            <div class="one_sixth next">
            	&nbsp;<br />
            	<div class="action_btns">
                   	<button type="submit" class="large green" tabindex="3">Login</a>
	            </div>
            </div>
        </form>
  	</div>
    <br style="clear: both;" />
  </div>
  <!-- TITLE BAR -->
  <div id="TitleBar">
    <div class="grid">
      <div id="TitleBarInner" class="col_12">
        <div id="TitleBarTitle">
	      <h1>Unreal Tournament &#8226; Assault League</h1><br />
		  <!-- MENU -->
	      <div id="MenuBar"><i class="fa fa-home"></i> <a href="/">HOME</a></div><div style="display: inline-block; padding-left: 10px; padding-right: 10px; border-right: 1px solid #ffffff;"><i class="fa fa-trophy"></i> <a href="league-table.php">LEAGUE</a></div><div style="display: inline-block; padding-left: 10px; padding-right: 10px; border-right: 1px solid #ffffff;"><i class="fa fa-user"></i> <a href="players.php">PLAYERS</a></div><div style="display: inline-block; padding-left: 10px; padding-right: 10px; border-right: 1px solid #ffffff;"><i class="fa fa-gamepad"></i> <a href="maps-and-guides.php">MAPS &amp; GUIDES</a></div><div style="display: inline-block; padding-left: 10px; padding-right: 10px; border-right: 1px solid #ffffff;"><i class="fa fa-comment"></i> <a href="https://forums.utassault.net/index.php?misc/style&amp;style_id=4">COMMUNITY</a></div><div style="display: inline-block; padding-left: 10px; padding-right: 10px;"><i class="fa fa-info-circle"></i> <a href="support.php">SUPPORT</a></div>
		</div>
	    <img src="images/newlogo58.jpg" id="TitleBarLogo" alt="UTA Logo" />
        <br style="clear: both;" />
	  </div>
    </div>
   <br style="clear: both;" />
  </div>
  <?php if($showScores == true) { ?>
  <!-- SCORES BAR -->
  <div id="ScoreBar">
    <div class="grid">
		<div class="col_2 ScoreBarBox">
		  <div class="BlueTeam"><div class="TheTeam">swedes~</div><div class="TheScore">0</div>&nbsp;</div>
		  <div class="RedTeam"><div class="TheTeam">stars~</div><div class="TheScore">3</div>&nbsp;</div>
		</div>
		<div class="col_2 ScoreBarBox">
		  <div class="BlueTeam"><div class="TheTeam">ladies~</div><div class="TheScore">3</div>&nbsp;</div>
		  <div class="RedTeam"><div class="TheTeam">[GENIUS]</div><div class="TheScore">0</div>&nbsp;</div>
		</div>
		<div class="col_2 ScoreBarBox">
		  <div class="BlueTeam"><div class="TheTeam">WISH-TEAM</div><div class="TheScore">4</div>&nbsp;</div>
		  <div class="RedTeam"><div class="TheTeam">BAMZZ-TEAM</div><div class="TheScore">0</div>&nbsp;</div>
		</div>
		<div class="col_2 ScoreBarBox">
		  <div class="BlueTeam"><div class="TheTeam">HANK-TEAM</div><div class="TheScore">2</div>&nbsp;</div>
		  <div class="RedTeam"><div class="TheTeam">BAMZZ-TEAM</div><div class="TheScore">4</div>&nbsp;</div>
		</div>
		  <div class="col_2 ScoreBarBox">
		  <div class="BlueTeam"><div class="TheTeam">URGA-TEAM</div><div class="TheScore">4</div>&nbsp;</div>
		  <div class="RedTeam"><div class="TheTeam">FARAC-TEAM</div><div class="TheScore">3</div>&nbsp;</div>
		</div>
		<div class="col_2 ScoreBarBox">
		  <div class="BlueTeam"><div class="TheTeam">SOBO-TEAM</div><div class="TheScore">5</div>&nbsp;</div>
		  <div class="RedTeam"><div class="TheTeam">VICKIE-TEAM</div><div class="TheScore">3</div>&nbsp;</div>
		</div>
    </div>
    <br style="clear: both;" />
  </div>
  <?php } ?>
  <!-- MAIN CONTENT -->
  <div class="grid" id="MainContent">