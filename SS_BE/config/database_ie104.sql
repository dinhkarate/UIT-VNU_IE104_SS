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
	feedback_id varchar(5) primary key,
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

INSERT INTO centres (centre_id, address, description, coop) VALUES
('C01', '123 Nguyễn Văn Linh, Quận 7, TP. HCM', 'Trung tâm thể thao hiện đại với nhiều sân bóng đá', TRUE),
('C02', '456 Lê Văn Việt, Quận 9, TP. HCM', 'Trung tâm với các sân thể thao tiêu chuẩn quốc tế', TRUE),
('C03', '789 Điện Biên Phủ, Quận Bình Thạnh, TP. HCM', 'Địa điểm lý tưởng cho các hoạt động thể thao đa dạng', TRUE),
('C04', '12 Cầu Giấy, Quận Cầu Giấy, Hà Nội', 'Trung tâm cung cấp dịch vụ thể thao ngoài trời chất lượng cao', TRUE),
('C05', '34 Hoàn Kiếm, Quận Hoàn Kiếm, Hà Nội', 'Trung tâm có các sân trong nhà và ngoài trời', TRUE);

--Fields
INSERT INTO fields (field_id, field_name, sport_type, price_per_hour, centre_id, field_type, open_time, close_time) VALUES
('BD001', 'Sân Bóng Đá A', 'Bóng đá', 150000, 'C01', 'Sân 5', '06:00:00', '22:00:00'),
('BD002', 'Sân Bóng Đá B', 'Bóng đá', 200000, 'C02', 'Sân 7', '06:00:00', '22:00:00'),
('BD003', 'Sân Bóng Đá C', 'Bóng đá', 300000, 'C03', 'Sân 11', '06:00:00', '22:00:00'),
('BC001', 'Sân Bóng Chuyền A', 'Bóng chuyền', 100000, 'C01', 'Trong nhà', '06:00:00', '22:00:00'),
('BC002', 'Sân Bóng Chuyền B', 'Bóng chuyền', 120000, 'C04', 'Ngoài trời', '06:00:00', '22:00:00'),
('BR001', 'Sân Bóng Rổ A', 'Bóng rổ', 250000, 'C02', 'Trong nhà', '06:00:00', '22:00:00'),
('PK001', 'Sân Pickleball A', 'Pickleball', 80000, 'C05', 'Ngoài trời', '06:00:00', '22:00:00'),
('CL001', 'Sân Cầu Lông A', 'Cầu lông', 70000, 'C03', 'Trong nhà', '06:00:00', '22:00:00'),
('TN001', 'Sân Tennis A', 'Tennis', 180000, 'C01', 'Ngoài trời', '06:00:00', '22:00:00'),
('TN002', 'Sân Tennis B', 'Tennis', 200000, 'C05', 'Trong nhà', '06:00:00', '22:00:00');

INSERT INTO fields (field_id, field_name, sport_type, price_per_hour, centre_id, field_type, open_time, close_time) VALUES
('BD004', 'Sân Bóng Đá D', 'Bóng đá', 250000, 'C02', 'Sân 7', '06:00:00', '22:00:00'),
('BD005', 'Sân Bóng Đá E', 'Bóng đá', 350000, 'C04', 'Sân 11', '06:00:00', '22:00:00'),
('BC003', 'Sân Bóng Chuyền C', 'Bóng chuyền', 95000, 'C05', 'Trong nhà', '06:00:00', '22:00:00'),
('BC004', 'Sân Bóng Chuyền D', 'Bóng chuyền', 110000, 'C03', 'Ngoài trời', '06:00:00', '22:00:00'),
('BR002', 'Sân Bóng Rổ B', 'Bóng rổ', 270000, 'C01', 'Ngoài trời', '06:00:00', '22:00:00'),
('PK002', 'Sân Pickleball B', 'Pickleball', 85000, 'C02', 'Ngoài trời', '06:00:00', '22:00:00'),
('CL002', 'Sân Cầu Lông B', 'Cầu lông', 75000, 'C04', 'Trong nhà', '06:00:00', '22:00:00'),
('CL003', 'Sân Cầu Lông C', 'Cầu lông', 80000, 'C05', 'Ngoài trời', '06:00:00', '22:00:00'),
('TN003', 'Sân Tennis C', 'Tennis', 210000, 'C03', 'Ngoài trời', '06:00:00', '22:00:00'),
('TN004', 'Sân Tennis D', 'Tennis', 230000, 'C02', 'Trong nhà', '06:00:00', '22:00:00');

