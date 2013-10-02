
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
	if(iss_select.val() == "select-one"){

		var iss_err = document.getElementById("issue-error");
		iss_err.style.display = 'inline';

		iss_select.change(function(){
			iss_err.style.display = 'none';
		})
	}
	else{
		$.ajax({
			method: 'POST',
			url:"/submit",
			data: $(this).serialize(),
			dataType:"json",
			success: function(data) {
				if(data.status == "success"){
					$('#form-cont').children().remove();

					var container = document.getElementById("container");
					var confirmBox = document.getElementById("confirm-box");

					container.style.border = "2px solid #38C91F";
					confirmBox.style.display = "block";

				}
		    },
		    error:function(jqXHR, textStatus, errorThrown){
		    	console.log(jqXHR, textStatus, errorThrown)

		    },
		})
	}
});
/*----------------------------------------*/

/*
	[+'data' can be named anything. 
		-it holds the value of whatever information is retrieved from the server.

	+AJAX simply establishes a hidden connection between the server and the client
		-it may return a 200 status (ok) or 404 status(not found)
		-
		*/