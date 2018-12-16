/* Author: Anirban Gangopadhyay
   Created: Oct 2018
   Description: Custom JS file
*/

/* gets the URL parameters */
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

document.addEventListener('keydown', function() {
  if (event.keyCode == 123) {
    /* alert("This function has been disabled to prevent you from stealing my code!"); */
    return false;
  } else if (event.ctrlKey && event.shiftKey && event.keyCode == 73) {
    /* alert("This function has been disabled to prevent you from stealing my code!"); */
    return false;
  } else if (event.ctrlKey && event.keyCode == 85) {
    /* alert("This function has been disabled to prevent you from stealing my code!"); */
    return false;
  }
}, false);

if (document.addEventListener) {
  document.addEventListener('contextmenu', function(e) {
    /* alert("This function has been disabled to prevent you from stealing my code!"); */
    e.preventDefault();
  }, false);
} else {
  document.attachEvent('oncontextmenu', function() {
    /* alert("This function has been disabled to prevent you from stealing my code!"); */
    window.event.returnValue = false;
  });
}

(function($) {
    "use strict"; 
	
	/* Preloader */
	$(window).on('load', function() {

      /* Set environment variables */
      var referral_link = "http://www.yourbonafide.com/?ref="
      var email = getUrlParameter('email');
      var token = getUrlParameter('token');
      var referrals = getUrlParameter('referrals');
      referral_link = referral_link + token;

      var fb_link = "https://www.facebook.com/sharer/sharer.php?u=" + referral_link;
      var twitter_link = "https://twitter.com/intent/tweet?url=" + referral_link + "&text=Bonafide%20is%20on%20a%20mission%20to%20make%20home-cooked%20meals%20accessible%20to%20everyone,%20without%20the%20hassle%20of%20cutting%20any%20vegetables.%20Sign%20up%20for%20their%20private%20beta";
      var mail_link = "mailto:?subject=Bonafide%20is%20changing%20the%20take-out%20delivery%20game&body=I%20found%20out%20about%20Bonafide%20and%20thought%20it%20might%20interest%20you%20too.%20Bonafide%20is%20on%20a%20mission%20to%20make%20home-cooked%20meals%20accessible%20to%20everyone,%20without%20the%20hassle%20of%20cutting%20any%20vegetables.%0A%0AJoin%20Bonafide%20and%20we'll%20both%20get%20closer%20to%20having%20home-cooked%20meals%20delivered%20straight%20to%20our%20doorstep%20(potentially%20even%20for%20free!).%20Click%20the%20following%20link%20to%20join%20the%20movement:%20" + referral_link;

      console.log("Email: " + email);
      $("#progress-steps").val(4);
    
      /*var twitter_url = "https://twitter.com/intent/tweet?url=https://smartasset.com&text=Bonafide%20is%20on%20a%20mission%20to%20make%20home-cooked%20meals%20accessible%20to%20everyone,%20without%20the%20hassle%20of%20cutting%20any%20vegetables.%20Sign%20up%20for%20their%20private%20beta";
      $("#twitter-url").html(twitter_url); // Set herf value */
      document.getElementById("twitter-url").href = twitter_link;
      document.getElementById("fb-url").href = fb_link;
      document.getElementById("mail-url").href = mail_link;


      var friendCount = referrals;
      var referrals_left = 0;

      if (friendCount < 5) {
        referrals_left = 5 - friendCount;
      } else if (friendCount < 10) {
        referrals_left = 10 - friendCount;
      } else if (friendCount < 25) {
        referrals_left = 25 - friendCount;
      } else if (friendCount< 50) {
        referrals_left = 50 - friendCount;
      }
 
      $("#number_of_friends").html(friendCount);
      $("#referrals_left").html(referrals_left);

      $("#referral_link").text(referral_link);
      console.log("Referral link: " + JSON.stringify($("#referral_link")));



      /* set progress steps based on value of friendCount */

      $('.progress-step').each(function(index, element){
          if ($(element).data('friend-count')<friendCount){
              $(element).addClass('is-complete');
          } else if ($(element).data('friend-count')==friendCount){
              $(element).addClass('is-active');
          }
      });




	});
})(jQuery);
