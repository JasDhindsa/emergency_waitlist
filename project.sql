--  Group 1
-- Jordan Na [300166499]
-- Jas Dhindsa [300245355]

USE hospitaltriagedb;

SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS; 
SET FOREIGN_KEY_CHECKS=0;   

DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS administrators;
DROP TABLE IF EXISTS triage_records;

CREATE TABLE patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code CHAR(3) NOT NULL,
    admitted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, code)
);

CREATE TABLE administrators (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(username)
);

CREATE TABLE triage_records (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    admin_id INT NOT NULL,
    severity TINYINT NOT NULL CHECK (severity BETWEEN 1 AND 5),
    wait_time INT NOT NULL, -- in minutes
    triage_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (admin_id) REFERENCES administrators(admin_id)
);

INSERT INTO patients (name, code) VALUES ('Alice Johnson', 'AJN');
INSERT INTO patients (name, code) VALUES ('Bob Smith', 'BSM');
INSERT INTO patients (name, code) VALUES ('Carol White', 'CWH');
INSERT INTO patients (name, code) VALUES ('David Brown', 'DBR');
INSERT INTO patients (name, code) VALUES ('Emma Davis', 'EDA');
INSERT INTO patients (name, code) VALUES ('Frank Green', 'FGR');
INSERT INTO patients (name, code) VALUES ('Grace Hill', 'GHL');
INSERT INTO patients (name, code) VALUES ('Henry King', 'HKG');
INSERT INTO patients (name, code) VALUES ('Ivy Lee', 'ILE');
INSERT INTO patients (name, code) VALUES ('Jack Miller', 'JML');

INSERT INTO administrators (username, password) VALUES ('admin-1', 'password1');
INSERT INTO administrators (username, password) VALUES ('admin-2', 'password2');
INSERT INTO administrators (username, password) VALUES ('admin-3', 'password3');

-- Severity 1 (most critical), sorted by wait time
INSERT INTO triage_records (patient_id, admin_id, severity, wait_time) VALUES (5, 2, 1, 15); -- Severity 1, first patient
INSERT INTO triage_records (patient_id, admin_id, severity, wait_time) VALUES (9, 3, 1, 20); -- Severity 1, second patient (15 + 5)

-- Severity 2, sorted by wait time
INSERT INTO triage_records (patient_id, admin_id, severity, wait_time) VALUES (2, 2, 2, 25); -- Severity 2, first patient
INSERT INTO triage_records (patient_id, admin_id, severity, wait_time) VALUES (6, 3, 2, 30); -- Severity 2, second patient (25 + 5)

-- Severity 3, sorted by wait time
INSERT INTO triage_records (patient_id, admin_id, severity, wait_time) VALUES (3, 3, 3, 35); -- Severity 3, first patient
INSERT INTO triage_records (patient_id, admin_id, severity, wait_time) VALUES (8, 2, 3, 40); -- Severity 3, second patient (35 + 5)

-- Severity 4, sorted by wait time
INSERT INTO triage_records (patient_id, admin_id, severity, wait_time) VALUES (1, 1, 4, 45); -- Severity 4, first patient
INSERT INTO triage_records (patient_id, admin_id, severity, wait_time) VALUES (7, 1, 4, 50); -- Severity 4, second patient (45 + 5)

-- Severity 5 (least critical), sorted by wait time
INSERT INTO triage_records (patient_id, admin_id, severity, wait_time) VALUES (4, 1, 5, 55); -- Severity 5, first patient
INSERT INTO triage_records (patient_id, admin_id, severity, wait_time) VALUES (10, 1, 5, 60); -- Severity 5, second patient (55 + 5)

SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
