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
    severity INT NOT NULL,
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

INSERT INTO administrators (username, password) VALUES ('Admin One', 'password1');
INSERT INTO administrators (username, password) VALUES ('Admin Two', 'password2');
INSERT INTO administrators (username, password) VALUES ('Admin Three', 'password3');

INSERT INTO triage_records (patient_id, admin_id, severity, wait_time) VALUES (1, 1, 4, 45);
INSERT INTO triage_records (patient_id, admin_id, severity, wait_time) VALUES (2, 2, 2, 30);
INSERT INTO triage_records (patient_id, admin_id, severity, wait_time) VALUES (3, 3, 3, 25);
INSERT INTO triage_records (patient_id, admin_id, severity, wait_time) VALUES (4, 1, 5, 60);
INSERT INTO triage_records (patient_id, admin_id, severity, wait_time) VALUES (5, 2, 1, 15);
INSERT INTO triage_records (patient_id, admin_id, severity, wait_time) VALUES (6, 3, 2, 35);
INSERT INTO triage_records (patient_id, admin_id, severity, wait_time) VALUES (7, 1, 4, 50);
INSERT INTO triage_records (patient_id, admin_id, severity, wait_time) VALUES (8, 2, 3, 40);
INSERT INTO triage_records (patient_id, admin_id, severity, wait_time) VALUES (9, 3, 1, 20);
INSERT INTO triage_records (patient_id, admin_id, severity, wait_time) VALUES (10, 1, 5, 55);

SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
