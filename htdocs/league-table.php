<?php 
	$t_start = microtime(true);
	$showScores = true;
	require_once("includes/globals.php");
	include("template/header.php");

?>
	<div class="col_9" style="margin-bottom: 100px;">
	  <h1><i class="fa fa-trophy"></i> UTA League Table</h1><br />
	  COMING SOON!
	</div>
	<!-- SIDE COLUMN -->
	<div class="col_3" style="margin-bottom: 100px;">
      <div class="SideColumnBox">
	    <h5 class="SideColumnBoxHeader"><i class="fa fa-question-circle"></i>&nbsp;&nbsp;New to UT4 Assault?</h5>
		Welcome to UTAssault! We are here to guide you on the path to becoming a world-class Assaulter, joining a professional squad, and most importantly having fun!<br />
		<span style="display: inline-block; width: 100%; text-align: center; margin-top: 10px;"><button class="large green" style="font-family: 'Open Sans' !important;">Let's get started!</button></span>
	  </div>
	  <div class="SideColumnBox">
	    <h5 class="SideColumnBoxHeader"><i class="fa fa-certificate"></i>&nbsp;&nbsp;Advertisement</h5>
	    <img src="images/TEMP-advert.jpg" />
	  </div>
	  <div class="SideColumnBox">
	    <h5 class="SideColumnBoxHeader"><i class="fa fa-star"></i>&nbsp;&nbsp;Get Social</h5>
		<span style="display: inline-block; width: 100%; text-align: center;">
		<a href="https://www.youtube.com/channel/UCO8J4g2SMgOkpNSWKX8mpVA"><img src="images/youtube.png" style="width: 30px; height:30px;" alt="Youtube" /></a>
	    <a href="http://www.facebook.com/UTAssault"><img src="images/facebook.png" style="width: 30px; height:30px;" alt="Facebook" /></a>
		<a href="https://twitter.com/utassault"><img src="images/twitter.png" style="width: 30px; height:30px;" alt="Twitter" /></a>
		<a href="irc://irc.globalgamers.net"><img src="images/TEMP-irc.png" style="width: 30px; height:30px;" alt="IRC" /></a>
		<a href="mailto:geoff.wade@arcadious.com"><img src="images/gmail.png" style="width: 30px; height:30px;" alt="Email" /></a>
		<a href="#"><img src="images/rss.png" style="width: 30px; height:30px;" /></a>
		</span>
	  </div>
	  <div class="SideColumnBox">
        <a class="twitter-timeline" href="https://twitter.com/urgamanix" data-widget-id="645499146833543168">Tweets by @urgamanix</a>
        <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
	  </div>
	</div>
<?php
	include("template/footer.php");
	$t_end = (microtime(true) - $t_start);
	echo "<!-- page_load_time: ".$t_end."s -->";
?>