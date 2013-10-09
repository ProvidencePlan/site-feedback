site-feedback
=============
Embed a feedback form into a webapp.


Usage:
=============
Requires Flask, postgres... See requirements.txt

1. Deploy Flask application.
2. Run the included schema file ``` issueTable.sql ```
3. Add ```embedFeedback.js``` to site and create ```FEEDBACK_FORM_URL``` var in your page with the url to the deployed Feedback app.

EX:

```
	<script>FEEDBACK_FORM_URL="http://10.1.1.155:5000"</script>
 	<script src="embedFeedback.js"></script>
```

4.You will need to create a dom element with the id ```site-feedback```. This will enable the feedback form to open in a lightbox.
5. Within ```settings.py``` you will need to add your specs to the database info.
6. In the same file adjust the ```TOPICS``` to populate the forms topic options with your own options.

EX:

```
	TOPICS = (
		("value submited to DB", "topic user will select"),
		("...","..."),
	)
```
...see ```settings.py.example```. Make sure to remove ```.example``` from file name when deploying.