--service_list
insert into Service_List values ('SVC01', 'Wifi'),
								('SVC02', 'Phòng tắm'),
								('SVC03', 'Bãi đỗ ô tô'),
								('SVC04', 'Cafe'),
								('SVC05','Thuê trọng tài');
insert into Service_List values ('SVC06', 'Cho thuê vợt'),
								('SVC07', 'Cho thuê giày'),
								('SVC08', 'Đặt áo đấu'),
								('SVC09', 'Hệ thống chiếu sáng'),
								('SVC10','Cho thuê áo tập');
insert into Service_List values ('SVC11', 'Phòng thay đồ'),
								('SVC12', 'Tổ chức giải đấu'),
								('SVC13', 'Bãi giữ xe miễn phí');
--centre_service
insert into Centre_Service (centre_id, service_id) values ('C01', 'SVC01'),
														('C01', 'SVC02'),
														('C01', 'SVC03'),
														('C01', 'SVC04'),
														('C01', 'SVC05'),
														('C01', 'SVC06'),
														('C01', 'SVC07'),
														('C01', 'SVC08'),
														('C01', 'SVC09'),
														('C01', 'SVC10'),
														('C01', 'SVC11'),
														('C01', 'SVC12'),
														('C01', 'SVC13');

insert into Centre_Service (centre_id, service_id) values ('C02', 'SVC01'),
														('C02', 'SVC02'),
														('C02', 'SVC03'),
														('C02', 'SVC04'),
														('C02', 'SVC05'),
														('C02', 'SVC06'),
														('C02', 'SVC07'),
														('C02', 'SVC08'),
														('C02', 'SVC09'),
														('C02', 'SVC10'),
														('C02', 'SVC11'),
														('C02', 'SVC12'),
														('C02', 'SVC13');

insert into Centre_Service (centre_id, service_id) values ('C03', 'SVC01'),
														('C03', 'SVC02'),
														('C03', 'SVC03'),
														('C03', 'SVC04'),
														('C03', 'SVC05'),
														('C03', 'SVC06'),
														('C03', 'SVC07'),
														('C03', 'SVC08'),
														('C03', 'SVC09'),
														('C03', 'SVC10'),
														('C03', 'SVC11'),
														('C03', 'SVC12'),
														('C03', 'SVC13');

insert into Centre_Service (centre_id, service_id) values ('C04', 'SVC01'),
														('C04', 'SVC02'),
														('C04', 'SVC03'),
														('C04', 'SVC04'),
														('C04', 'SVC05'),
														('C04', 'SVC06'),
														('C04', 'SVC07'),
														('C04', 'SVC08'),
														('C04', 'SVC09'),
														('C04', 'SVC10'),
														('C04', 'SVC11'),
														('C04', 'SVC12'),
														('C04', 'SVC13');

insert into Centre_Service (centre_id, service_id) values ('C05', 'SVC01'),
														('C05', 'SVC02'),
														('C05', 'SVC03'),
														('C05', 'SVC04'),
														('C05', 'SVC05'),
														('C05', 'SVC06'),
														('C05', 'SVC07'),
														('C05', 'SVC08'),
														('C05', 'SVC09'),
														('C05', 'SVC10'),
														('C05', 'SVC11'),
														('C05', 'SVC12'),
														('C05', 'SVC13');


