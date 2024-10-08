import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

// Display product details in table, also include delete product
function DisplayProducts() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const baseURL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${baseURL}/api/Product/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log("Fetched products:", response.data); // Log fetched data
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);
  

  const handleDelete = async (Id) => {
    console.log("Product ID received for deletion:", Id); 
    if (!Id) {
      console.log("Invalid ID");
      return;
    }
  
    const token = localStorage.getItem('token');
    console.log("Deleting product with ID:", Id);
  
    try {
      const response = await fetch(`${baseURL}/api/Product/delete/${Id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Delete failed:", errorMessage);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      setData((prevData) => prevData.filter((item) => item.Id !== Id));
      Swal.fire("Successfully Deleted", "Product has been deleted", "success");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  



  const filteredData = data.filter(
    (product) =>
      product.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-center my-4">Product Dashboard</h1>
      <div className="container">
        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search product Name"
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
                <th scope="col">Image</th>
                <th scope="col">Product Price</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((product) => (
                <tr key={product.Id}>
                  <td>{product.ProductName}</td>
                  <td>{product.Description}</td>
                  <td style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <img 
                      src={`data:image/jpeg;base64,${product.ImageBase64}`} 
                      alt={product.ProductName} 
                      style={{ width: "100px", height: "100px" }} 
                    />
                  </td>
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
                      onClick={() => handleDelete(product.Id)}
                    >
                      Delete
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
