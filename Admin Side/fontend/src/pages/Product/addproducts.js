import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { toast, ToastContainer } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css';

const AddProduct = () => {
  const [productname, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const baseURL = process.env.REACT_APP_BASE_URL;

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError(""); // Reset the error state before submitting

    try {
      const token = localStorage.getItem("token");

      // Create FormData object
      const formData = new FormData();
      formData.append('Name', productname); 
      formData.append('Price', price);
      formData.append('Description', description);
      formData.append('Image', imageFile); 

      // Make the API request
      const response = await axios.post(`${baseURL}/api/Product/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, 
          accept: '*/*', 
        },
      });

      if (response.status === 201 || response.status === 200) {
        toast.success("Product added successfully!", {
          position: "top-center",
          autoClose: 3000,
        });

        navigate('/displayproducts'); 
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
    <div className="container d-flex justify-content-center align-items-center vh-100" style={{ background: "linear-gradient(to bottom, #f8f9fa, #e9ecef)" }}>
      <div className="col-md-4">
        <div className="card p-4 shadow-sm" style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}>
          <h3 className="text-center mb-4 text-primary">Add Product</h3>
          <form onSubmit={handleAddProduct}>
            <div className="mb-3">
              <label htmlFor="productname" className="form-label">Product Name</label>
              <input
                type="text"
                id="productname"
                className="form-control"
                placeholder="Enter Product Name"
                value={productname}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Product Description</label>
              <input
                type="text"
                id="description"
                className="form-control"
                placeholder="Enter Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">Price</label>
              <input
                type="number"
                id="price"
                className="form-control"
                placeholder="Enter Product Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label">Choose an image</label>
              <input
                type="file"
                className="form-control-file"
                id="image"
                accept=".jpg,.png,.jpeg"
                onChange={(e) => {
                  setImageFile(e.target.files[0]); // Set the selected file
                }}
              />
            </div>

            {error && <p className="text-danger text-center">{error}</p>}
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">Add</button>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};


export default AddProduct;