--admins
INSERT INTO admins (admin_id, first_name, last_name, username, password, phone, email, centre_id) VALUES
('AD01', 'Nguyen', 'Van A', 'nguyenvana', 'password1', '0901234567', 'vana@gmail.com', 'C01'); --password1
INSERT INTO admins (admin_id, first_name, last_name, username, password, phone, email, centre_id) VALUES
('AD02', 'Le', 'Thi B', 'lethib', 'adminpass', '0902234567', 'thib@gmail.com', 'C02'); --adminpass
INSERT INTO admins (admin_id, first_name, last_name, username, password, phone, email, centre_id) VALUES
('AD03', 'Tran', 'Van C', 'tranvanc', 'secure123', '0903234567', 'vanc@gmail.com', 'C03'); --secure123
INSERT INTO admins (admin_id, first_name, last_name, username, password, phone, email, centre_id) VALUES
('AD04', 'Pham', 'Thi D', 'phamthid', 'mypassword', '0904234567', 'thid@gmail.com', 'C04'); --mypassword
INSERT INTO admins (admin_id, first_name, last_name, username, password, phone, email, centre_id) VALUES
('AD05', 'Hoang', 'Van E', 'hoangvane', 'admin2024', '0905234567', 'vane@gmail.com', 'C05'); --admin2024

--customers
INSERT INTO customers (first_name, last_name, username, password, phone, email, signup_date) VALUES
('Hoang', 'Quyen', 'nguyena', 'password1', '0901234567', 'an@gmail.com', '2024-06-25'); -- password1
INSERT INTO customers (first_name, last_name, username, password, phone, email, signup_date) VALUES
('Le', 'Duc', 'leb', 'adminpass', '0912345678', 'binh@gmail.com', '2024-09-29'); -- adminpass
INSERT INTO customers (first_name, last_name, username, password, phone, email, signup_date) VALUES
('Tran', 'Phong', 'tranc', 'secure123', '0923456789', 'cuong@gmail.com', '2023-12-06'); -- secure123
INSERT INTO customers (first_name, last_name, username, password, phone, email, signup_date) VALUES
('Nguyen', 'Son', 'phamd', 'mypassword', '0934567890', 'duc@gmail.com', '2023-12-23'); -- mypassword
INSERT INTO customers (first_name, last_name, username, password, phone, email, signup_date) VALUES
('Hoang', 'Cuong', 'hoange', 'admin2024', '0945678901', 'ha@gmail.com', '2024-03-12'); -- admin2024
INSERT INTO customers (first_name, last_name, username, password, phone, email, signup_date) VALUES
('Hoang', 'Cuong', 'linhf', 'userpass', '0956789012', 'linh@gmail.com', '2024-04-07'); -- userpass
INSERT INTO customers (first_name, last_name, username, password, phone, email, signup_date) VALUES
('Pham', 'Tuyen', 'phongg', 'testing12', '0967890123', 'phong@gmail.com', '2024-09-17'); -- testing12
INSERT INTO customers (first_name, last_name, username, password, phone, email, signup_date) VALUES
('Le', 'Ha', 'quyenh', 'secure456', '0978901234', 'quyen@gmail.com', '2023-12-29'); -- secure456
INSERT INTO customers (first_name, last_name, username, password, phone, email, signup_date) VALUES
('Hoang', 'Phong', 'soni', 'demo789', '0989012345', 'son@gmail.com', '2024-11-12'); -- demo789
INSERT INTO customers (first_name, last_name, username, password, phone, email, signup_date) VALUES
('Nguyen', 'Binh', 'tuyenj', 'vietpass', '0990123456', 'tuyen@gmail.com', '2024-04-12'); -- vietpass

