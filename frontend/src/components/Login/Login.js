import { useState } from "react";
import "./Login.css";

const PATIENT = "Patient";
const ADMIN = "Admin";

const Login = (props) => {
   const [loginUser, setLoginUser] = useState(PATIENT);
   const [error, setError] = useState(null);

   const changeLoginUserHandler = () => {
      setLoginUser((prevLoginUser) => {
         if (prevLoginUser === PATIENT) {
            return ADMIN;
         } else if (prevLoginUser === ADMIN) {
            return PATIENT;
         }
      });
   };

   const patientSubmitHandler = async (event) => {
      event.preventDefault();
      try {
         const response = await fetch("http://localhost:4000/patient/login", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: event.target[0].value,
               code: event.target[1].value,
            }),
         });
         const data = await response.json();
         console.log(data);
         if(!data.message) {
            props.setUserState(PATIENT);
            props.setPatientData(data);
         } else {
            setError(data.message + ". Please try again.");
         }
      } catch (error) {
         console.log(error);
      }
   };

   const adminSubmitHandler = async (event) => {
      event.preventDefault();
      try {
         const response = await fetch("http://localhost:4000/admin/login", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               username: event.target[0].value,
               password: event.target[1].value,
            }),
         });
         const data = await response.json();
         console.log(data);
         if (!data.message) {
            props.setUserState(ADMIN);
            localStorage.setItem("triage-admin-username", data.username);
         } else {
            setError(data.message + ". Please try again.");
         }
      } catch (error) {
         console.log(error);
      }
   };

   const removeError = () => {
      setError(null);
   }

   let title;
   let form;
   let otherLoginUser;
   if (loginUser === PATIENT) {
      title = "Check Your Wait Time (Patient)";
      form = (
         <form onSubmit={patientSubmitHandler}>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" placeholder="e.g. Alice Johnson" onChange={removeError} required />
            <label htmlFor="code">3-Letter Code:</label>
            <input type="text" id="code" name="code" placeholder="e.g. AJN" onChange={removeError} required />
            <button type="submit" className={`login ${error ? "error" : ""}`}>
               {error ? error : "Login"}
            </button>
         </form>
      );
      otherLoginUser = ADMIN;
   } else if (loginUser === ADMIN) {
      title = "View All Patient Data (Admin)";
      form = (
         <form onSubmit={adminSubmitHandler}>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" placeholder="e.g. admin-1" onChange={removeError} required />
            <label htmlFor="password">Password</label>
            <input type="text" id="code" name="code" placeholder="e.g. password1" onChange={removeError} required />
            <button type="submit" className={`login ${error ? "error" : ""}`}>
               {error ? error : "Login"}
            </button>
         </form>
      );
      otherLoginUser = PATIENT;
   }

   return (
      <section className="form-container border-radius-lg">
         <h2>{title}</h2>
         {form}
         <button className="switch-user-btn" onClick={changeLoginUserHandler}>Login As {otherLoginUser} Instead</button>
      </section>
   );
};

export default Login;
