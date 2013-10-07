
/*------------form effects-------------*/
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
/*----------------------------------------*/



/*-----form submission requirements-------*/
$("#issue-form").submit(function(e){
	e.preventDefault();

	var iss_select = $('#issue');
	var content = $.trim($('#content-inp').val());
	var followup_input = $('#followup-input');
	var email_input = $.trim($('#email-inp').val());
	


	if(iss_select.val() == "select-one"){
		displaySelectError();

	}else{// continue processing form...

		// check for content 
		if(content.length > 0){
			//check that email is valid
			if(validateEmail(email_input) == true || email_input == ""){

				//check that followup is selected
				if(followup_input.is(':checked')){

					//check that the email is entered
					if(email_input.length > 0){

						//make sure email is valid
						if(validateEmail(email_input) == true){
							sendForm(this);

						}else{
							displayInvalidEmailError();
						}

					}else{
						displayInvalidEmailError();
					}

				}else{
					sendForm(this);
				}
			}else{
				displayInvalidEmailError();
			}
		}else{
			displayContentError();
		}
	}

});
/*----------------------------------------*/


/*---------Utility Functions--------------*/
function sendForm(form){
	$.ajax({
			method: 'POST',
			url:"/submit",
			data: $(form).serialize(),
			dataType:"json",
			success: function(data) {
				if(data.status == "success"){
					$('#form-cont').children().remove();

					var container = document.getElementById("container");
					var confirmBox = document.getElementById("confirm-box");

					//container.style.border = "2px solid #38C91F";
					confirmBox.style.display = "block";

				}
		    },
		    error:function(jqXHR, textStatus, errorThrown){
		    	console.log(jqXHR, textStatus, errorThrown)

		    },
		})
}


function validateEmail(email){
	var emailFilter = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return emailFilter.test(email);
}


function displaySelectError(){
	var iss_err = document.getElementById("issue-error");
	iss_err.style.display = 'inline';

	$('#issue').change(function(){
		iss_err.style.display = 'none';
	})
}


function displayInvalidEmailError(){
	var inval_email = document.getElementById("inval-email");
	inval_email.style.display = 'inline';

	$('#email-inp').click(function(){
		inval_email.style.display = 'none';
	})
}


function displayContentError(){
	var content_err = document.getElementById("content-err");
	content_err.style.display = 'inline';

	$('#content-inp').click(function(){
		content_err.style.display = 'none';
	})
}
/*----------------------------------------*/