--favourite_field
INSERT INTO favourite_field (cust_id, field_id) VALUES (1, 'BD001');
INSERT INTO favourite_field (cust_id, field_id) VALUES (1, 'BD003');
INSERT INTO favourite_field (cust_id, field_id) VALUES (1, 'BD004');
INSERT INTO favourite_field (cust_id, field_id) VALUES (2, 'BC001');
INSERT INTO favourite_field (cust_id, field_id) VALUES (2, 'BC003');
INSERT INTO favourite_field (cust_id, field_id) VALUES (3, 'CL001');
INSERT INTO favourite_field (cust_id, field_id) VALUES (3, 'BR002');
INSERT INTO favourite_field (cust_id, field_id) VALUES (4, 'TN001');
INSERT INTO favourite_field (cust_id, field_id) VALUES (4, 'PK001');
INSERT INTO favourite_field (cust_id, field_id) VALUES (5, 'TN003');
INSERT INTO favourite_field (cust_id, field_id) VALUES (5, 'CL002');

--feedbacks
INSERT INTO feedbacks (feedback_id, star, created_at, description, field_id, cust_id) VALUES
('FB01', 2, '2024-03-10 12:30:51', 'Thời gian thuê linh hoạt, sân đẹp.', 'TN004', 1);
INSERT INTO feedbacks (feedback_id, star, created_at, description, field_id, cust_id) VALUES
('FB02', 2, '2024-10-31 12:30:51', 'Sân không đúng như quảng cáo, khá thất vọng.', 'BC001', 8);
INSERT INTO feedbacks (feedback_id, star, created_at, description, field_id, cust_id) VALUES
('FB03', 1, '2024-09-30 12:30:51', 'Trang thiết bị đầy đủ, không có gì để chê.', 'BD002', 8);
INSERT INTO feedbacks (feedback_id, star, created_at, description, field_id, cust_id) VALUES
('FB04', 4, '2024-03-14 12:30:51', 'Dịch vụ khá tốt, sẽ quay lại lần sau.', 'BR001', 4);
INSERT INTO feedbacks (feedback_id, star, created_at, description, field_id, cust_id) VALUES
('FB05', 3, '2024-02-08 12:30:51', 'Mặt sân hơi trơn, cần cải thiện.', 'TN003', 5);
INSERT INTO feedbacks (feedback_id, star, created_at, description, field_id, cust_id) VALUES
('FB06', 4, '2024-01-12 12:30:51', 'Đội ngũ hỗ trợ nhanh chóng và thân thiện.', 'BR001', 4);
INSERT INTO feedbacks (feedback_id, star, created_at, description, field_id, cust_id) VALUES
('FB07', 4, '2023-12-23 12:30:51', 'Ánh sáng tốt, phù hợp chơi buổi tối.', 'TN004', 1);
INSERT INTO feedbacks (feedback_id, star, created_at, description, field_id, cust_id) VALUES
('FB08', 5, '2024-01-15 12:30:51', 'Giá thuê phù hợp, sân trong tình trạng tốt.', 'BR001', 6);
INSERT INTO feedbacks (feedback_id, star, created_at, description, field_id, cust_id) VALUES
('FB09', 3, '2024-08-03 12:30:51', 'Có chỗ để xe rộng rãi, tiện lợi.', 'TN004', 6);
INSERT INTO feedbacks (feedback_id, star, created_at, description, field_id, cust_id) VALUES
('FB10', 3, '2024-01-15 12:30:51', 'Sân không đúng như quảng cáo, khá thất vọng.', 'BC001', 2);

