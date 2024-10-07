import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation  } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Sidebar from "./components/Sidebar";
import "./new.css";
import { jwtDecode } from "jwt-decode";

// Pages and components
import Display from "./pages/Users/displayusers.js";
import UpdateUser from "./pages/Users/updateuser.js";

import DisplayOrders from "./pages/Orders/displayorders.js";

import SignIn from "./pages/SignIn/signIn.js";
import Login from './pages/Login/Login.js';  

// Product 
import DisplayProducts from "./pages/Product/displayproducts.js";
import AddProduct from "./pages/Product/addproducts.js";
import UpdateProduct from "./pages/Product/updateproducts.js";



// ProtectedRoute component to guard routes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // If no token is present, redirect to login
    return <Navigate to="/login" />;
  }

  try {
    // Decode token to check the role
    const decodedToken = jwtDecode(token);
    const role = decodedToken.role;

    // Allow only if the role is admin
    if (role !== "admin") {
      return <Navigate to="/login" />;
    }

    return children; // Render the children (protected routes)
  } catch (error) {
    return <Navigate to="/login" />;
  }
};

function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}

function MainApp() {
  const location = useLocation(); // Get the current path

  return (
    <div className="App">
      <div>
        <Row>
          {/* Only show Sidebar if not on login page */}
          {location.pathname !== "/login" && location.pathname !== "/useradd" && (
            <Col className="p-0 vh-100 sidebar" lg="2">
              <Sidebar />
            </Col>
          )}

          <Col className={location.pathname !== "/login" ? "p-0 my-container" : "p-0"} lg={location.pathname !== "/login" ? "10" : "12"}>
            <div className="pages">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/useradd" element={<SignIn />} />

                {/* Add other protected routes here */}
                <Route path="/" element={<ProtectedRoute><Display /></ProtectedRoute>} />
                <Route path="/" element={<ProtectedRoute><Display /></ProtectedRoute>} />
                  <Route path="/update/:id" element={<ProtectedRoute><UpdateUser /></ProtectedRoute>} />
                  
                  <Route path="/displayorders" element={<ProtectedRoute><DisplayOrders /></ProtectedRoute>} />
                  <Route path="/displayproducts" element={<ProtectedRoute><DisplayProducts /></ProtectedRoute>} />
                  <Route path="/productadd" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
                  <Route path="/updateproduct/:id" element={<ProtectedRoute><UpdateProduct /></ProtectedRoute>} />

              </Routes>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default App;



                  
