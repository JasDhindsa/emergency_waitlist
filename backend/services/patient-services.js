import db from "../db/db.js";

const getPatient = (name, code) => {
   return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM patients WHERE name = ? AND code = ?`, [name, code], (error, results) => {
         if (error) {
            reject(error);
         } else {
            resolve(results[0]);
         }
      });
   });
};

const getAllPatientData = () => {
   return new Promise((resolve, reject) => {
      db.query(
         `
      SELECT
         patients.patient_id,
         patients.name AS patient_name,
         patients.code AS patient_code,
         patients.created_at AS patient_created_at,
         triage_records.record_id,
         triage_records.severity,
         triage_records.wait_time,
         triage_records.triage_time,
         administrators.username AS admin_username
      FROM
         patients
      LEFT JOIN
         triage_records ON patients.patient_id = triage_records.patient_id
      LEFT JOIN
         administrators ON triage_records.admin_id = administrators.admin_id
      ORDER BY
         triage_records.wait_time;
      `,
         (error, results) => {
            if (error) {
               reject(error);
            } else {
               resolve(results);
            }
         }
      );
   });
};

const addPatient = (patientData, triageData, adminUsername) => {
   return new Promise((resolve, reject) => {
      // Step 1: Insert into patients table
      db.query(
         `INSERT INTO patients (name, code) VALUES (?, ?)`,
         [patientData.name, patientData.code],
         (error, patientResults) => {
            if (error) {
               return reject(error);
            }

            const patientId = patientResults.insertId;

            // Step 2: Get admin_id from administrators table
            db.query(
               `SELECT admin_id FROM administrators WHERE username = ?`,
               [adminUsername],
               (error, adminResults) => {
                  if (error) {
                     return reject(error);
                  }

                  if (adminResults.length === 0) {
                     return reject(new Error("Administrator not found"));
                  }

                  const adminId = adminResults[0].admin_id;

                  // Step 3: Insert into triage_records table
                  db.query(
                     `INSERT INTO triage_records (patient_id, admin_id, severity, wait_time) VALUES (?, ?, ?, ?)`,
                     [patientId, adminId, triageData.severity, triageData.wait_time],
                     (error, triageResults) => {
                        if (error) {
                           return reject(error);
                        }

                        resolve({
                           patientId: patientId,
                           triageRecordId: triageResults.insertId,
                        });
                     }
                  );
               }
            );
         }
      );
   });
};


const patientServices = {
   getPatient,
   getAllPatientData,
   addPatient
};

export default patientServices;
