// Author: P.G.D.B.D Peramuna
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

  const baseURL = process.env.REACT_APP_BASE_URL;

  // handle user sign in, a form is used
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(""); // Reset the error state before submitting
    try {
      const response = await axios.post(`${baseURL}/api/User/add`, {
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
