site-feedback
=============
Embed a basic feedback form into a webapp.


Usage:
=============
Requires Flask, postgres... See requirements.txt

1. Deploy Flask application. 
2. If application is used outside of ProvPlan, disregard other recipients section in settings.
3. If application is used outside of ProvPlan, include your own email library. ...see ```issueForm.py.example```
2. Run the included schema file ``` issueTable.sql ``` 
3. Add ```embedFeedback.js``` to site and create ```FEEDBACK_FORM_URL``` var in your page with the url to the deployed Feedback app.

EX:

```
	<script>FEEDBACK_FORM_URL="http://0.0.0.0:5000"</script>
 	<script src="embedFeedback.js"></script>
```

4.You will need to create a dom element with the id ```site-feedback```. This will enable the feedback form to open in a lightbox.
	*EX: ```<a href="#" id="site-feedback"><span>Send us Feedback</span></a>``` 
	*EX: ```<a href="#" id="site-feedback"><img src="static/images/feedbackBtn.png" alt="feedback"></a>```

5. Within ```settings.py``` you will need to add your specs to the database info.
6. In the same file adjust the ```TOPICS``` to populate the forms topic options with your own options.

EX:

```
	TOPICS = (
		("reference value for base.html", "option value in select tag"),
		("...","..."),
	)
```
7. Set SMTP settings for email notifications to be sent to your email address. or configure settings file to work with your emailing library.

...see ```settings.py.example```. Make sure to remove ```.example``` from file name for production.

