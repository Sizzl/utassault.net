<?php 
	$t_start = microtime(true);
	$showScores = false;
	require_once("includes/globals.php");
	include("template/header.php");

?>
	<div class="col_9">
	  <h1 style="margin-top: 0px !important; border-bottom: 1px solid #ffffff; margin-bottom: 0px; padding-bottom: 15px !important; color: #ffffff; text-transform: uppercase; font-size: 36px; line-height: 36px;"><i class="fa fa-gamepad"></i> Map &amp; Guides (AS v2.53)</h1><br />
	  <p>Put these maps in the following directory:<br /><i>C:\Users\&lt;Your User&gt;\Documents\UnrealTournament\Saved\Paks\DownloadedPaks</i><br /><b style="color: #ffffff;">ALWAYS DELETE OLD ASSAULT .PAKS!</b><br /><br /></p>
  	  <a href="https://ut.rushbase.net/BloodK1nG/AS-Ballistic-v10-WindowsNoEditor.pak"><span style="font-size: 18px; text-transform: uppercase;">AS-Ballistic&nbsp;&nbsp;(v10)</span></a> | <a href="https://www.youtube.com/watch?v=2JEzcE0KOKQ">GUIDE</a><br /><br />
  	  <a href="https://ut.rushbase.net/Urgamanix/AS-Desertstorm-v12-WindowsNoEditor.pak"><span style="font-size: 18px; text-transform: uppercase;">AS-Desertstorm&nbsp;&nbsp;(v12)</span></a><br /><br />
	  <a href="https://ut.rushbase.net/BloodK1nG/AS-Frigate-v08-WindowsNoEditor.pak"><span style="font-size: 18px; text-transform: uppercase;">AS-Frigate&nbsp;&nbsp;(v08)</span></a><br /><br />
   	  <a href="https://ut.rushbase.net/BloodK1nG/AS-Golgotha2-v07-WindowsNoEditor.pak"><span style="font-size: 18px; text-transform: uppercase;">AS-Golgotha][&nbsp;&nbsp;(v07)</span></a><br /><br />
  	  <a href="https://ut.rushbase.net/Urgamanix/AS-Guardia-v26-WindowsNoEditor.pak"><span style="font-size: 18px; text-transform: uppercase;">AS-Guardia&nbsp;&nbsp;(v26)</span></a><br /><br />
  	  <a href="https://ut.rushbase.net/Urgamanix/AS-Overlord99-v15-WindowsNoEditor.pak"><span style="font-size: 18px; text-transform: uppercase;">AS-Overlord99&nbsp;&nbsp;(v15)</span></a><br /><br />
	  <a href="https://ut.rushbase.net/BloodK1nG/AS-Riverbed-v07-WindowsNoEditor.pak"><span style="font-size: 18px; text-transform: uppercase;">AS-Riverbed&nbsp;&nbsp;(v07)</span></a><br /><br />
  	  <a href="https://ut.rushbase.net/Urgamanix/AS-Rook-v17-WindowsNoEditor.pak"><span style="font-size: 18px; text-transform: uppercase;">AS-Rook&nbsp;&nbsp;(v17)</span></a><br /><br />
  	  <a href="https://ut.rushbase.net/BloodK1nG/AS-Saqqara-v06-WindowsNoEditor.pak"><span style="font-size: 18px; text-transform: uppercase;">AS-Saqqara&nbsp;&nbsp;(v06)</span></a><br /><br />	  
   	  <span style="font-size: 18px; text-transform: uppercase;">AS-Siege&nbsp;&nbsp;(v05)</span>
		</div>
	<div class="col_3">
	<div style="width: 100%; padding: 5px; height: 200px; border: 1px solid #333333; background-color: rgba(0,0,0,0.4); margin-bottom: 20px;">
	  <h5 style="font-size: 14px; line-height: 14px; margin: 0px !important; border-bottom: 1px solid #333333; padding-top: 0px; padding-bottom: 3px;"><i class="fa fa-question-circle"></i> Want to Join the Community?</h5>
	  <p>Find us on IRC! <a href="irc://irc.globalgamers.net/ut.assault">Click here!</a></p>
	  </div>
	</div>
<?php
	include("template/footer.php");
	$t_end = (microtime(true) - $t_start);
	echo "<!-- page_load_time: ".$t_end."s -->";
?>