--Tournament
INSERT INTO tournament (tournament_id, tournament_name, description, fee, link_img, centre_id, tourn_status, organizer, contact) VALUES 
('TRN01', 'Giải Bóng Đá Mùa Xuân', 'Một giải đấu hấp dẫn dành cho mọi lứa tuổi.', 500000, 'https://example.com/img1.jpg', 'C04', 'Upcoming', 'Câu lạc bộ thể thao ABC', '0934567890');
INSERT INTO tournament (tournament_id, tournament_name, description, fee, link_img, centre_id, tourn_status, organizer, contact) VALUES 
('TRN02', 'Giải Bóng Chuyền Hè 2024', 'Cơ hội thể hiện tài năng của các vận động viên.', 1000000, 'https://example.com/img2.jpg', 'C02', 'InProgress', 'Hiệp hội thể thao Việt Nam', '0923456789');
INSERT INTO tournament (tournament_id, tournament_name, description, fee, link_img, centre_id, tourn_status, organizer, contact) VALUES 
('TRN03', 'Giải Tennis Cúp Vàng', 'Giải đấu uy tín với nhiều phần thưởng giá trị.', 1500000, 'https://example.com/img3.jpg', 'C03', 'Concluded', 'Ban tổ chức thành phố', '0912345678');
INSERT INTO tournament (tournament_id, tournament_name, description, fee, link_img, centre_id, tourn_status, organizer, contact) VALUES 
('TRN04', 'Giải Cầu Lông Mở Rộng', 'Cơ hội giao lưu học hỏi giữa các đội mạnh.', 200000, 'https://example.com/img4.jpg', 'C05', 'Concluded', 'Ban tổ chức thành phố', '0945678901');
INSERT INTO tournament (tournament_id, tournament_name, description, fee, link_img, centre_id, tourn_status, organizer, contact) VALUES 
('TRN05', 'Giải Bóng Rổ Siêu Sao', 'Giải đấu quy tụ các tài năng nổi bật.', 800000, 'https://example.com/img5.jpg', 'C01', 'InProgress', 'Hiệp hội thể thao Việt Nam', '0901234567');
INSERT INTO tournament (tournament_id, tournament_name, description, fee, link_img, centre_id, tourn_status, organizer, contact) VALUES 
('TRN06', 'Giải Pickleball Toàn Quốc', 'Tạo sân chơi chuyên nghiệp cho các vận động viên.', 300000, 'https://example.com/img6.jpg', 'C04', 'Upcoming', 'Câu lạc bộ thể thao ABC', '0945678901');
INSERT INTO tournament (tournament_id, tournament_name, description, fee, link_img, centre_id, tourn_status, organizer, contact) VALUES 
('TRN07', 'Giải Bóng Đá Trẻ', 'Thúc đẩy phong trào thể thao địa phương.', 1200000, 'https://example.com/img7.jpg', 'C04', 'Concluded', 'Liên đoàn thể thao Quốc gia', '0901234567');
INSERT INTO tournament (tournament_id, tournament_name, description, fee, link_img, centre_id, tourn_status, organizer, contact) VALUES 
('TRN08', 'Giải Cầu Lông Quốc Tế', 'Tăng cường kết nối giữa các câu lạc bộ.', 600000, 'https://example.com/img8.jpg', 'C05', 'Upcoming', 'Công ty TNHH Thể Thao', '0945678901');
INSERT INTO tournament (tournament_id, tournament_name, description, fee, link_img, centre_id, tourn_status, organizer, contact) VALUES 
('TRN09', 'Giải Tennis Vô Địch', 'Giải đấu được tổ chức hàng năm, đầy hứa hẹn.', 900000, 'https://example.com/img9.jpg', 'C03', 'InProgress', 'Liên đoàn thể thao Quốc gia', '0923456789');
INSERT INTO tournament (tournament_id, tournament_name, description, fee, link_img, centre_id, tourn_status, organizer, contact) VALUES 
('TRN10', 'Giải Bóng Chuyền Mùa Đông', 'Nâng cao tinh thần thể thao và đoàn kết.', 700000, 'https://example.com/img10.jpg', 'C01', 'InProgress', 'Ban tổ chức thành phố', '0923456789');

