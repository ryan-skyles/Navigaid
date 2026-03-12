INSERT INTO Location (city, state, zip_code, county) VALUES
('Salt Lake City','UT','84101','Salt Lake'),
('Ogden','UT','84401','Weber'),
('Provo','UT','84601','Utah'),
('Logan','UT','84321','Cache'),
('St George','UT','84770','Washington');

INSERT INTO client
(firstName,lastName,email,password,phone,pref_language,account_creation_date,location_id)
VALUES
('John','Doe','john@example.com','pass123','8015551111','English','2025-01-01',1),
('Maria','Lopez','maria@example.com','pass123','8015552222','Spanish','2025-01-03',2),
('David','Kim','david@example.com','pass123','8015553333','English','2025-01-05',3),
('Aisha','Hassan','aisha@example.com','pass123','8015554444','Arabic','2025-01-07',4),
('Liam','Brown','liam@example.com','pass123','8015555555','English','2025-01-09',5);

INSERT INTO client_case_profile
(client_id,employment_status,household_size,monthly_income,housing_status,disability_status,veteran_status,dependents,last_updated)
VALUES
(1,'Unemployed',2,1200,'Renting',0,0,'1 child','2025-02-01'),
(2,'Part-time',4,2200,'Renting',0,0,'2 children','2025-02-02'),
(3,'Full-time',1,3500,'Owns',0,0,'None','2025-02-03'),
(4,'Unemployed',3,900,'Shelter',1,0,'1 child','2025-02-04'),
(5,'Student',1,600,'Dorm',0,0,'None','2025-02-05');

INSERT INTO Aid_program
(program_name,program_type,description_plain_language,website_url,application_url,managing_agency,location_id)
VALUES
('SNAP Food Assistance','Food','Helps pay for groceries','https://snap.gov','https://apply.snap.gov','Dept of Human Services',1),
('Medicaid','Health','Free or low cost health coverage','https://medicaid.gov','https://apply.medicaid.gov','State Health Dept',1),
('Housing Voucher','Housing','Helps pay rent','https://housing.gov','https://apply.housing.gov','Housing Authority',2),
('Child Care Assistance','Childcare','Helps cover daycare costs','https://childcare.gov','https://apply.childcare.gov','Family Services',3),
('Utility Assistance','Utilities','Helps pay heating and power bills','https://liheap.gov','https://apply.liheap.gov','Energy Assistance Office',4);

INSERT INTO Eligibility_criteria
(program_id,min_income,max_income,household_size_limit,age_requirement,required_status,description_plain_language)
VALUES
(1,0,2000,4,'18+','Low income','Must be low income household'),
(2,0,2500,5,'Any','Citizen or resident','Health coverage eligibility'),
(3,0,1800,6,'18+','Low income','Rental assistance eligibility'),
(4,0,2200,5,'Parent','Working or studying','Childcare help'),
(5,0,2100,5,'18+','Low income','Energy bill support');

INSERT INTO Application
(client_id,program_id,date_submitted,status,last_updated)
VALUES
(1,1,'2025-02-10','Pending','2025-02-10'),
(2,3,'2025-02-11','Approved','2025-02-12'),
(3,2,'2025-02-11','Denied','2025-02-13'),
(4,5,'2025-02-12','Pending','2025-02-12'),
(5,4,'2025-02-13','Pending','2025-02-13');

INSERT INTO Application_status_history
(app_id,old_status,new_status,change_date)
VALUES
(1,'Submitted','Pending','2025-02-10'),
(2,'Pending','Approved','2025-02-12'),
(3,'Pending','Denied','2025-02-13'),
(4,'Submitted','Pending','2025-02-12'),
(5,'Submitted','Pending','2025-02-13');

INSERT INTO Chat_session
(client_id,start_time,end_time,summary_generated,is_starred)
VALUES
(1,'09:00','09:20',true,true),
(2,'10:00','10:25',true,false),
(3,'11:00','11:15',false,true),
(4,'12:00','12:30',true,false),
(5,'13:00','13:10',false,false);

INSERT INTO Chat_message
(session_id,sender_type,message_text,timestamp)
VALUES
(1,'user','I need help buying food','09:01'),
(2,'user','I cannot pay rent','10:02'),
(3,'user','Do I qualify for Medicaid?','11:02'),
(4,'user','My power might be shut off','12:05'),
(5,'user','I need childcare support','13:03');

INSERT INTO client_need
(client_id,session_id,need_type,urgency_level,date_identified)
VALUES
(1,1,'Food','High','2025-02-10'),
(2,2,'Housing','High','2025-02-11'),
(3,3,'Healthcare','Medium','2025-02-11'),
(4,4,'Utilities','High','2025-02-12'),
(5,5,'Childcare','Medium','2025-02-13');

INSERT INTO Recommendation
(client_id,program_id,need_id,session_id,confidence_score,date_recommended)
VALUES
(1,1,1,1,0.95,'2025-02-10'),
(2,3,2,2,0.92,'2025-02-11'),
(3,2,3,3,0.88,'2025-02-11'),
(4,5,4,4,0.97,'2025-02-12'),
(5,4,5,5,0.90,'2025-02-13');

INSERT INTO Notification
(client_id,app_id,message,notification_type,date_sent,read_status)
VALUES
(1,1,'Your SNAP application is pending','Application Update','2025-02-10','Unread'),
(2,2,'Your housing voucher was approved','Application Update','2025-02-12','Read'),
(3,3,'Your Medicaid application was denied','Application Update','2025-02-13','Unread'),
(4,4,'Utility assistance is under review','Application Update','2025-02-12','Unread'),
(5,5,'Childcare assistance received','Application Update','2025-02-13','Read');