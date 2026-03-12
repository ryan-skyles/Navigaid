-- =========================
-- LOCATION
-- =========================
CREATE TABLE Location (
    location_id SERIAL PRIMARY KEY,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(15),
    county VARCHAR(100)
);

-- =========================
-- USER
-- =========================
CREATE TABLE client (
    client_id SERIAL PRIMARY KEY,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(25),
    pref_language VARCHAR(50),
    account_creation_date DATE,
    location_id INT,
    FOREIGN KEY (location_id) REFERENCES Location(location_id)
);

-- =========================
-- USER CASE PROFILE
-- =========================
CREATE TABLE client_case_profile (
    profile_id SERIAL PRIMARY KEY,
    client_id INT UNIQUE,
    employment_status VARCHAR(100),
    household_size INT,
    monthly_income INT,
    housing_status VARCHAR(100),
    disability_status INT,
    veteran_status INT,
    dependents VARCHAR(100),
    last_updated DATE,
    FOREIGN KEY (client_id) REFERENCES client(client_id) ON DELETE CASCADE
);

-- =========================
-- AID PROGRAM
-- =========================
CREATE TABLE Aid_program (
    program_id SERIAL PRIMARY KEY,
    program_name VARCHAR(150),
    program_type VARCHAR(100),
    description_plain_language TEXT,
    website_url VARCHAR(255),
    application_url VARCHAR(255),
    managing_agency VARCHAR(150),
    location_id INT,
    FOREIGN KEY (location_id) REFERENCES Location(location_id)
);

-- =========================
-- ELIGIBILITY CRITERIA
-- =========================
CREATE TABLE Eligibility_criteria (
    eligibility_id SERIAL PRIMARY KEY,
    program_id INT,
    min_income INT,
    max_income INT,
    household_size_limit INT,
    age_requirement VARCHAR(50),
    required_status VARCHAR(100),
    description_plain_language TEXT,
    FOREIGN KEY (program_id) REFERENCES Aid_program(program_id) ON DELETE CASCADE
);

-- =========================
-- APPLICATION
-- =========================
CREATE TABLE Application (
    app_id SERIAL PRIMARY KEY,
    client_id INT,
    program_id INT,
    date_submitted DATE,
    status VARCHAR(50),
    last_updated DATE,
    FOREIGN KEY (client_id) REFERENCES client(client_id) ON DELETE CASCADE,
    FOREIGN KEY (program_id) REFERENCES Aid_program(program_id) ON DELETE CASCADE
);

-- =========================
-- APPLICATION STATUS HISTORY
-- =========================
CREATE TABLE Application_status_history (
    history_id SERIAL PRIMARY KEY,
    app_id INT,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    change_date DATE,
    FOREIGN KEY (app_id) REFERENCES Application(app_id) ON DELETE CASCADE
);

-- =========================
-- CHAT SESSION
-- =========================
CREATE TABLE Chat_session (
    session_id SERIAL PRIMARY KEY,
    client_id INT,
    start_time TIME,
    end_time TIME,
    summary_generated BOOLEAN,
    is_starred BOOLEAN NOT NULL DEFAULT false,
    FOREIGN KEY (client_id) REFERENCES client(client_id) ON DELETE CASCADE
);

-- =========================
-- CHAT MESSAGE
-- =========================
CREATE TABLE Chat_message (
    message_id SERIAL PRIMARY KEY,
    session_id INT,
    sender_type VARCHAR(50),
    message_text TEXT,
    timestamp TIME,
    FOREIGN KEY (session_id) REFERENCES Chat_session(session_id) ON DELETE CASCADE
);

-- =========================
-- USER NEED
-- =========================
CREATE TABLE client_need (
    need_id SERIAL PRIMARY KEY,
    client_id INT,
    session_id INT,
    need_type VARCHAR(100),
    urgency_level VARCHAR(50),
    date_identified DATE,
    FOREIGN KEY (client_id) REFERENCES client(client_id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES Chat_session(session_id) ON DELETE SET NULL
);

-- =========================
-- RECOMMENDATION
-- =========================
CREATE TABLE Recommendation (
    recommendation_id SERIAL PRIMARY KEY,
    client_id INT,
    program_id INT,
    need_id INT,
    session_id INT,
    confidence_score DECIMAL(5,2),
    date_recommended DATE,
    FOREIGN KEY (client_id) REFERENCES client(client_id) ON DELETE CASCADE,
    FOREIGN KEY (program_id) REFERENCES Aid_program(program_id),
    FOREIGN KEY (need_id) REFERENCES client_need(need_id),
    FOREIGN KEY (session_id) REFERENCES Chat_session(session_id)
);

-- =========================
-- NOTIFICATION
-- =========================
CREATE TABLE Notification (
    notification_id SERIAL PRIMARY KEY,
    client_id INT,
    app_id INT,
    message TEXT,
    notification_type VARCHAR(50),
    date_sent DATE,
    read_status VARCHAR(50),
    FOREIGN KEY (client_id) REFERENCES client(client_id) ON DELETE CASCADE,
    FOREIGN KEY (app_id) REFERENCES Application(app_id) ON DELETE CASCADE
);

CREATE INDEX idx_application_client ON Application(client_id);
CREATE INDEX idx_application_program ON Application(program_id);
CREATE INDEX idx_chat_session_client ON Chat_session(client_id);
CREATE INDEX idx_recommendation_client ON Recommendation(client_id);
CREATE INDEX idx_recommendation_program ON Recommendation(program_id);
