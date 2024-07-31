import mysql from "mysql2";
import * as dotenv from "dotenv";

dotenv.config();

const db = mysql.createConnection({
   host: process.env.HOST,
   user: process.env.USER,
   password: process.env.PASSWORD,
   database: process.env.DB,
   multipleStatements: true,
});

db.connect((error) => {
   if (error) console.log("Couldn't connect to database");
   if (error) console.log(error);
   else console.log("Successfully connected to the database.");
});

export default db;