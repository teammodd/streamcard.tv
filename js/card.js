// GA TRACKING
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-74998463-1', 'auto');
ga('send', 'pageview');


// BUTTONS
function channel_name () {
	alert ("channel");
}

function buyButton () {
	ga('send', {
		'hitType'			: 'event',
		'eventCategory'	: 'user',
		'eventAction'		: 'buy-button',
		'eventLabel'		: channel,
		'eventValue'		: 1
	});

	// not authed
	if (twitch_auth.oauth_token == "") {
		setCookie('paypal_request', '1');
		twitchAuth();

		// submit paypal
	} else {
		$('.paypal-form').submit();
	}
}

function shareButton () {
	ga('send', {
		'hitType'     : 'event',
		'eventCategory' : 'user',
		'eventAction'   : 'share',
		'eventLabel'    : channel,
		'eventValue'    : 1
	});
	window.open("https://twitter.com/intent/tweet?text="+encodeURIComponent("Check out "+channel+"'s Stream Card. scard.tv/channel/"+channel)+"&via=Streamcardtv");
}

function topButton () {
	location.href = "/index.html";
}

function addCard() {
	location.href = "http://dashboard.modd.live";
}

function legal() {
	location.href = "/legal.html";
}

function openKik () {
	console.log("KIK - ["+isMobile()+"]["+kik.enabled+"]");

	if (isMobile()) {
		if (kik.enabled) {
			kik.openConversation("streamcard");
			//window.open("https://kik.me/streamcard", '_blank');

			//kik.send('streamcard', {
			//  title     : 'Streamcard Notifications',
			//  text      : channel,
			//  data      : {
			//    channel : channel
			//  }
			//});

		} else {
			window.open("card://streamcard.tv/channel=" + channel);
		}

	} else {
		window.open("https://kik.me/streamcard", '_blank');

		//$('.overlay-title').text('Requires Kik');
		//$('.overlay-message').text('Visit this page within Kik browser to enable.');
		//$('.overlay-button').text('OK');
		//$('.overlay-alert').removeClass('is-hidden');
	}
}

function openDiscord () {
	console.log("DISCORD");
	//location.href = "https://discord.gg/014do3goV6bJgwIf8";
	window.open("https://discord.gg/014do3goV6bJgwIf8", '_blank');
}

function openTwitch () {
	console.log("TWITCH - "+twitch_auth.twitch_id);

	if (twitch_auth.twitch_id == "") {
		setCookie('whisper_request', "1");
		twitchAuth();

	} else {
		$.ajax({
			url: 'http://beta.modd.live/api/streamer_subscribe.php',
			type: 'GET',
			data: {
				type : 'whisper',
				channel : channel,
				username : twitch_auth.twitch_name
			},
			dataType: 'json',
			success: function(response) {
				$('.overlay-title').text('Subscribed to ' + channel);
				$('.overlay-message').text('You will now recieve updates from this streamer.');
				$('.overlay-button').text('OK');
				$('.overlay-alert').removeClass('is-hidden');
			}
		});
	}
}

function openFacebook () {
	console.log("FACEBOOK");
	window.open("http://m.me/streamcard", "_blank");
}

function support () {
	ga('send', {
		'hitType'     : 'event',
		'eventCategory' : 'user',
		'eventAction'   : 'report',
		'eventLabel'    : channel,
		'eventValue'    : 1
	});

	setTimeout(function() {
		$.ajax({
			url: 'http://beta.modd.live/api/submit_support.php',
			type: 'POST',
			data: {
				channel_id : channelID,
				message : channel + " has been reported."
			},
			dataType: 'json',
			success: function(response) {
				$(".overlayLoading").fadeOut("fast", function() {});
			}
		});
	}, 1);
}

