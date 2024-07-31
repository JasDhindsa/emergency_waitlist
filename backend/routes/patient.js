import express from "express";
import patientServices from "../services/patient-services.js";

const patientRouter = express.Router();

patientRouter.post("/login", async (req, res) => {
   const { name, code } = req.body;
   try {
      const patient = await patientServices.getPatient(name, code);
      if (patient) {
         res.status(200).json(patient);
      } else {
         res.status(401).json({ message: "Invalid credentials" });
      }
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
});

patientRouter.get("/all", async (req, res) => {
   try {
      const patients = await patientServices.getAllPatientData();
      res.status(200).json(patients);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
});

export default patientRouter;
