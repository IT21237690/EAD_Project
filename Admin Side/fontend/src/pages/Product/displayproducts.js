import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

function DisplayProducts() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5008/api/Product/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleCancel = async (Id) => {
    if (!Id) {
      console.log("Invalid ID");
      return;
    }

    try {
      await fetch(`http://localhost:5008/api/Product/cancel/${Id}`, {
        method: "DELETE",
      });
      setData((prevData) => prevData.filter((item) => item.Id !== Id));
      Swal.fire("Successfully Deleted", "Product has been deleted", "success");
    } catch (error) {
      console.error(error);
    }
  };

  //   const changeProductStatus = async (Id, currentStatus) => {
  //     let newStatus = currentStatus;

  //     if (currentStatus === "pending") {
  //       newStatus = "dispatched";
  //     } else if (currentStatus === "dispatched") {
  //       newStatus = "delivered";
  //     } else {
  //       Swal.fire('Already Delivered', 'This order has been completed', 'info');
  //       return;
  //     }

  //     try {
  //       const token = localStorage.getItem('token');
  //       await axios.put(`http://localhost:5008/api/Order/${Id}/status/${newStatus}`, null, {
  //         headers: {
  //           'Authorization': `Bearer ${token}`,
  //           'accept': '*/*',
  //         },
  //       });

  //       Swal.fire('Status Changed', `Order status changed to ${newStatus}`, 'success');

  //       const refreshedData = await axios.get("http://localhost:5008/api/Order/all", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       setData(refreshedData.data);

  //     } catch (error) {
  //       if (error.response && error.response.status === 403) {
  //         Swal.fire('Unauthorized Action', 'You do not have permission to change the status of this order.', 'error');
  //       } else {
  //         console.error(error);
  //         Swal.fire('Error', 'Unable to change status', 'error');
  //       }
  //     }
  //   };

  const filteredData = data.filter(
    (product) =>
      product.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
    //   ||
    //     product.Description.toLowerCase().includes(searchTerm.toLowerCase())
    //  ||
    // product.Price.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-center my-4">Product Dashboard</h1>
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
          <button
            className="btn btn-outline-secondary"
            type="button"
            id="search-btn"
          >
            Search
          </button>
          <Link to="/productadd" className="btn btn-primary ms-2">
            Add Product
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered">
            <thead className="table-primary">
              <tr>
                <th scope="col">Product Name</th>
                <th scope="col">Product Description</th>
                <th scope="col">Product Price</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((product) => (
                <tr key={product.ProductName}>
                  <td>{product.Description}</td>
                  <td>{product.Price}</td>
                  <td className="d-flex justify-content-around">
                    <Link to={`/updateproduct/${product.Id}`}>
                      <button
                        className="btn btn-sm btn-warning"
                        id="EditButton"
                      >
                        Edit
                      </button>
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleCancel(product.Id)}
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
}

export default DisplayProducts;
