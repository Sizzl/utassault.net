<?php 
	$t_start = microtime(true);
	$showScores = true;
	require_once("includes/globals.php");
	include("template/header.php");

?>
	<div class="col_9" style="margin-bottom: 100px;">
	  <h1><i class="fa fa-newspaper-o"></i> Latest News</h1><br />
	  <!-- BANNER -->
      <div class="bannercontainer responsive" style="margin-bottom: 25px;">
        <div class="banner">
          <ul>		  
            <li data-title="News 1" data-delay="8000" data-transition="fade">
              <img src="images/TEMP-pic1.jpg" />
              <div class="caption fade frontcorner" style="height: 73px; background: none; border: 0;" data-x="0" data-y="380")>
                <h3 style="background-color: rgba(0,0,0,0.8); display: inline-block; padding: 5px !important; margin: 0px !important; margin-left: 5px !important; text-transform: uppercase;">Guardia v15 released!</h3><br />
		        <p style="background-color: rgba(0,0,0,0.8); display: inline-block; margin: 5px !important; padding: 5px !important;">Yes, meshing has begun! Find out how you can play-test and see the latest changes.</p>
              </div>
            </li>
            <li data-title="News 2" data-delay="8000" data-transition="fade">
              <img src="images/TEMP-pic3.jpg" />
              <div class="caption fade frontcorner" style="height: 73px; width: 800px !important; background: none; border: 0;" data-x="0" data-y="400" data-width="900" width="900">
                <h3 style="background-color: rgba(0,0,0,0.8); display: inline-block; padding: 5px !important; margin: 0px !important; margin-left: 5px !important;text-transform: uppercase;">Ballistic is here!</h3><br />
		        <p style="background-color: rgba(0,0,0,0.8); display: inline-block; margin: 5px !important; padding: 5px !important;">Change your pants and get the insider news on Assault's greatest map!</p>
              </div>
            </li>
		  </ul>
        </div>
      </div>
	  <div class="col_4" style="margin-bottom: 20px;"><img src="images/TEMP-news3.jpg" alt="News Headline 1" /><br /><span style="line-height: 10px !important;">OLDER NEWS HEADLINE 1</span><br /><span style="font-size: 9px; line-height: 9px !important;">15th August 2015  |  Urgamanix</span><br />This is a general description of the news item.</div>
	  <div class="col_4" style="margin-bottom: 20px;"><img src="images/TEMP-news3.jpg" alt="News Headline 1" />OLDER NEWS HEADLINE 2</div>
	  <div class="col_4" style="margin-bottom: 20px;"><img src="images/TEMP-news3.jpg" alt="News Headline 1" />OLDER NEWS HEADLINE 3</div>
	  <!-- YOUTUBE PLAYLIST -->
	  <h1 style="clear: both; text-align: left; border-bottom: 1px solid #ffffff; margin-bottom: 0px; padding-bottom: 5px !important; color: #ffffff; text-transform: uppercase; font-size: 36px; line-height: 36px;"><i class="fa fa-youtube-play"></i> UTA Matchcasts</h1><br />
	  <iframe width="853" height="480" src="https://www.youtube.com/embed/videoseries?list=PLdI4IvqlmASsXCSAu_IDy-nsVdyePST4H" frameborder="0" allowfullscreen></iframe>
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