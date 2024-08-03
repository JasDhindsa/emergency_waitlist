import db from "../db/db.js";

const getAdmin = (username, password) => {
   return new Promise((resolve, reject) => {
      db.query(
         `SELECT * FROM administrators WHERE username = ? AND password = ?`,
         [username, password],
         (error, results) => {
            if (error) {
               reject(error);
            } else {
               resolve(results[0]);
            }
         }
      );
   });
}

const adminServices = {
   getAdmin
}

export default adminServices;