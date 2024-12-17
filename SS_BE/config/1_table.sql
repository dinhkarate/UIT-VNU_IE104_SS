create table centres (
	centre_id varchar(5) primary key,
	address varchar(100),
	description varchar,
	coop boolean
);

create table fields (
	field_id varchar(5) primary key,
	field_name varchar(50),
	sport_type varchar(50),
	price_per_hour decimal(10,2),
	centre_id varchar(5),
	field_type varchar,
	open_time time,
	close_time time,
	link_img text
);

alter table fields
add foreign key (centre_id) references centres(centre_id);

create table service_list (
	service_id varchar(5) primary key,
	service_name varchar
);

create table centre_service (
	centre_id varchar,
	service_id varchar,
	primary key (centre_id, service_id)
);

alter table centre_service
add foreign key (centre_id) references centres(centre_id);
alter table centre_service
add foreign key (service_id) references service_list(service_id);

create table admins (
	admin_id varchar(5) primary key ,
	first_name varchar(50),
	last_name varchar(50),
	username varchar(50),
	password varchar(255),
	phone varchar(50),
	email varchar(50),
	centre_id varchar(5)
);

alter table admins
add foreign key (centre_id) references centres(centre_id);

create table customers (
	cust_id serial primary key,
	first_name varchar(50),
	last_name varchar(50),
	username varchar(50),
	password varchar(255),
	phone varchar(50),
	email varchar(50),
	signup_date date
);

create table favourite_field (
	cust_id integer,
	field_id varchar(5),
	primary key (cust_id, field_id)
);

alter table favourite_field 
add foreign key (cust_id) references customers(cust_id);
alter table favourite_field 
add foreign key (field_id) references fields(field_id);

create table feedbacks (
	feedback_id serial primary key,
	star int,
	created_at timestamp,
	description text,
	field_id varchar(5),
	cust_id integer
);

alter table feedbacks
add foreign key (field_id) references fields(field_id);
alter table feedbacks
add foreign key (cust_id) references customers(cust_id);

create type tournament_status as enum (
    'Upcoming',
    'InProgress',
    'Concluded'
);

create table tournament (
	tournament_id varchar(5) primary key,
	tournament_name varchar(50),
	description text,
	fee decimal(10,2),
	link_img text,
	centre_id varchar(5),
	tourn_status tournament_status,
	organizer varchar,
	contact varchar
);

create table tourn_comment (
	tourn_cmt_id varchar primary key,
	cust_id integer,
	tournament_id varchar,
	comment text
);

alter table tourn_comment
add foreign key (tournament_id) references tournament(tournament_id);
alter table tourn_comment
add foreign key (cust_id) references customers(cust_id);

create table teams (
	tournament_id varchar,
	leader_id integer,
	team_name varchar,
	primary key (tournament_id, leader_id)
);

alter table teams
add foreign key (tournament_id) references tournament(tournament_id);
alter table teams
add foreign key (leader_id) references customers(cust_id);

create table members (
	member_id varchar(5) primary key,
	first_name varchar(50),
	last_name varchar(50),
	leader_id integer
);

alter table members
add foreign key (leader_id) references customers(cust_id);

create type status as enum (
    'canceled',
    'pending',
    'confirmed'
);

create table reservation (
    resrv_id serial primary key,
    time_begin time,
    time_end time,
    resrv_date date,
    renting_price decimal(10,2),
    created_date timestamp, 
    field_id varchar(5),
    cust_id integer,
    resrv_status status
);

alter table reservation
add foreign key (field_id) references fields(field_id);
alter table reservation
add foreign key (cust_id) references customers(cust_id);

create table payment (
	payment_id serial primary key,
	payment_date timestamp,
	pay_method varchar(50),
	total_price decimal(10,2),
	resrv_id integer,
	admin_id varchar(5)
);

alter table payment
add foreign key (resrv_id) references reservation(resrv_id);