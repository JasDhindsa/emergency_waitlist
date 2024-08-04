import { useState } from "react";
import Login from "./components/Login/Login";
import Patient from "./components/Patient/Patient";
import Admin from "./components/Admin/Admin";

const SIGNED_OUT = "SignedOut";
const PATIENT = "Patient";
const ADMIN = "Admin"

function App() {

   const [user, setUser] = useState(SIGNED_OUT);
   const [patientData, setPatientData] = useState([]);

   let content;
   if (user === SIGNED_OUT) {
      content = <Login setUserState={setUser} setPatientData={setPatientData} />;
   } else if (user === PATIENT) {
      content = <Patient patientData={patientData} setUserState={setUser} />
   } else if (user === ADMIN) {
      content = <Admin patientData={patientData} setPatientData={setPatientData} setUserState={setUser} />
   }

   return content;
}

export default App;
