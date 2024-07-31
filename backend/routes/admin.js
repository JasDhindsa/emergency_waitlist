import express from "express";
import adminServices from "../services/admin-services.js";

const adminRouter = express.Router();

adminRouter.post("/login", async (req, res) => {
   const { username, password } = req.body;
   try {
      const admin = await adminServices.getAdmin(username, password);
      if (admin) {
         res.status(200).json(admin);
      } else {
         res.status(401).json({ message: "Invalid credentials" });
      }
   } catch(error) {
      res.status(500).json({ message: error.message });
   }
});

export default adminRouter;