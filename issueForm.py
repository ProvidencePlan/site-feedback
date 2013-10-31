from flask import Flask, render_template, request
app = Flask(__name__)
app.config.from_object('settings')

import time
from datetime import datetime
import psycopg2
import json
from provplan_email_lib import *

@app.route("/") # listens at this url
def get_template():
	topic_options = app.config['TOPICS']
	return render_template('base.html', referer=request.args.get('s'), topics = topic_options)

@app.route("/submit", methods=["POST"])#request handler
def process_form():
	url = str(request.form.get("ref"))
	issue_type = str(request.form.get("issue-option"))
	username = str(request.form.get("user-name"))
	email = str(request.form.get("user-email"))
	content = str(request.form.get("issue-content"))
	follow_up_response = request.form.get("follow-up")
	send_copy_response = request.form.get("send-copy")

	follow_up = False
	send_copy = False

	if follow_up_response == 'none':
		follow_up = False
	elif follow_up_response == 'on':
		follow_up = True

	if send_copy_response == 'none':
		send_copy = False
	elif send_copy_response == 'on':
		send_copy = True


	if username.strip() == '':
		username = 'Anonymous'

	if email.strip() == '':
		email = 'Not provided'

	try:

		add_record(url, issue_type, username, email, content, follow_up, send_copy)
		send_mail(url, issue_type, username, email, content, follow_up)

		return json.dumps({'status':'success'})

	except Exception as e:
		print e
		return json.dumps({'status':'error'})

def add_record(url, issue_type, name, email, content, follow_up, send_copy):

	#make connection to database
	connection = psycopg2.connect(app.config['DB_CONNECT_STR'])

	#create cursor (allows interaction with db)
	cursor = connection.cursor()

	#store values in db
	info = (str(url), str(issue_type), str(name), str(email), str(content), follow_up, send_copy)

	query = "INSERT INTO issue (url, issue_type, user_name, user_email, content, follow_up, send_copy) VALUES (%s, %s, %s, %s, %s, %s, %s)"
	cursor.execute(query, info)

	#solidify changes to the db
	connection.commit()

	#Always close communication with db
	cursor.close()
	connection.close()

	return True

def send_mail(url, issue_type, username, email, content, follow_up):
    smtp_server = app.config['SMTP_SERVER']
    smtp_port = app.config['SMTP_PORT']
    smtp_user = app.config['SMTP_USER']
    smtp_password = app.config['SMTP_PASS']
    addresses = app.config['ADDRESSES']
    from_addr = app.config['FROM_ADDRESS']
    message = """
        Submitted from: {0}\n
        Issue Type: {1}\n
        Username(optional): {2}\n
        Email(optional):{3}\n
        Content: {4}\n
        Follow up: {5}
    """.format(url, issue_type, username, email, content, follow_up)

    e = Emailer(None, smtp_server, smtp_port, smtp_user, smtp_password)
    e.send_email(to_addresses=addresses, subject="Feedback Form", body=message, from_address=from_addr)
    e.disconnect()

if __name__ == "__main__":
    app.run(debug=app.config['DEBUG'], host="0.0.0.0")


















