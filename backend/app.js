import express from "express";
import bodyParser from "body-parser";
import adminRouter from "./routes/admin.js";
import patientRouter from "./routes/patient.js";
import db from "./db/db.js";

const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use((req, res, next) => {
   res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
   next();
});

app.use("/admin", adminRouter);
app.use("/patient", patientRouter);

app.listen(4000, () => {
   console.log("Server is running on port " + port);
});
