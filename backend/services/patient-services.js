import db from "../db/db.js";

const getPatient = (name, code) => {
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
         WHERE
            patients.name = ? AND patients.code = ?
         ORDER BY
            triage_records.wait_time;
         `,
         [name, code],
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
      WHERE
         patients.admitted = FALSE
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

                  // Step 3: Calculate the wait time based on severity and current queue
                  db.query(
                     `SELECT wait_time, severity FROM triage_records
                      WHERE patient_id IN (SELECT patient_id FROM patients WHERE admitted = FALSE)
                      ORDER BY wait_time ASC`,
                     (error, queueResults) => {
                        if (error) {
                           return reject(error);
                        }

                        let baseWaitTime;
                        const severityBuffer = 5; // Buffer of 5 minutes

                        // Determine base wait time based on severity
                        switch (triageData.severity) {
                           case 1:
                              baseWaitTime = 15;
                              break;
                           case 2:
                              baseWaitTime = 25;
                              break;
                           case 3:
                              baseWaitTime = 35;
                              break;
                           case 4:
                              baseWaitTime = 45;
                              break;
                           case 5:
                              baseWaitTime = 55;
                              break;
                           default:
                              baseWaitTime = 35; // Default to a moderate severity wait time
                        }

                        // Adjust wait times to maintain a buffer of 5 minutes
                        let newPatientWaitTime = baseWaitTime;
                        for (let i = 0; i < queueResults.length; i++) {
                           if (queueResults[i].wait_time >= newPatientWaitTime) {
                              newPatientWaitTime = queueResults[i].wait_time + severityBuffer;
                           }
                        }

                        // Step 4: Insert into triage_records table with calculated wait time
                        db.query(
                           `INSERT INTO triage_records (patient_id, admin_id, severity, wait_time) VALUES (?, ?, ?, ?)`,
                           [patientId, adminId, triageData.severity, newPatientWaitTime],
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
         }
      );
   });
};

const admitPatient = (patientId) => {
   return new Promise((resolve, reject) => {
      // Step 1: Update the admitted status of the patient
      db.query(`UPDATE patients SET admitted = TRUE WHERE patient_id = ?`, [patientId], (error, results) => {
         if (error) {
            return reject(error);
         }

         // Step 2: Fetch the wait time of the admitted patient
         db.query(
            `SELECT wait_time FROM triage_records WHERE patient_id = ?`,
            [patientId],
            (error, waitTimeResults) => {
               if (error) {
                  return reject(error);
               }

               if (waitTimeResults.length === 0) {
                  return reject(new Error("Wait time not found for the admitted patient."));
               }

               const admittedPatientWaitTime = waitTimeResults[0].wait_time;

               // Step 3: Reduce the wait time of all patients not admitted who have a wait time greater than the admitted patient's wait time
               db.query(
                  `UPDATE triage_records
                     SET wait_time = GREATEST(wait_time - 5, 0)
                     WHERE patient_id IN (SELECT patient_id FROM patients WHERE admitted = FALSE)
                       AND wait_time > ?`,
                  [admittedPatientWaitTime],
                  (error, updateResults) => {
                     if (error) {
                        return reject(error);
                     }
                     resolve(updateResults);
                  }
               );
            }
         );
      });
   });
};

const patientServices = {
   getPatient,
   getAllPatientData,
   addPatient,
   admitPatient,
};

export default patientServices;
