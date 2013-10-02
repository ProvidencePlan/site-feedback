DROP TABLE IF EXISTS issue;

CREATE TABLE issue (
	issue_id 		serial CONSTRAINT firstkey PRIMARY KEY,
	time_stamp 		timestamp default current_timestamp,
	site 			varchar(40),
	url 			text,
	issue_type		varchar(20),
	user_name 		varchar(40),
	user_email 		varchar(40),
	content			text,
	follow_up		boolean,
	issue_addressed boolean
);