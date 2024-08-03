import "./Patient.css";

const Patient = (props) => {
   const patientData = props.patientData[0];
   const firstName = patientData.patient_name.split(" ")[0];

   const logoutHandler = () => {
      props.setUserState("SignedOut");
   }

   return (
      <div className="patient-container">
         <h2>Hello, {firstName}</h2>
         <p>Your wait time is: <strong>{patientData.wait_time} minutes</strong></p>
         <button onClick={logoutHandler}>Log Out</button>
      </div>
   );
};

export default Patient;