--tourn_comment
INSERT INTO tourn_comment (tourn_cmt_id, cust_id, tournament_id, comment) VALUES 
('CMT01', 7, 'TRN10', 'Không khí giải đấu rất sôi động và hấp dẫn.');
INSERT INTO tourn_comment (tourn_cmt_id, cust_id, tournament_id, comment) VALUES 
('CMT02', 6, 'TRN04', 'Giải đấu quy tụ nhiều đội mạnh, rất kịch tính.');
INSERT INTO tourn_comment (tourn_cmt_id, cust_id, tournament_id, comment) VALUES 
('CMT03', 10, 'TRN10', 'Cần thêm các hoạt động bên lề để tăng sự thu hút.');
INSERT INTO tourn_comment (tourn_cmt_id, cust_id, tournament_id, comment) VALUES 
('CMT04', 3, 'TRN06', 'Cần thêm các hoạt động bên lề để tăng sự thu hút.');
INSERT INTO tourn_comment (tourn_cmt_id, cust_id, tournament_id, comment) VALUES 
('CMT05', 4, 'TRN09', 'Tôi rất hài lòng với cách tổ chức.');
INSERT INTO tourn_comment (tourn_cmt_id, cust_id, tournament_id, comment) VALUES 
('CMT06', 9, 'TRN04', 'Hy vọng giải đấu lần tới sẽ có quy mô lớn hơn.');
INSERT INTO tourn_comment (tourn_cmt_id, cust_id, tournament_id, comment) VALUES 
('CMT07', 1, 'TRN02', 'Không khí giải đấu rất sôi động và hấp dẫn.');
INSERT INTO tourn_comment (tourn_cmt_id, cust_id, tournament_id, comment) VALUES 
('CMT08', 7, 'TRN01', 'Ban tổ chức làm việc tốt, mọi thứ diễn ra suôn sẻ.');
INSERT INTO tourn_comment (tourn_cmt_id, cust_id, tournament_id, comment) VALUES 
('CMT09', 2, 'TRN06', 'Ban tổ chức làm việc tốt, mọi thứ diễn ra suôn sẻ.');
INSERT INTO tourn_comment (tourn_cmt_id, cust_id, tournament_id, comment) VALUES 
('CMT10', 7, 'TRN02', 'Cần thêm các hoạt động bên lề để tăng sự thu hút.');

--teams
INSERT INTO teams (tournament_id, leader_id, team_name) VALUES ('TRN03', 8, 'Bão Lửa');
INSERT INTO teams (tournament_id, leader_id, team_name) VALUES ('TRN10', 6, 'Ánh Sáng');
INSERT INTO teams (tournament_id, leader_id, team_name) VALUES ('TRN08', 9, 'Đội Mạnh Nhất');
INSERT INTO teams (tournament_id, leader_id, team_name) VALUES ('TRN07', 7, 'Hổ Báo Thép');
INSERT INTO teams (tournament_id, leader_id, team_name) VALUES ('TRN09', 4, 'Chiến Thần');
INSERT INTO teams (tournament_id, leader_id, team_name) VALUES ('TRN09', 5, 'Hổ Báo Thép');
INSERT INTO teams (tournament_id, leader_id, team_name) VALUES ('TRN10', 8, 'Ánh Sáng');
INSERT INTO teams (tournament_id, leader_id, team_name) VALUES ('TRN04', 1, 'Sấm Sét Đỏ');
INSERT INTO teams (tournament_id, leader_id, team_name) VALUES ('TRN02', 9, 'Kỵ Sĩ Bóng Tối');
INSERT INTO teams (tournament_id, leader_id, team_name) VALUES ('TRN05', 4, 'Ánh Sáng');

--members
INSERT INTO members (member_id, first_name, last_name, leader_id) VALUES ('MEM01', 'Tran', 'Phong', 2);
INSERT INTO members (member_id, first_name, last_name, leader_id) VALUES ('MEM02', 'Hoang', 'Quyen', 4);
INSERT INTO members (member_id, first_name, last_name, leader_id) VALUES ('MEM03', 'Dang', 'Tuyen', 6);
INSERT INTO members (member_id, first_name, last_name, leader_id) VALUES ('MEM04', 'Nguyen', 'Duc', 9);
INSERT INTO members (member_id, first_name, last_name, leader_id) VALUES ('MEM05', 'Vu', 'Duc', 2);
INSERT INTO members (member_id, first_name, last_name, leader_id) VALUES ('MEM06', 'Dang', 'An', 10);
INSERT INTO members (member_id, first_name, last_name, leader_id) VALUES ('MEM07', 'Pham', 'Ha', 6);
INSERT INTO members (member_id, first_name, last_name, leader_id) VALUES ('MEM08', 'Hoang', 'Linh', 4);
INSERT INTO members (member_id, first_name, last_name, leader_id) VALUES ('MEM09', 'Vu', 'Binh', 1);
INSERT INTO members (member_id, first_name, last_name, leader_id) VALUES ('MEM10', 'Do', 'Phong', 10);