function twitchAuth() {
	setCookie('channel', channel);

	// localhost redirect
	if (location.hostname == "localhost")
		location.href = "https://api.twitch.tv/kraken/oauth2/authorize?action=authorize&client_id=bdmreezjx7g0syk09kyzmkds978vrdj&login=&login_type=login&redirect_uri=http%3A%2F%2Flocalhost%2Fcard.html&response_type=token&scope=user_read+channel_subscriptions+chat_login&utf8=%E2%9C%93&force_verify=false";

	// live app redirect
	else {
		location.href = "https://api.twitch.tv/kraken/oauth2/authorize?action=authorize&client_id=kn6iwqzezy1kir29dvrleq4m0bf1t87&login=&login_type=login&redirect_uri=http%3A%2F%2Fstreamcard.tv%2Fcard.html&response_type=token&scope=user_read+channel_subscriptions+chat_login&utf8=%E2%9C%93&force_verify=false";
	}
}


function resizeCardPage() {
	var $twitchVideo = $('#twitch-video');

	// use the width of the video container to calculate the correct height of the video container
	var height = Math.floor(($twitchVideo.innerWidth() * 9) / 16);

	if (window.innerWidth > 600) {
		// video and chat are side by side
		$('#video-and-chat').css('height', height + 'px' );
		$('#twitch-video').css('height', '100%');
	} else {
		// video and chat are stacked.  each has it's own line
		$('#video-and-chat').css('height', 'auto');
		$('#twitch-video').css('height', height + 'px');
	}
}

function setupChatAnimationEvents() {
	// show the chat animation when the chat area scrolls into view
	$('.im-chat').one('inview', function(event, isInView){
		if (isInView) {
			$(this).addClass('reveal-chat');
		}
	});

	// add event hndlers to IM buttons to animate chat messages on mouseover
	var $imChat = $('.im-chat');
	var $imIcons = $('.im-icon');
	$imIcons
		.on('click', function(event){
			var $icon = $(event.target);
			var service = $icon.attr('data-im');

			$('.im-service-name').text(service);
			//$('#im-info').text(capitalize(service) + ' - Get real-time chat updates from your favorite game, team, and eSports players' );
			connectService = service;

			if (service.toLowerCase() == "kik") {
				$('#im-info').text("Tap to receive "+channel+"'s stats on Kik Messenger.");

			} else if (service.toLowerCase() == "discord") {
			  $('#im-info').text("Tap to receive "+channel+"'s stats on Discord.");

			} else if (service.toLowerCase() == "twitch") {
				$('#im-info').text("Tap to receive "+channel+"'s stats on Twitch's Whisper.");

			} else if (service.toLowerCase() == "facebook") {
				$('#im-info').text("Tap to receive "+channel+"'s stats on Facebook Messenger.");
			}

			// remove highlight from the previously selected tab
			$imIcons.filter('.is-selected').removeClass('is-selected');

			// highlight the new clicked tab
			$icon.addClass('is-selected');

			// trigger the chat animation when mousing over an individual chat icon
			$imChat.removeClass('reveal-chat');
			setTimeout(function(){
				$imChat.addClass('reveal-chat');
			},250);
		});
}

function connectMessenger(service) {
	if (service == "kik") {
		openKik();

	} else if (service == "discord") {
		openDiscord();

	} else if (service == "twitch") {
		openTwitch();

	} else if (service == "facebook") {
		openFacebook();
	}
}

function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

var connectService = "";

$(function(){
	// on document ready

	resizeCardPage();
	window.addEventListener('resize', resizeCardPage);

	setupChatAnimationEvents();


	//$('#messenger-connected').click(function() {
		/*
		 $.ajax({
		 url: 'http://beta.modd.live/api/card_purchases.php',
		 data: {
		 action: 'purchased',
		 twitch_id: twitch_auth.twitch_id,
		 channel: channel
		 },
		 type: 'POST',
		 dataType: 'json',
		 success: function (response) {
		 if (response.result == 1) {
		 connectMessenger(connectService.toLowerCase());
		 }
		 }
		 });
		 */

		//connectMessenger(connectService.toLowerCase());

	//});

	$('#footer-copyright').html('&copy; '+(new Date()).getFullYear()+' Streamcard.tv');
});

