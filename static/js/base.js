/*--------Changes header and email links depending on url---------*/
$(function() {
    
	var indexOfProfiles = window.location.search.indexOf("profiles");
	var indexOfDatahub = window.location.search.indexOf("ridatahub");

	var profilesHeader = $('#profiles-header');
	var datahubHeader = $('#datahub-header');

	var profilesEmail = $('.profiles-email');
	var datahubEmail = $('.datahub-email');

	var profilesLogo = $('#tpp-logo');
	var datahubLogo = $('#dataHub-logo');

	if(indexOfProfiles != -1){
		//add profiles specs
		profilesHeader.show();
		profilesEmail.css("display", "block");
		profilesLogo.show();
	}
	else if(indexOfDatahub != -1){
		//add data hub specs.
		datahubHeader.show();
		datahubEmail.css("display", "block");
		datahubLogo.show();
	}
});


/*----------click Events------------------------------------------*/
$('#submit-btn').mouseover(function(){
	$(this).addClass('btn-lite');
});

$('#submit-btn').mouseout(function(){
	$(this).removeClass('btn-lite');
});

$("#name-inp, #email-inp, #content-inp").mouseover(function(){
	$(this).addClass('inp-lite');
});

$("#name-inp, #email-inp, #content-inp").mouseout(function(){
	$(this).removeClass('inp-lite');
});

$("#tpp-img").click(function(){
	window.open("http://provplan.org/index.php/");
});

$("#dataHub-img").click(function(){
	window.open("http://ridatahub.org/");
});

$('#followup-input').click(function(){
	if($('#followup-input').is(':checked')){
		$('#email-is-optional').hide();
		$('#email-is-required').show();
		console.log("checked");
	}
	else{
		$('#email-is-optional').show();
		$('#email-is-required').hide();
	}
});

/*---------------------------------------------------------------*/



/*-----When new topic is selected (from dropdown)----------------*/

$('#issue').change(function(){
	var selectedVal = $('#issue').val();
	var contentBox = $("#content-inp");
	var option_text = {
					   "opt1" : "Please be as clear and precise as possible about the bug you encountered. Helpful information includes: Brief summary of the problem, steps needed to reproduce the problem, what you expected to happen, what happened instead, etc. ",
					   "opt2" : "Please provide a summary of the data you would like to see added to the website. Helpful information includes: Source for the original data.",
					   "opt3" : "Please describe the inaccuracy you encountered. Helpful information includes: Which piece of information on the webpage was inaccurate, why you believe the information to be inaccurate, etc.",
					   "opt4" : "Your feedback helps us make a better product. Please be as clear and precise as possible about the feature/enhancement you would like to see added. Helpful information includes: Brief summary of feature, how would you like the feature to work, why the feature is important to your work, etc.",
					   "opt5" : "Please describe the issue you are encountering with a login or password. DO NOT include private information in this request and NEVER include your password.",
					   "opt6" : "Please provide a clear and precise summary of the technical support you would like to receive.",
					   "opt7" : "If you have a general question or comment please describe that here.",
					   "opt8" : "If your feedback or concern does not fit into one of the existing topics please provide your comment here."
					  }

	for(var key in option_text){
		var val = option_text[key];
		if (selectedVal == key){
			contentBox.attr("placeholder", val)
		}
	}
});
/*---------------------------------------------------------------*/



/*-----form submission/validations-------------------------------*/
$("#issue-form").submit(function(e){
	e.preventDefault();

	var content = $.trim($('#content-inp').val());
	var email_input = $.trim($('#email-inp').val());
	var followup_input = $('#followup-input');
	var sendcopy_input = $('#sendcopy-input');
	var selected_issue = $('#issue');

	// set user agent info to be sent in POST request
	$("#user-agent-input").val(navigator.userAgent);

	if(selected_issue.val() == "select-one"){
		displaySelectError();

	}else{// continue processing form...
		 
		/*a*/if(content.length > 0){
				// check for content
				
			/*b*/if(validateEmail(email_input) == true || email_input == ""){
					//check that email is valid
					
				/*c*/if(followup_input.is(':checked')){
						//check that followup is selected						
					/*d*/if(email_input.length > 0){
							//check that the email is entered
							
						/*e*/if(validateEmail(email_input) == true){
								//make sure email is valid again
								sendForm(this);

						}/*e*/else{
								displayInvalidEmailError();
						}

					}/*d*/else{
							displayInvalidEmailError();
					}

				}/*c*/else{
						sendForm(this);
				}
			}/*b*/else{
					displayInvalidEmailError();
			}
		}/*a*/else{
				displayContentError();
		}
	}

});
/*---------------------------------------------------------------*/


/*---------Utility Functions-------------------------------------*/
function validateEmail(email){
	var emailFilter = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return emailFilter.test(email);
}


function displaySelectError(){
	var iss_err = $("#issue-error");
	iss_err.show();

	$('#issue').change(function(){
		iss_err.hide();
	})
}


function displayInvalidEmailError(){
	var inval_email = $("#inval-email");
	inval_email.show();

	$('#email-inp').click(function(){
		inval_email.hide();
	})
}


function displayContentError(){
	var content_err = $("#content-err");
	content_err.show();

	$('#content-inp').click(function(){
		content_err.hide();
	})
}

function sendForm(form){
	$.ajax({
			method: 'POST',
			url:"/submit",
			data: $(form).serialize(),
			dataType:"json",
			success: function(data) {
				displayStatusToUser(data.status);
		    },
		    error:function(jqXHR, textStatus, errorThrown){
		    },
		    statusCode: {
		    	404: function(){
		
		    		displayStatusToUser(400);
		    	},//end 404
		    	500: function(){
		
		    		displayStatusToUser(500);
		    	}//end 500
		    }//end status code
		})
}

function displayStatusToUser(status){
	var messageBox = $("#message-box");
	var successMess = $("#success-message");
	var errorMess = $("#error-message"); 
	var statusMess = $("#status-message");
	var formContainer = $('#form-cont');
	var terms = $("#terms-and-cond");

	var errText = "We apologize for the inconvienvce.";

	formContainer.remove();
	terms.remove();
	messageBox.show();

	switch(status)
	{
		case "success":
			successMess.show();
			break;
		case "error":
			errorMess.show();
			statusMess.append("We did not recieve your submission. " + errText);
			break;
		case 404:
			errorMess.show();
			statusMess.append("404 Not Found. We are not able to locate this page at this time. " + errText);
		case 500:
			errorMess.show();
			statusMess.append("500 Internal Server Error. Our server has encountered a problem. " + errText);
		default:
			errorMess.show();
			statusMess.append("We have encountered a problem processing your request. " + errText);
	}
}


/*-----End Utility Functions--------------------------------*/