--reservation
INSERT INTO reservation (time_begin, time_end, resrv_date, renting_price, created_date, field_id, cust_id, resrv_status) VALUES 
('18:00:00', '20:00:00', '2024-10-29', 271000, '2024-09-28 13:08:00', 'BC002', 5, 'confirmed');
INSERT INTO reservation (time_begin, time_end, resrv_date, renting_price, created_date, field_id, cust_id, resrv_status) VALUES 
('16:00:00', '18:00:00', '2024-11-15', 122000, '2024-11-10 13:08:00', 'CL003', 4, 'pending');
INSERT INTO reservation (time_begin, time_end, resrv_date, renting_price, created_date, field_id, cust_id, resrv_status) VALUES 
('10:00:00', '12:00:00', '2024-10-28', 177000, '2024-10-17 13:08:00', 'BR001', 7, 'canceled');
INSERT INTO reservation (time_begin, time_end, resrv_date, renting_price, created_date, field_id, cust_id, resrv_status) VALUES 
('08:00:00', '10:00:00', '2024-10-20', 259000, '2024-10-13 13:08:00', 'TN002', 10, 'canceled');
INSERT INTO reservation (time_begin, time_end, resrv_date, renting_price, created_date, field_id, cust_id, resrv_status) VALUES 
('18:00:00', '20:00:00', '2024-11-10', 185000, '2024-10-18 13:08:00', 'BD001', 1, 'confirmed');
INSERT INTO reservation (time_begin, time_end, resrv_date, renting_price, created_date, field_id, cust_id, resrv_status) VALUES 
('08:00:00', '10:00:00', '2024-10-20', 358000, '2024-10-12 13:08:00', 'TN004', 1, 'canceled');
INSERT INTO reservation (time_begin, time_end, resrv_date, renting_price, created_date, field_id, cust_id, resrv_status) VALUES 
('14:00:00', '16:00:00', '2024-10-31', 344000, '2024-09-30 13:08:00', 'CL003', 3, 'canceled');
INSERT INTO reservation (time_begin, time_end, resrv_date, renting_price, created_date, field_id, cust_id, resrv_status) VALUES  
('16:00:00', '18:00:00', '2024-11-08', 320000, '2024-10-31 13:08:00', 'PK002', 1, 'pending');
INSERT INTO reservation (time_begin, time_end, resrv_date, renting_price, created_date, field_id, cust_id, resrv_status) VALUES 
('14:00:00', '16:00:00', '2024-11-04', 223000, '2024-10-15 13:08:00', 'BD005', 8, 'confirmed');
INSERT INTO reservation (time_begin, time_end, resrv_date, renting_price, created_date, field_id, cust_id, resrv_status) VALUES 
('08:00:00', '10:00:00', '2024-10-31', 130000, '2024-10-24 13:08:00', 'BD002', 2, 'pending');

--payment
INSERT INTO payment (payment_date, pay_method, total_price, resrv_id, admin_id) VALUES 
('2024-11-01 13:27:32', 'Chuyển khoản', 107000, 3, 'AD04');
INSERT INTO payment (payment_date, pay_method, total_price, resrv_id, admin_id) VALUES 
('2024-11-12 13:27:32', 'Tiền mặt', 248000, 5, 'AD01');
INSERT INTO payment (payment_date, pay_method, total_price, resrv_id, admin_id) VALUES  
('2024-11-03 13:27:32', 'Chuyển khoản', 335000, 9, 'AD03');
