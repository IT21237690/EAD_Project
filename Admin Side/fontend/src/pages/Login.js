import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import 'bootstrap/dist/css/bootstrap.min.css';


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset the error state before submitting
    try {
      const response = await axios.post("http://localhost:5008/api/User/login", {
        email,
        password,
      });

      // Access the token using "Token" as per your response format
      const token = response.data.Token;

      if (token) {
        localStorage.setItem("token", token); // Store token in localStorage

        // Decode token to check role
        const decodedToken = jwtDecode (token);
        const role = decodedToken.role;

        if (role === "admin") {
          navigate("/"); // Redirect to the dashboard or main page
        } else {
          setError("You are not authorized to access this page.");
        }
      } else {
        setError("Login failed. Please try again.");
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
          <h3 className="text-center mb-4">Login</h3>
          <form onSubmit={handleLogin}>
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
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}  

export default Login;
