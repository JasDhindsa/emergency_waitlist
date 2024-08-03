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

patientRouter.post("/add", async (req, res) => {
   const { patientData, triageData, adminUsername } = req.body;
   try {
      const patients = await patientServices.addPatient(patientData, triageData, adminUsername);
      res.status(200).json(patients);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
});

patientRouter.patch("/admit", async (req, res) => {
   const { patientId } = req.body;
   try {
      await patientServices.admitPatient(patientId);
      res.status(200).json({ message: "Patient admitted" });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
});

export default patientRouter;
