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

(function($) {
    "use strict"; 
	
	/* Preloader */
	$(window).on('load', function() {

        /* Set environment variables */
        var referral_link = "http://www.bonafide.com/?ref="
        var email = getUrlParameter('email');
        console.log("Email: " + email)
        $("#progress-steps").val(4);

      var friendCount = 20;
      $("#number_of_friends").html(friendCount);


        /* set number of circles and token here post redirect */
        $.get("http://localhost:7550/getMetadata/?email=" + email, function(metadata, status){
            var token = metadata["token"];
            var referrals = metadata["referrals"];


            referral_link = referral_link + token;
            $("#referral_link").text(referral_link);
            console.log("Referral link: " + JSON.stringify($("#referral_link")));

        });


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
