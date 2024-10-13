// Author: P.G.D.B.D Peramuna
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';


// This is to display orders in a table, also this includes edit and delete of the order together with status change
function DisplayOrders() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const baseURL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseURL}/api/Order/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleCancel = async (Id) => {
    if (!Id) {
      console.log('Invalid ID');
      return;
    }

    try {
      await fetch(`${baseURL}/api/Order/cancel/${Id}`, {
        method: "DELETE",
      });
      setData((prevData) => prevData.filter(item => item.Id !== Id));
      Swal.fire('Successfully Deleted', 'Order has been cancelled', 'success');
    } catch (error) {
      console.error(error);
    }
  };

  const changeOrderStatus = async (Id, currentStatus) => {
    let newStatus = currentStatus;
  
    if (currentStatus === "pending") {
      newStatus = "dispatched";
    } else if (currentStatus === "dispatched") {
      newStatus = "delivered";
    } else {
      Swal.fire('Already Delivered', 'This order has been completed', 'info');
      return; 
    }
  
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${baseURL}/api/Order/${Id}/status/${newStatus}`, null, {
        headers: {
          'Authorization': `Bearer ${token}`, 
          'accept': '*/*',
        },
      });
  
      Swal.fire('Status Changed', `Order status changed to ${newStatus}`, 'success');
  
      const refreshedData = await axios.get(`${baseURL}/api/Order/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(refreshedData.data);
  
    } catch (error) {
      if (error.response && error.response.status === 403) {
        Swal.fire('Unauthorized Action', 'You do not have permission to change the status of this order.', 'error');
      } else {
        console.error(error);
        Swal.fire('Error', 'Unable to change status', 'error');
      }
    }
  };

  const filteredData = data.filter((order) =>
    order.ProductId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.CustomerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.Id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh", padding: "20px" }}>
      <h1 className="text-center my-4">Orders Dashboard</h1>
      <div className="container">
        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by order ID, customer email, or product ID"
            aria-label="Search"
            aria-describedby="search-btn"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-outline-secondary" type="button" id="search-btn">
            Search
          </button>
        </div>

        <div className="table-responsive">
        <table className="table table-bordered" style={{ backgroundColor: "white" }}>
          <thead className="table-primary" style={{ backgroundColor: "white", color: "black" }}>
              <tr>
                <th scope="col">Order ID</th>
                <th scope="col">Customer Email</th>
                <th scope="col">Customer Address</th>
                <th scope="col">Product ID</th>
                <th scope="col">Total Amount</th>
                <th scope="col">Status</th>
                <th scope="col">Created Date</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((order) => (
                <tr key={order.Id}>
                  <td>{order.Id}</td>
                  <td>{order.CustomerEmail}</td>
                  <td>{order.CustomerAddress}</td>
                  <td>{order.ProductId}</td>
                  <td>{order.TotalAmount}</td>
                  <td>{order.Status}</td>
                  <td>{new Date(order.CreatedDate).toLocaleDateString()}</td>
                  <td className="d-flex justify-content-around">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => changeOrderStatus(order.Id, order.Status)}
                    >
                      Change Status
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleCancel(order.Id)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DisplayOrders;
