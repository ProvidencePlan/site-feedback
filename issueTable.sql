DROP TABLE IF EXISTS issue;

CREATE TABLE issue (
	issue_id 		serial CONSTRAINT firstkey PRIMARY KEY,
	time_stamp 		timestamp default current_timestamp,
	url 			text,
	issue_type		varchar(200),
	user_name 		varchar(150),
	user_email 		varchar(150),
	content			text,
	follow_up		boolean,
	send_copy		boolean, 
	user_agent		text,
	issue_addressed boolean
);