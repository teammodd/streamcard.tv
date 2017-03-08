<?php header("access-control-allow-origin: *");


if (!isset($_GET['tid'])) {
	header("Location: http://gamebots.chat/");
}

// db creds
require_once ('./_db_consts.php');

// make the connection
$db_conn = mysql_connect(DB_HOST, DB_USER, DB_PASS) or die("Could not connect to database");

// select the proper db
mysql_select_db(DB_NAME) or die("Could not select database");
mysql_set_charset('utf8');


$query = 'SELECT `topic_name`, `level`, `youtube_id`, `video_title`, `image_url`, `video_url` FROM `topic_content` WHERE `id` = '. $_GET['tid'] .' LIMIT 1;';
$result = mysql_query($query);

$topicContent_obj = array();
if (mysql_num_rows($result) == 1) {
	$topicContent_obj = mysql_fetch_object($result);

} else {
	header("Location: http://gamebots.chat/");
}


// connection open
if ($db_conn) {

	// so close it!
	mysql_close($db_conn);
	$db_conn = null;
}


?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en">
  <head>
    <!-- HEADER & INCLUDES -->
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
	  <meta http-equiv="X-UA-Compatible" content="IE=edge">
	  <meta http-equiv="cache-control" content="max-age=0" />
	  <meta http-equiv="cache-control" content="no-cache" />
	  <meta http-equiv="expires" content="0" />
	  <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
	  <meta http-equiv="pragma" content="no-cache" />
	  <meta name="title" content="<?= ($topicContent_obj->topic_name ." - ". $topicContent_obj->level); ?>">
	  <meta name="description" content="<?= ($topicContent_obj->video_title); ?>">
    <meta name="author" content="MODD Website V.0.5.0">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title><?= ($topicContent_obj->topic_name ." - ". $topicContent_obj->level); ?></title>

	  <meta property="og:site_name" content="<?= ($topicContent_obj->video_title); ?>">
	  <meta property="og:url" content="<?= (isset($_SERVER['HTTPS']) ? "https://" : "http://") . $_SERVER["HTTP_HOST"] . $_SERVER['REQUEST_URI'] ?>">
	  <meta property="og:title" content="<?= ($topicContent_obj->topic_name ." - ". $topicContent_obj->level); ?>">
	  <meta property="og:description" content="<?= ($topicContent_obj->video_title); ?>">
	  <meta property="og:image" content="<?= ($topicContent_obj->image_url); ?>">

	  <!-- JS INCLUDES -->
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
	  <script type="text/javascript" src="http://cdn.kik.com/kik/2.3.6/kik.js"></script>

	  <style type="text/css">
		  html, body {
			  background-color: #000000;
				border: 0px;
				    margin: 0px;
						 overflow: hidden;
				    padding: 0px;
						background-size:100%;
						background-image: url("http://i.imgur.com/poptYlj.jpg");
					background-size: cover;
		  }
			
			iframe
			{
			    margin:0;
			    padding:0;
			    border:none;
			    overflow:hidden;
					display: block;
					z-index:1000;
			 
			}
			
			#loader {
				color:#fff;
				width:100%;
				text-align:center;
				line-height:300px;
				 font-family: "Helvetica", Times, serif;
				 font-size: 20px;
				 z-index:10;
			}
			
			#video {
				top:0px;
				left:0px;
				z-index:0;
			}
			
			
	  </style>
		
		<script>
		  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

		  ga('create', 'UA-83707103-1', 'auto');
		  ga('send', 'pageview');
			
			ga('send', {
			'hitType': 'event',
			'eventCategory': 'video',
			'eventAction': 'view',
			'eventLabel': '',
			'eventValue': 1
			});
			
			$.ajax({
  			url       : "http://beta.modd.live/api/bot_tracker.php",
  			method    : 'GET',
  			dataType  : 'json',
  			data      : {
  				src       : "kik",
  				category  : "click",
  				action    : "<?= (md5($_GET['user'])); ?>",
  				label     : "<?= ($_GET['user']); ?>",
  				value     : "0",
  				cid       : "<?= (md5($_GET['user'])); ?>"
  			}
  		}).then(null, function (jqXHR, textStatus, errorThrown) {
  		}).always(function () {
  		});

		</script>
		
  </head>

  <body>
  <script type="text/javascript">
		kik.metrics.enableGoogleAnalytics('UA-83707103-1', 'gamebots.chat', true);
		
	  $(document).ready(function() {
		 //location.href = "<?= ($topicContent_obj->video_url); ?>";
		
		 video_url = "https://www.youtube.com/embed/"+"<?= ($topicContent_obj->youtube_id); ?>"+"?rel=0&amp;controls=0&amp;showinfo=0&amp;autoplay=1";
		 
		 function adjust () {
			 
		 $(function(){
		   $('#video').css({ width: $(window).innerWidth() + 'px', height: $(window).innerHeight()  + 'px' });

		   $(window).resize(function(){
		     $('#video').css({ width: $(window).innerWidth() + 'px', height: $(window).innerHeight()  + 'px' });
		   });
		 });
		 
		 }
		 
		setTimeout(function(){
			 $('#video').attr("src", video_url);
			  $('#loader').remove();
				adjust();
		}, 5000);
		 

		
	  });
		
		
		
  </script>
		<div id="loader">Loading video...<br><img src="img/spinner.gif" width="50px" height="50px"></div>
		<iframe id="video" src="" frameborder="0" allowfullscreen></iframe>
		
  </body>
</html>
