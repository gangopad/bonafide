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

    return "None";
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


/*
On click of claim spot this function is called 
*/
document.getElementById("claim_spot").onclick = function () {

        /* Send email information to backend by way of REST call */
        /*update waiting list number to backend by way of REST call */
        var email = "email";
        var IP_data = "no ip";
        var referrer_token = getUrlParameter('ref');
        var token =  Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6);
        var referrals = 0;

        $.getJSON('http://gd.geobytes.com/GetCityDetails?callback=?', function(data) {
        /* console.log("IP shit: " + JSON.stringify(data, null, 2)); */
        IP_data = JSON.stringify(data, null, 2);
        


        $.get("http://localhost:7550/getWaitingList", function(data, status){
        var signups = JSON.parse(data)["value"];
        email = document.getElementById("gemail").value;

        /* console.log("Value: " + signups);
        console.log("Email: " + email); */

        var counter = parseInt(signups); /*pull this from backend */        
        counter++;
        $("#hiddenVal").val(counter);
        $("#num_customers").attr("data-count", counter);



        /*updates the waiting list*/
        $.get("http://localhost:7550/updateWaitingList", function(data, status){
        });
       
        


        $.post( "http://localhost:7550/data", {"email": email, "ip": IP_data, "referrer_token": referrer_token, "token": token})
          .done(function( data ) {
            console.log("Data response: " + JSON.stringify(data));

        /*redirect */
        /* set number of circles and token here pre redirect */
        $.get("http://localhost:7550/getMetadata/?email=" + email, function(metadata, status){
            
            if (metadata["token"] != "None") {
                token = metadata["token"];
                referrals = metadata["referrals"];
            }
        
             location.href = "success.html?token=" + token;

        });  

        });

        });

        });
        

        
    };


