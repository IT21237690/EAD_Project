import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation  } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Sidebar from "./components/Sidebar";
import "./new.css";
import { jwtDecode } from "jwt-decode";

// Pages and components
import Display from "./pages/displayusers";
import Addstudent from "./pages/studentadd";
import UpdateStudent from "./pages/updateuser";
import AdminPage from './pages/displayteacherReq';
import Addstaff from "./pages/staffadd";
import DisplayS from "./pages/displaystaff";
import Updatestaff from "./pages/updatestaff";
import DisplayT from "./pages/displayorders";
import Updateteacher from "./pages/updateteacher";
import DisplayInventory from "./pages/DisplayInventory";
import CreateInventory from "./pages/CreateInventory";
import UpdateInventory from "./pages/UpdateInventory";
import AddCourses from './pages/AddCourses/AddCourses';
import AllCourses from './pages/Allacourses/AllCourses';
import EditCourse from './pages/EditCourse/EditCourse';
import WatchCourses from './pages/WatchCourses/WatchCourses';
import Addnotice from "./pages/noticeadd";
import DisplayN from "./pages/displaynotice";
import Updatenotice from "./pages/updatenotice";
import Updateclass from "./pages/updateclass";
import Updatehall from "./pages/updatehall";
import Login from './pages/Login';  // Your login page

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
          {location.pathname !== "/login" && (
            <Col className="p-0 vh-100 sidebar" lg="2">
              <Sidebar />
            </Col>
          )}

          <Col className={location.pathname !== "/login" ? "p-0 my-container" : "p-0"} lg={location.pathname !== "/login" ? "10" : "12"}>
            <div className="pages">
              <Routes>
                <Route path="/login" element={<Login />} />
                {/* Add other protected routes here */}
                <Route path="/" element={<ProtectedRoute><Display /></ProtectedRoute>} />
                <Route path="/" element={<ProtectedRoute><Display /></ProtectedRoute>} />
                  <Route path="/addstudent" element={<ProtectedRoute><Addstudent /></ProtectedRoute>} />
                  <Route path="/update/:id" element={<ProtectedRoute><UpdateStudent /></ProtectedRoute>} />
                  <Route path="/adminreq" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
                  <Route path="/addstaff" element={<ProtectedRoute><Addstaff /></ProtectedRoute>} />
                  <Route path="/displaystaff" element={<ProtectedRoute><DisplayS /></ProtectedRoute>} />
                  <Route path="/updatestaff/:id" element={<ProtectedRoute><Updatestaff /></ProtectedRoute>} />
                  <Route path="/displayteacher" element={<ProtectedRoute><DisplayT /></ProtectedRoute>} />
                  <Route path="/updateteacher/:id" element={<ProtectedRoute><Updateteacher /></ProtectedRoute>} />
                  <Route path="/allCourse/addCourse" element={<ProtectedRoute><AddCourses /></ProtectedRoute>} />
                  <Route path="/allCourse" element={<ProtectedRoute><AllCourses /></ProtectedRoute>} />
                  <Route path="/allCourse/editCourse/:id" element={<ProtectedRoute><EditCourse /></ProtectedRoute>} />
                  <Route path="/Student_Courses" element={<ProtectedRoute><WatchCourses /></ProtectedRoute>} />
                  <Route path="/announcement/add" element={<ProtectedRoute><Addnotice /></ProtectedRoute>} />
                  <Route path="/announcement" element={<ProtectedRoute><DisplayN /></ProtectedRoute>} />
                  <Route path="/announcement/update/:id" element={<ProtectedRoute><Updatenotice /></ProtectedRoute>} />
                  <Route path="/InventoryManagment" element={<ProtectedRoute><DisplayInventory /></ProtectedRoute>} />
                  <Route path="/InventoryManagment/CreateInventory" element={<ProtectedRoute><CreateInventory /></ProtectedRoute>} />
                  <Route path="/InventoryManagment/UpdateInventory/:id" element={<ProtectedRoute><UpdateInventory /></ProtectedRoute>} />
                  <Route path="/updateclass/:id" element={<ProtectedRoute><Updateclass /></ProtectedRoute>} />
                  <Route path="/updatehall/:id" element={<ProtectedRoute><Updatehall /></ProtectedRoute>} />
              </Routes>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default App;



                  
