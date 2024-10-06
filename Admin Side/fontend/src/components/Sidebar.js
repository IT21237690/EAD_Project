import React, { useEffect, useState } from "react";
import { SidebarData } from "./SidebarData";
import { Nav, ListGroup, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa"; // Importing an icon for logout

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false); // For mobile view

  useEffect(() => {
    const index = SidebarData.findIndex((item) => location.pathname === item.link);
    setActiveIndex(index !== -1 ? index : null);
  }, [location.pathname]); // Trigger effect on pathname change

  const routeTo = (path) => {
    navigate(path);
    setShowSidebar(false); // Close sidebar after navigating
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token
    navigate("/login"); // Redirect to login page
  };

  const toggleSidebar = () => setShowSidebar(!showSidebar); // Toggle sidebar visibility

  return (
    <>
      {/* Toggle button for mobile */}
      <Button
        variant="primary"
        className="d-lg-none m-3"
        onClick={toggleSidebar}
      >
        Toggle Sidebar
      </Button>

      {/* Sidebar */}
      <div className={`sidebar d-flex flex-column vh-100 bg-dark text-white p-3 ${showSidebar ? 'd-flex' : 'd-none d-lg-flex'}`}>
        <h2 className="text-center mb-4">Dashboard</h2>
        <Nav className="flex-grow-1">
          <ListGroup as="ul" className="w-100">
            {SidebarData.map((item, index) => (
              <ListGroup.Item
                as="li"
                action
                className={`py-3 px-4 text-center ${index === activeIndex ? "bg-primary text-white" : "bg-dark text-light"}`}
                key={index}
                onClick={() => routeTo(item.link)}
                style={{
                  borderRadius: "0.5rem",
                  transition: "background-color 0.3s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
              >
                <span className="mr-2">
                  <i className={item.icon}></i>
                </span>
                {item.title}
              </ListGroup.Item>
            ))}
            {/* Logout button as the last item */}
            <ListGroup.Item
              as="li"
              action
              className="py-3 px-4 text-center bg-dark text-light"
              onClick={handleLogout}
              style={{
                borderRadius: "0.5rem",
                transition: "background-color 0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#dc3545")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </ListGroup.Item>
          </ListGroup>
        </Nav>
      </div>

      {/* Mobile view: Render sidebar when showSidebar is true */}
      <div className={`d-lg-none ${showSidebar ? 'd-flex' : 'd-none'} flex-column vh-100 bg-dark text-white p-3`}>
        <Nav className="flex-grow-1">
          <ListGroup as="ul" className="w-100">
            {SidebarData.map((item, index) => (
              <ListGroup.Item
                as="li"
                action
                className={`py-3 px-4 text-center ${index === activeIndex ? "bg-primary text-white" : "bg-dark text-light"}`}
                key={index}
                onClick={() => routeTo(item.link)}
                style={{
                  borderRadius: "0.5rem",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
              >
                <span className="mr-2">
                  <i className={item.icon}></i>
                </span>
                {item.title}
              </ListGroup.Item>
            ))}
            {/* Logout button as the last item */}
            <ListGroup.Item
              as="li"
              action
              className="py-3 px-4 text-center bg-dark text-light"
              onClick={handleLogout}
              style={{
                borderRadius: "0.5rem",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#dc3545")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </ListGroup.Item>
          </ListGroup>
        </Nav>
      </div>
    </>
  );
}

export default Sidebar;