(function($) {
    "use strict"; 

	/* Preloader */
	$(window).on('load', function() {

        /* Set environment variables */
        $.get("http://localhost:7550/getWaitingList", function(data, status){
        var signups = JSON.parse(data)["value"];
        var counter = parseInt(signups); /*pull this from backend */    
        var meals = Math.round(counter * 4.35);

        /* console.log("NUM CUSTOMERS: " + $("#num_customers").attr("data-count")); */
        $("#hiddenVal").val(counter);
        $("#num_customers").attr("data-count", counter);


        $("#hiddenValMeals").val(counter);
        $("#num_meals").attr("data-count", meals);


        /* console.log("NUM CUSTOMERS: " + $("#num_customers").attr("data-count")); */
        });


		var preloaderFadeOutTime = 500;
		function hidePreloader() {
			var preloader = $('.spinner-wrapper');
			setTimeout(function() {
				preloader.fadeOut(preloaderFadeOutTime);
			}, 500);
		}
		hidePreloader();
	});

	
	/* Navbar Scripts */
	// jQuery to collapse the navbar on scroll
	$(window).scroll(function() {
		if ($(".navbar").offset().top > 60) {
			$(".fixed-top").addClass("top-nav-collapse");
		} else {
			$(".fixed-top").removeClass("top-nav-collapse");
		}
	});

	// jQuery for page scrolling feature - requires jQuery Easing plugin
	$(function() {
		$(document).on('click', 'a.page-scroll', function(event) {
			var $anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $($anchor.attr('href')).offset().top
			}, 600, 'easeInOutExpo');
			event.preventDefault();
		});
	});

    // closes the responsive menu on menu item click
    $(".navbar-nav li a").on("click", function(event) {
    if (!$(this).parent().hasClass('dropdown'))
        $(".navbar-collapse").collapse('hide');
    });


    

    /* Image Slider 1 - Swiper */
    var imageSlider = new Swiper('.image-slider-1', {
        autoplay: {
            delay: 2000,
            disableOnInteraction: false
		},
        loop: true,
        spaceBetween: -30,
        slidesPerView: 5,
		breakpoints: {
            // when window is <= 380px
            380: {
                slidesPerView: 1,
                spaceBetween: 10
            },
            // when window is <= 516px
            516: {
                slidesPerView: 2,
                spaceBetween: 10
            },
            // when window is <= 768px
            768: {
                slidesPerView: 3,
                spaceBetween: 20
            },
            // when window is <= 992px
            992: {
                slidesPerView: 4,
                spaceBetween: 30
            },
            // when window is <= 1200px
            1200: {
                slidesPerView: 5,
                spaceBetween: 30
            },
        }
    });


    /* Text Slider - Swiper */
	var textSlider = new Swiper('.text-slider', {
        autoplay: {
            delay: 4000,
            disableOnInteraction: false
		},
        loop: true,
        navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev'
		}
    });


    /* Image Slider 2 - Swiper */
	var imageSlider = new Swiper('.image-slider-2', {
        autoplay: {
            delay: 3000,
            disableOnInteraction: false
		},
        loop: true,
    });


	/* Image Slider - Magnific Popup */
	$('.popup-link').magnificPopup({
		removalDelay: 300,
		type: 'image',
		callbacks: {
			beforeOpen: function() {
				this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure ' + this.st.el.attr('data-effect'));
			},
			beforeClose: function() {
				$('.mfp-figure').addClass('fadeOut');
			}
		},
		gallery:{
			enabled:true //enable gallery mode
		}
    });
    

    /* Filter - Isotope */
    var $grid = $('.grid').isotope({
        // options
        itemSelector: '.element-item',
        layoutMode: 'fitRows'
    });
    
    // filter items on button click
    $('.filters-button-group').on( 'click', 'a', function() {
        var filterValue = $(this).attr('data-filter');
        $grid.isotope({ filter: filterValue });
    });
    
    // change is-checked class on buttons
    $('.button-group').each( function( i, buttonGroup ) {
        var $buttonGroup = $( buttonGroup );
        $buttonGroup.on( 'click', 'a', function() {
            $buttonGroup.find('.is-checked').removeClass('is-checked');
            $( this ).addClass('is-checked');
        });	
    });


    /* Counter - CountTo */
	var a = 0;
	$(window).scroll(function() {
		if ($('#counter').length) { // checking if CountTo section exists in the page, if not it will not run the script and avoid errors	
			var oTop = $('#counter').offset().top - window.innerHeight;
			if (a == 0 && $(window).scrollTop() > oTop) {
			$('.counter-value').each(function() {
				var $this = $(this),
				countTo = $this.attr('data-count');
				$({
				countNum: $this.text()
				}).animate({
					countNum: countTo
				},
				{
					duration: 2000,
					easing: 'swing',
					step: function() {
					$this.text(Math.floor(this.countNum));
					},
					complete: function() {
					$this.text(this.countNum);
					//alert('finished');
					}
				});
			});
			a = 1;
			}
		}
    });
    

    /* Input File Button Styling */
    ;( function ( document, window, index )
    {
        var inputs = document.querySelectorAll( '.inputfile' );
        Array.prototype.forEach.call( inputs, function( input )
        {
            var label	 = input.nextElementSibling,
                labelVal = label.innerHTML;

            input.addEventListener( 'change', function( e )
            {
                var fileName = '';
                if( this.files && this.files.length > 1 )
                    fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
                else
                    fileName = e.target.value.split( '\\' ).pop();

                if( fileName )
                    label.querySelector( 'span' ).innerHTML = fileName;
                else
                    label.innerHTML = labelVal;
            });

            // Firefox bug fix
            input.addEventListener( 'focus', function(){ input.classList.add( 'has-focus' ); });
            input.addEventListener( 'blur', function(){ input.classList.remove( 'has-focus' ); });
        });
    }( document, window, 0 ));


    /* Move Form Fields Label When User Types */
    // for input and textarea fields
    $("input, textarea").keyup(function(){
		if ($(this).val() != '') {
			$(this).addClass('notEmpty');
		} else {
			$(this).removeClass('notEmpty');
		}
    });
    

	/* Application Form */
    $("#ApplicationForm").validator().on("submit", function(event) {
    	if (event.isDefaultPrevented()) {
            // handle the invalid form...
            gformError();
            gsubmitMSG(false, "Please fill all fields!");
        } else {
            // everything looks good!
            event.preventDefault();
            gsubmitForm();
        }
    });

    function gsubmitForm() {
        //data to be sent to server        
        var m_data = new FormData();   
        m_data.append( 'first_name', $('#gname').val());
        m_data.append( 'email_address', $('#gemail').val());
        m_data.append( 'phone', $('#gphone').val());
        m_data.append( 'job', $('#gjob').val());
        m_data.append( 'file_attach', $('input[name=file_attach]')[0].files[0]);
        m_data.append( 'terms', $('#gterms').val());
        $.ajax({
            url: "php/applicationform-process.php",
            data: m_data,
            processData: false,
            contentType: false,
            type: 'POST',
            dataType:'text',
            success: function(result){
                console.log(result);
                if (result == "success") {
                    gformSuccess();
                } else if (result == "not-pdf") {
                    gformError();
                    gformNotPdf();
                }  else if (result == "too-large") {
                    gformError();
                    gformTooLarge();
                } else {
                    gformError();
                    gformProblem();
                }
            }
        })
	}

    function gformSuccess() {
        $("#ApplicationForm")[0].reset();
        document.getElementById("filelabel").innerHTML = "Choose file"; // resets the Choose File button
        gsubmitMSG(true, "Message Submitted!")
    }

    function gformNotPdf() {
        $("#ApplicationForm")[0].reset();
        document.getElementById("filelabel").innerHTML = "Choose file";
        gsubmitMSG(true, "Only PDF, DOC, DOCX files allowed")
    }

    function gformTooLarge() {
        $("#ApplicationForm")[0].reset();
        document.getElementById("filelabel").innerHTML = "Choose file";
        gsubmitMSG(true, "File should be less than 6 MB")
    }

    function gformProblem() {
        $("#ApplicationForm")[0].reset();
        document.getElementById("filelabel").innerHTML = "Choose file";
        gsubmitMSG(true, "Please fill all fields!")
    }

    function gformError() {
        $("#ApplicationForm").removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $(this).removeClass();
        });
	}

    function gsubmitMSG(valid, msg) {
        if (valid) {
            var msgClasses = "h3 text-center tada animated";
        } else {
            var msgClasses = "h3 text-center";
        }
        $("#gmsgSubmit").removeClass().addClass(msgClasses).text(msg);
        $("input").removeClass('notEmpty'); // resets input field labels after submission
	}

    
	/* Contact Form */
    $("#ContactForm").validator().on("submit", function(event) {
    	if (event.isDefaultPrevented()) {
            // handle the invalid form...
            cformError();
            csubmitMSG(false, "Please fill all fields!");
        } else {
            // everything looks good!
            event.preventDefault();
            csubmitForm();
        }
    });

    function csubmitForm() {
        // initiate variables with form content
		var name = $("#cname").val();
		var email = $("#cemail").val();
        var message = $("#cmessage").val();
        var terms = $("#cterms").val();
        $.ajax({
            type: "POST",
            url: "php/contactform-process.php",
            data: "name=" + name + "&email=" + email + "&message=" + message + "&terms=" + terms, 
            success: function(text) {
                if (text == "success") {
                    cformSuccess();
                } else {
                    cformError();
                    csubmitMSG(false, text);
                }
            }
        });
	}

    function cformSuccess() {
        $("#ContactForm")[0].reset();
        csubmitMSG(true, "Message Submitted!")
    }

    function cformError() {
        $("#ContactForm").removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $(this).removeClass();
        });
	}

    function csubmitMSG(valid, msg) {
        if (valid) {
            var msgClasses = "h3 text-center tada animated";
        } else {
            var msgClasses = "h3 text-center";
        }
        $("#cmsgSubmit").removeClass().addClass(msgClasses).text(msg);
        $("input").removeClass('notEmpty'); // resets the field label after submission
        $("textarea").removeClass('notEmpty'); // resets the field label after submission
    }


    /* Privacy Form */
    $("#PrivacyForm").validator().on("submit", function(event) {
    	if (event.isDefaultPrevented()) {
            // handle the invalid form...
            pformError();
            psubmitMSG(false, "Please fill all fields!");
        } else {
            // everything looks good!
            event.preventDefault();
            psubmitForm();
        }
    });

    function psubmitForm() {
        // initiate variables with form content
		var name = $("#pname").val();
		var email = $("#pemail").val();
        var select = $("#pselect").val();
        var terms = $("#pterms").val();
        
        $.ajax({
            type: "POST",
            url: "php/privacy-process.php",
            data: "name=" + name + "&email=" + email + "&select=" + select + "&terms=" + terms, 
            success: function(text) {
                if (text == "success") {
                    pformSuccess();
                } else {
                    pformError();
                    psubmitMSG(false, text);
                }
            }
        });
	}

    function pformSuccess() {
        $("#PrivacyForm")[0].reset();
        psubmitMSG(true, "Request Submitted!")
    }

    function pformError() {
        $("#PrivacyForm").removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $(this).removeClass();
        });
	}

    function psubmitMSG(valid, msg) {
        if (valid) {
            var msgClasses = "h3 text-center tada animated";
        } else {
            var msgClasses = "h3 text-center";
        }
        $("#pmsgSubmit").removeClass().addClass(msgClasses).text(msg);
        $("input").removeClass('notEmpty'); // resets the field label after submission
    }
    

    /* Back To Top Button */
    // create the back to top button
    $('body').prepend('<a href="body" class="back-to-top page-scroll">Back to Top</a>');
    var amountScrolled = 700;
    $(window).scroll(function() {
        if ($(window).scrollTop() > amountScrolled) {
            $('a.back-to-top').fadeIn('500');
        } else {
            $('a.back-to-top').fadeOut('500');
        }
    });


	/* Removes Long Focus On Buttons */
	$(".button, a, button").mouseup(function() {
		$(this).blur();
	});
    /* Header YouTube Background - YTPlayer */
	  jQuery(function(){
		    jQuery("#bgndVideo").YTPlayer();
	  });

})(jQuery);
