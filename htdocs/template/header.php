<!DOCTYPE html>
<html>
<head>
	<!-- META -->
	<title>Welcome - Unreal Tournament Assault League</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
	<meta name="description" content="Unreal Tournament 4 Assault's Competitive League. Come join professional players from around the world for FREE! Register now!" />
	<meta name="author" content="Geoff Wade" />
	<link href="images/favico.ico" rel="shortcut icon">
	
	<!-- CSS -->
	<link rel="stylesheet" type="text/css" href="css/kickstart.css" media="all" />
	<link rel="stylesheet" type="text/css" href="style.css" media="all" />
	<link rel="stylesheet" type="text/css" href="css/banner-rotator.css" media="all" />
	
	<!-- JAVASCRIPT -->
	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	<script type="text/javascript" src="js/kickstart.js"></script>
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
	<script type="text/javascript" src="js/jquery.flashblue-plugins.js"></script>
	<script type="text/javascript" src="js/jquery.banner-rotator.js"></script>
</head>
<body>
  <!-- TOP BAR -->
  <div id="TopBar">
    <a id="top"></a>
    <div class="grid">
      <div id="TopLinks"><i class="fa fa-user"></i> <a href="#">REGISTER</a> | <i class="fa fa-sign-in"></i> <a href="#">LOGIN</a></div>
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
	      <div id="MenuBar"><i class="fa fa-home"></i> <a href="/">HOME</a></div><div style="display: inline-block; padding-left: 10px; padding-right: 10px; border-right: 1px solid #ffffff;"><i class="fa fa-trophy"></i> <a href="league-table.php">LEAGUE</a></div><div style="display: inline-block; padding-left: 10px; padding-right: 10px; border-right: 1px solid #ffffff;"><i class="fa fa-user"></i> <a href="players.php">PLAYERS</a></div><div style="display: inline-block; padding-left: 10px; padding-right: 10px; border-right: 1px solid #ffffff;"><i class="fa fa-gamepad"></i> <a href="maps-and-guides.php">MAPS & GUIDES</a></div><div style="display: inline-block; padding-left: 10px; padding-right: 10px; border-right: 1px solid #ffffff;"><i class="fa fa-comment"></i> <a href="http://forums.utassault.net">COMMUNITY</a></div><div style="display: inline-block; padding-left: 10px; padding-right: 10px;"><i class="fa fa-info-circle"></i> <a href="support.php">SUPPORT</a></div>
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