import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { toast, ToastContainer } from "react-toastify"; // Import 'ToastContainer' and 'toast'
import 'react-toastify/dist/ReactToastify.css';

const AddProduct = () => {
  const [productname, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError(""); // Reset the error state before submitting

    try {
      const token = localStorage.getItem("token");

      // Create FormData object
      const formData = new FormData();
      formData.append('Name', productname); // Ensures 'Name' key in FormData
      formData.append('Price', price); // Ensures 'Price' key in FormData
      formData.append('Description', description); // Ensures 'Description' key in FormData
      formData.append('Image', imageFile); // Ensures 'Image' key in FormData

      // Make the API request
      const response = await axios.post("http://localhost:5008/api/Product/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include Bearer token
          accept: '*/*', // Add accept header
        },
      });

      // Check if the status is 201 (Created)
      if (response.status === 201) {
        // Display a success toast notification
        toast.success("Product added successfully!", {
          position: "top-center",
          autoClose: 3000,
        });

        // Optionally, navigate to another page or reset the form
        // navigate('/products'); // Uncomment this to navigate after success
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
          <h3 className="text-center mb-4">Add Product</h3>
          <form onSubmit={handleAddProduct}>
            <div className="mb-3">
              <label htmlFor="name">Product Name</label>
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
              <label htmlFor="description">Product Description</label>
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
              <label htmlFor="price" className="form-label">
                Price
              </label>
              <input
                type="text"
                id="price"
                className="form-control"
                placeholder="Enter Product Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <label htmlFor="image">Choose an image:</label>
            <input
              type="file"
              className="form-control-file mt-2"
              id="image"
              accept=".jpg,.png, .jpeg"
              onChange={(e) => {
                setImageFile(e.target.files[0]); // Set the selected file
              }}
            />
            
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

export default AddProduct;
