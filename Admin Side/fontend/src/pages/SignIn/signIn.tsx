// import React, { useState } from 'react'
// import { NavLink } from "react-router-dom"
// import { ToastContainer, toast } from 'react-toastify';
// import { useNavigate} from "react-router-dom"
// import 'react-toastify/dist/ReactToastify.css';
// // import "./mix.css"

// const SignIn = () => {

//     const history = useNavigate();

//     const [passShow, setPassShow] = useState(false);
//     // const [cpassShow, setCPassShow] = useState(false);

//     const [inpval, setInpval] = useState({
//         Name: "",
//         Address: "",
//         Email: "",
//         Role: "",
//         Password: "",

//     });

//     const setVal = (e) => {
//         // console.log(e.target.value);
//         const { Name, value } = e.target;

//         setInpval(() => {
//             return {
//                 ...inpval,
//                 [Name]: value
//             }
//         })
//     };

//     const addUserdata = async (e) => {
//         e.preventDefault();

//         const { Name,Address,Email, Role, Password } = inpval;

//         if (Name === "") {
//             toast.warning(" Name is required!", {
//                 position: "top-center"
//             });

//         }else if(Address === "") {
//             toast.warning("Address is required!", {
//                 position: "top-center"
//             });

//         }else if(Role === "") {
//             toast.warning("Role is required!", {
//                 position: "top-center"
//             });

//         }
//          else if (Email === "") {
//             toast.error("Email is required!", {
//                 position: "top-center"
//             });
//         } else if (!Email.includes("@")) {
//             toast.warning("includes @ in your email!", {
//                 position: "top-center"
//             });
//         } else if (Password === "") {
//             toast.error("Password is required!", {
//                 position: "top-center"
//             });
//         } else if (Password.length < 6) {
//             toast.error("password must be 6 char!", {
//                 position: "top-center"
//             });
//         }
//         // else if (cpassword === "") {
//         //     toast.error("confirm password is required!", {
//         //         position: "top-center"
//         //     });
//         // }
//         // else if (cpassword.length < 6) {
//         //     toast.error("confirm password must be 6 char!", {
//         //         position: "top-center"
//         //     });
//         // } else if (password !== cpassword) {
//         //     toast.error("password and confirm password are not matching!", {
//         //         position: "top-center"
//         //     });
//         // }
//          else {
//             console.log("user registration succesfully done");

//             const data = await fetch("/User/add", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({
//                     Name,Address,Email,Role,Password
//                 })
//             });

//             const res = await data.json();

//             if (res.status === 201) {
//                 toast.success("Registration Successful! Please login", {
//                   position: "top-center",
//                   autoClose: 3000,
//                 });
//                 setTimeout(() => {
//                   history("/");
//                 }, 3000);
//               } else if (res.status === 422) {
//                 toast.success("Email Already Exits", {
//                   position: "top-center",
//                   autoClose: 3000,
//                 });
//             }else {
//                 toast.error("Registration Failed", {
//                   position: "top-center",
//                   autoClose: 3000,
//                 });
//                 setInpval({ ...inpval, Name: "",Address:"",Email: "",Role:"",Password: "" });
//             }
//         }
//     }

//     return (
//         <>
//             <section>
//                 <div className="form_data">
//                     <div className="form_heading">
//                         <h1>Sign Up</h1>
//                     </div>
//                     <form>

//                         <div className="form_input">
//                             <label htmlFor="name">Name</label>
//                             <input type="text" onChange={setVal} value={inpval.Name} name="Name" id="name" placeholder='Enter Your Last Name' />
//                         </div>
//                         <div className="form_input">
//                             <label htmlFor="address">Address</label>
//                             <input type="text" onChange={setVal} value={inpval.Address} name="Address" id="address" placeholder='Enter Your Address' />
//                         </div>
//                         <div className="form_input">
//                             <label htmlFor="email">Email</label>
//                             <input type="email" onChange={setVal} value={inpval.Email} name="Email" id="email" placeholder='Enter Your Email Address' />
//                         </div>
//                         <div className="form_input">
//                             <label htmlFor="securityAnswer">Enter the Role</label>
//                             <input type="text" onChange={setVal} value={inpval.Role} name="Role" id="role" placeholder='Enter Your role' />
//                         </div>
//                         <div className="form_input">
//                             <label htmlFor="password">Password</label>
//                             <div className="two">
//                                 <input type={!passShow ? "password" : "text"} value={inpval.Password} onChange={setVal} name="Password" id="password" placeholder='Enter Your password' />
//                                 <div className="showpass" onClick={() => setPassShow(!passShow)}>
//                                     {!passShow ? "Show" : "Hide"}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* <div className="form_input">
//                             <label htmlFor="password">Confirm Password</label>
//                             <div className="two">
//                                 <input type={!cpassShow ? "password" : "text"} value={inpval.cpassword} onChange={setVal} name="cpassword" id="cpassword" placeholder='Confirm password' />
//                                 <div className="showpass" onClick={() => setCPassShow(!cpassShow)}>
//                                     {!cpassShow ? "Show" : "Hide"}
//                                 </div>
//                             </div>
//                         </div> */}

//                         <button className='btn' onClick={addUserdata}>Sign Up</button>
//                         <p>Already have an account? <NavLink to="/">Log In</NavLink></p>
//                     </form>
//                     <ToastContainer />
//                 </div>
//             </section>
//         </>
//     )
// }

// export default SignIn

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { toast, ToastContainer } from "react-toastify"; // Import 'ToastContainer' and 'toast'
import 'react-toastify/dist/ReactToastify.css';
const SignIn = () => {
  const[name,setName]= useState("");
  const[address,setAddress]=useState("");
  const [email, setEmail] = useState("");
  const[role,setRole]=useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(""); // Reset the error state before submitting
    try {
      const response = await axios.post("http://localhost:5008/api/User/add", {
        name,
        address,
        email,
        role,
        password,
      });
      // Check if the status is 200 (OK)
      if (response.status === 201) {
        // Display a success toast notification
        toast.success("User added successfully!", {
          position: "top-center", // Use string values directly, like 'top-center'
          autoClose: 3000, 
        });
      }
      // Access the token using "Token" as per your response format
      //   const token = response.data.Token;

      //   if (token) {
      //     localStorage.setItem("token", token); // Store token in localStorage

      //     // Decode token to check role
      //     const decodedToken = jwtDecode (token);
      //     const role = decodedToken.role;

      //     if (role === "admin") {
      //       navigate("/"); // Redirect to the dashboard or main page
      //     } else {
      //       setError("You are not authorized to access this page.");
      //     }
      //   } else {
      //     setError("Login failed. Please try again.");
      //   }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || "Invalid credentials");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-4">
        <div className="card p-4 shadow-sm">
          <h3 className="text-center mb-4">Sign Up</h3>
          <form onSubmit={handleSignIn}>
            <div className="mb-3">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                className="form-control"
                placeholder="Enter Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="name">Address</label>
              <input
                type="text"
                id="addreess"
                className="form-control"
                placeholder="Enter Your Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="name">Role</label>
              <input
                type="text"
                id="role"
                className="form-control"
                placeholder="Enter Your Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-danger">{error}</p>}
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">
                Sign Up
              </button>
            </div>
            <p>Already have an account? <NavLink to="/login">Log In</NavLink></p>

          </form>
          <ToastContainer />

        </div>
      </div>
      <div className="d-grid gap-2"></div>
    </div>
  );
};

export default SignIn;
