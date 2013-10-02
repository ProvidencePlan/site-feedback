from flask import Flask, render_template, request
app = Flask(__name__)

import time
from datetime import datetime
import psycopg2
import json

@app.route("/") # listens at this url 
def get_template():
	test = ''
	return render_template('base.html')

@app.route("/submit", methods=["POST"])#request handler
def process_form():
	issue_type = str(request.form.get("issue-option"))
	username = str(request.form.get("user-name"))
	email = str(request.form.get("user-email"))
	content = str(request.form.get("issue-content"))
	follow_up_response = request.form.get("follow-up")

	follow_up = False

	if follow_up_response == 'none':
		follow_up = False
	elif follow_up_response == 'on':
		follow_up = True


	if username.strip() == '':
		username = 'Anonymous'

	if email.strip() == '':
		email = 'Not provided'

	try:
		add_record(issue_type, username, email, content, follow_up)
		return json.dumps({'status':'success'})

	except Exeception as e:

		return json.dumps({'status':'error'})

def add_record(issue_type, name, email, content, follow_up):

	#make connection to database
	connection = psycopg2.connect("dbname= tpp-site-feedback user= 'zcrosby' host= 'localhost'")

	#create cursor (allows interaction with db)
	cursor = connection.cursor()

	#store values in db
	info = (str(issue_type), str(name), str(email), str(content), follow_up)

	query = "INSERT INTO issue (issue_type, user_name, user_email, content, follow_up) VALUES (%s, %s, %s, %s, %s)"

	cursor.execute(query, info)

	#solidify changes to the db
	connection.commit()

	#Always close communication with db
	cursor.close()
	connection.close()

	return True



if __name__ == "__main__":
    app.run(debug=True)

   
















