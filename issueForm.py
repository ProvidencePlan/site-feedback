from flask import Flask, render_template, request
app = Flask(__name__)
app.config.from_object('settings')

from time import gmtime, strftime
from datetime import datetime
import psycopg2
import json
from provplan_email_lib import *
from collections import OrderedDict

@app.route("/") # listens at this url
def get_template():
	topics = app.config['TOPICS']

	topic_key_list = topics.keys()
	topic_key_list.sort()
	sorted_topics = OrderedDict()
	for key in topic_key_list:
		sorted_topics[key] = topics[key]

	return render_template('base.html', referer=request.args.get('s'), topics = sorted_topics)

@app.route("/submit", methods=["POST"])#request handler
def process_form():
	#hidden inputs. values collected with js
	url = str(request.form.get("ref"))
	user_agent = str(request.form.get("user-agent"))

	#values entered by user
	issue_type = str(request.form.get("issue-option"))
	username = str(request.form.get("user-name"))
	email = str(request.form.get("user-email"))
	content = str(request.form.get("issue-content")) 
	follow_up_response = request.form.get("follow-up")
	send_copy_response = request.form.get("send-copy")

	follow_up = 'no'
	send_copy = 'no'

	if follow_up_response == 'none':
		follow_up = 'no'
	elif follow_up_response == 'on':
		follow_up = 'yes'

	if send_copy_response == 'none':
		send_copy = 'no'
	elif send_copy_response == 'on':
		send_copy = 'yes'


	if username.strip() == '':
		username = 'Anonymous'

	if email.strip() == '':
		email = 'Not provided'

	topics_dict = app.config['TOPICS']
	issue = topics_dict.get(issue_type)

	try:

		add_record(url, issue, username, email, content, follow_up, send_copy, user_agent)
		send_mail(url, issue, username, email, content, follow_up,  send_copy, user_agent)

		return json.dumps({'status':'success'})

	except Exception as e:
		return json.dumps({'status':'error'})

def add_record(url, issue, name, email, content, follow_up, send_copy, user_agent):

	#make connection to database
	connection = psycopg2.connect(app.config['DB_CONNECT_STR'])

	#create cursor (controls interaction with db)
	cursor = connection.cursor()

	#store values in db
	cursor.execute("""INSERT INTO issue (url, issue_type, user_name, user_email, content, follow_up, send_copy, user_agent) 
	         		  VALUES (%(url)s, %(issue)s, %(name)s, %(email)s, %(content)s, %(follow_up)s, %(send_copy)s, %(user_agent)s)""", {
	         'url': str(url),
	         'issue': str(issue),
	         'name': str(name),
	         'email':  str(email),
	         'content': str(content),
	         'follow_up': follow_up,
	         'send_copy': send_copy,
	         'user_agent': str(user_agent)
	         })
	
	#commit changes to the db
	connection.commit()
	#Always close communication with db

	cursor.close()
	connection.close()

	return True

def send_mail(url, issue, username, useremail, content, follow_up, send_copy, user_agent):
    smtp_server = app.config['SMTP_SERVER']
    smtp_port = app.config['SMTP_PORT']
    smtp_user = app.config['SMTP_USER']
    smtp_password = app.config['SMTP_PASS']

    curr_date = strftime("%a, %d %b %Y %X +0000", gmtime())

    #Format message content
    from_addr = app.config['FROM_ADDRESS']
    message = """
    Date: {0}\n
    Submitted from: {1}\n
    Topic: {2}\n
    Name(optional): {3}\n
    Email(optional): {4}\n
    Content: {5}\n
    Follow up: {6}\n
    Send an email of copy to user: {7}\n
    UserAgent: {8}
    """.format(curr_date, url, issue, username, useremail, content, follow_up, send_copy, user_agent)
 
    e = Emailer(None, smtp_server, smtp_port, smtp_user, smtp_password)

    if 'profiles' in url:
        addresses = app.config['PROFILES_ADDRESS']
        subject = "Feedback - Community Profiles"
        for a in addresses:
        	e.send_email(to_addresses=a, subject=subject, body=message, from_address=from_addr)
    elif 'ridatahub' in url:
        addresses = app.config['RIDATAHUB_ADDRESS']
        subject = "Feedback - RI DataHub"
        for a in addresses:
        	e.send_email(to_addresses=a, subject=subject, body=message, from_address=from_addr)

    if send_copy == "yes":
    	message = """
	    Here is a copy of your feedback message.\n
		Submitted from: {0}\n
		Topic: {1}\n
		Your name: {2}\n
		Email: {3}\n
		Message: {4}\n
		Date: {5}\n
		You should recieve a response within 2-3 business days, thank you.
		""".format(subject, issue, username, useremail, content, curr_date)
    	e.send_email(to_addresses=useremail, subject=subject, body=message, from_address=from_addr)

    e.disconnect()

if __name__ == "__main__":
    app.run(debug=app.config['DEBUG'], host="0.0.0.0")


















