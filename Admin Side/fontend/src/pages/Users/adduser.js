// Author: P.G.D.B.D Peramuna
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Adding a user is done using a form here, users can be added accordingly and they are given access
const AddUser = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const baseURL = process.env.REACT_APP_BASE_URL;

  const handleAddUser = async (e) => {
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
          <h3 className="text-center mb-4">Add User</h3>
          <form onSubmit={handleAddUser}>
            <div className="mb-3">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                className="form-control"
                placeholder="Enter Name"
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
                placeholder="Enter Address"
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
                placeholder="Enter email"
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
                placeholder="Enter Role"
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
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-danger">{error}</p>}
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">
                Add
              </button>
            </div>
           
          </form>
          <ToastContainer />
        </div>
      </div>
      <div className="d-grid gap-2"></div>
    </div>
  );
};

export default AddUser;
