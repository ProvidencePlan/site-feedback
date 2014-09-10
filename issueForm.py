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
	send_copy = False

	follow_up = 'no'
	if follow_up_response == 'none':
		follow_up = 'no'
	elif follow_up_response == 'on':
		follow_up = 'yes'

	if username.strip() == '':
		username = 'Anonymous'

	if email.strip() == '':
		email = 'Not provided'

	topics_dict = app.config['TOPICS']
	issue = topics_dict.get(issue_type)

	try:

		add_record(url, issue, username, email, content, follow_up, send_copy, user_agent)
		send_mail(url, issue, username, email, content, follow_up, user_agent)

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

def send_mail(url, issue, username, useremail, content, follow_up, user_agent):
    smtp_server = app.config['SMTP_SERVER']
    smtp_port = app.config['SMTP_PORT']

    curr_date = strftime("%a, %d %b %Y %X +0000", gmtime())

    #Format message content
    from_addr = ''
    message = """
    Date: {0}\n
    Submitted from: {1}\n
    Topic: {2}\n
    Name(optional): {3}\n
    Email: {4}\n
    Content: {5}\n
    Follow up: {6}\n
    UserAgent: {7}
    """.format(curr_date, url, issue, username, useremail, content, follow_up, user_agent)
 
    if 'profiles' in url:
        e = Emailer(None, smtp_server, smtp_port, app.config['PROFILES_SMTP_USER'], app.config['PROFILES_SMTP_PASS'])
        to_addr = app.config['PROFILES_ADDRESS']
        from_addr = 'RI Community Profiles <do-not-reply@profiles.provplan.org>'
        subject = "Feedback - RI Community Profiles"
        for a in to_addr:
        	e.send_email(to_addresses=a, subject=subject, body=message, from_address=from_addr)
    elif 'ridatahub' in url:
        e = Emailer(None, smtp_server, smtp_port, app.config['RIDATAHUB_SMTP_USER'], app.config['RIDATAHUB_SMTP_PASS'])
        to_addr = app.config['RIDATAHUB_ADDRESS']
        from_addr = 'RI Datahub <do-not-reply@ridatahub.org>'
        subject = "Feedback - RI DataHub"
        for a in to_addr:
        	e.send_email(to_addresses=a, subject=subject, body=message, from_address=from_addr)

    if follow_up == "yes":
    	message = """
    	We have received your feedback submission.\n
		Submitted from: {0}\n
		You should recieve a response within 2-3 business days, thank you.\n
		If you have received this message in error, please disregard.
		""".format(subject)
    	e.send_email(to_addresses=useremail, subject=subject, body=message, from_address=from_addr)

    e.disconnect()

if __name__ == "__main__":
    app.run(debug=app.config['DEBUG'], host="0.0.0.0")


















