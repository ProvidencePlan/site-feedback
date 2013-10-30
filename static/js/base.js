$(function() {
    
	var indexOfProfiles = window.location.search.indexOf("profiles");
	var indexOfDatahub = window.location.search.indexOf("ridatahub");

	var profilesHeader = $('#profiles-header');
	var datahubHeader = $('#datahub-header');

	var profilesEmail = $('#profiles-email');
	var datahubEmail = $('#datahub-email');

	if(indexOfProfiles != -1){
		//add profiles specs
		profilesHeader.show();
		profilesEmail.show();
	}
	else if(indexOfDatahub != -1){
		//add data hub specs.
		datahubHeader.show();
		datahubEmail.show();
	}


});


/*----------click Events----------------*/
$('#submit-btn').mouseover(function(){
	$(this).addClass('btn-lite');
})

$('#submit-btn').mouseout(function(){
	$(this).removeClass('btn-lite');
})

$("#name-inp, #email-inp, #content-inp").mouseover(function(){
	$(this).addClass('inp-lite');
})

$("#name-inp, #email-inp, #content-inp").mouseout(function(){
	$(this).removeClass('inp-lite');
})

$("#tpp-img").click(function(){
	window.open("http://provplan.org/index.php/");
})
/*---------------------------------------*/



/*-----When new topic is selected--------*/

$('#issue').change(function(){
	var selectedVal = $('#issue').val();
	var contentBox = $("#content-inp");

	if(selectedVal == "opt1"){
		contentBox.attr("placeholder", "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt")
	}
	else if(selectedVal == "opt2"){
		contentBox.attr("placeholder", "consectetur adipisicing elit, Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt")
	}
	else if(selectedVal == "opt3"){
		contentBox.attr("placeholder", "dipisicing elit, sed do eiusmodlit, sed do eiusmod tempor incididunt")
	}
	else if(selectedVal == "opt4"){
		contentBox.attr("placeholder", "sed do eiusmod tempor incididunt dipisicing elit, sed do eiusmodlit, sed do eiusmod tempor incididunt")
	}
})
/*---------------------------------------*/



/*-----form submission/validations-------*/
$("#issue-form").submit(function(e){
	e.preventDefault();

	var content = $.trim($('#content-inp').val());
	var email_input = $.trim($('#email-inp').val());
	var followup_input = $('#followup-input');
	var sendcopy_input = $('#sendcopy-input');
	var iss_select = $('#issue');

	if(iss_select.val() == "select-one"){
		displaySelectError();

	}else{// continue processing form...

			 
		/*a*/if(content.length > 0){
				// check for content
				
			/*b*/if(validateEmail(email_input) == true || email_input == ""){
					//check that email is valid
					
				/*c*/if(followup_input.is(':checked')  || sendcopy_input.is(":checked")){
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
/*----------------------------------------*/


/*---------Utility Functions--------------*/
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
				if(data.status == "success"){
					status = "success";
					displayStatusToUser(status);	
				}
				else if(data.status == "error"){
					status = "error";
					displayStatusToUser(status);
				}
		    },
		    error:function(jqXHR, textStatus, errorThrown){
		    },
		    statusCode: {
		    	404: function(){
		    		status = 404;
		    		displayStatusToUser(status);
		    	},//end 404
		    	500: function(){
		    		status = 500;
		    		displayStatusToUser(status);
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

	var errText = "We apologize for the inconvienvce.";

	formContainer.children().remove();
	messageBox.show();

	if(status == "success"){
		successMess.show();
	}
	else if(status == "error"){
		errorMess.show();
		statusMess.append("We did not recieve your submission. " + errText);
	}
	else if(status == 404){
		errorMess.show();
		statusMess.append("404 Not Found. We are not able to locate this page at this time. " + errText);
	}
	else if(status == 500){
		errorMess.show();
		statusMess.append("500 Internal Server Error. Our server has encountered a problem. " + errText);
	}
	else{
		errorMess.show();
		statusMess.append("We have encountered a problem processing your request. " + errText);
	}
}


/*-----End Utility Functions--------------------------------*/
