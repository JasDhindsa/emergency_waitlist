import { useEffect, useCallback, useState } from "react";
import "./Admin.css";

const Admin = ({ patientData, setPatientData, setUserState }) => {

   const [showModal, setShowModal] = useState(false);
   const [enableSubmit, setEnableSubmit] = useState(false);

   const [patientName, setPatientName] = useState(null);
   const [patientCode, setPatientCode] = useState(null);
   const [severity, setSeverity] = useState(null);

   const updatePatientData = useCallback(async () => {
      try {
         const response = await fetch("http://localhost:4000/patient/all");
         const data = await response.json();
         setPatientData(data);
      } catch (error) {
         console.log(error);
      }
   }, [setPatientData]);

   useEffect(() => {
      updatePatientData();
   }, [updatePatientData]);

   useEffect(() => {
      if (patientName && patientCode && severity) {
         setEnableSubmit(true);
      } else {
         setEnableSubmit(false);
      }
   }, [patientName, patientCode, severity]);

   const logoutHandler = () => {
      localStorage.removeItem("triage-admin-username");
      setUserState("SignedOut");
   }

   const admitHandler = async (patientId) => {
      try {
         await fetch("http://localhost:4000/patient/admit", {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({
               patientId: patientId
            })
         });
         updatePatientData();
      } catch (error) {
         console.log(error);
      }
   }

   const toggleModalHandler = () => {
      setShowModal((prevState) => !prevState);
   }

   const patientNameHandler = (event) => {
      setPatientName(event.target.value);
   }

   const patientCodeHandler = (event) => {
      setPatientCode(event.target.value);
   }

   const severityHandler = (event) => {
      setSeverity(event.target.value);
   }

   const addPatientHandler = async (event) => {
      if (!enableSubmit) {
         return;
      }
      event.preventDefault();
      console.log(patientName, patientCode, severity);
      try {
         await fetch("http://localhost:4000/patient/add", {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({
               patientData: {
                  name: patientName,
                  code: patientCode
               },
               triageData: {
                  severity: severity
               },
               adminUsername: localStorage.getItem("triage-admin-username")
            })
         });
         updatePatientData();
         toggleModalHandler();
      } catch (error) {
         console.log(error);
      }
   }

   return (
      <>
         <div className="admin-container">
            <h2>Viewing Patient Data ({localStorage.getItem("triage-admin-username")})</h2>
            <ul>
               {patientData.map((patient, index) => {
                  return (
                     <li key={index}>
                        <div>
                           <p>Name: {patient.patient_name}</p>
                           <p>Code: {patient.patient_code}</p>
                           <p>Severity: {patient.severity}</p>
                           <p>Wait Time: {patient.wait_time}</p>
                        </div>
                        <button className="admit-button" onClick={() => admitHandler(patient.patient_id)}>
                           Admit
                        </button>
                     </li>
                  );
               })}
            </ul>
            <button className="new-patient-btn" onClick={toggleModalHandler}>
               Add New Patient To Queue
            </button>
            <button onClick={logoutHandler}>Log Out</button>
         </div>
         {showModal && (
            <div className="modal-container">
               <div className="modal">
                  <h2>Add New Patient</h2>
                  <form onSubmit={addPatientHandler}>
                     <label htmlFor="patientName">Patient Name</label>
                     <input type="text" id="patientName" placeholder="John Smith" onChange={patientNameHandler}/>
                     <label htmlFor="patientCode">Patient Code</label>
                     <input type="text" id="patientCode" placeholder="JSP" onChange={patientCodeHandler}/>
                     <label htmlFor="severity">Severity</label>
                     <input type="number" id="severity" min="1" max="5" placeholder="1 to 5" onChange={severityHandler} />
                     <button type="submit" className={`add-patient-btn ${enableSubmit ? "" : " disable"}`}>
                        Add Patient
                     </button>
                  </form>
                  <button onClick={toggleModalHandler}>Close</button>
               </div>
            </div>
         )}
      </>
   );
}

export default Admin;