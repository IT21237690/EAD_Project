import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";


// This is to update prduct, a form format is used
function UpdateProduct() {
  const { id } = useParams();
  const [productname, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");

  const baseURL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    axios
      .get(`${baseURL}/api/Product/id/${id}`)
      .then((res) => {
        const product = res.data;
        setProductName(product.ProductName);
        setDescription(product.Description);
        setCategory(product.Category);
        setPrice(product.Price);
        setExistingImage(product.ImageBase64); // Set existing image URL

        // Debugging: Log the existing image data
        console.log("Existing Image Data:", product.Image);
      })
      .catch((err) => console.log(err));
  }, [id]);

  function handleSubmit(e) {
    e.preventDefault();

    // Create FormData object
    const formData = new FormData();
    formData.append("Name", productname);
    formData.append("Price", price);
    formData.append("Description", description);
    formData.append("Category", category);
    if (image) {
      // Append the new image if it exists
      formData.append("Image", image);
    }

    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .put(`${baseURL}/api/Product/update/${id}`, formData, config)
      .then((res) => {
        alert(res.data);
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  const handleImageClick = () => {
    document.getElementById("imageUpload").click(); // Trigger file input click
  };

  return (
    <section className="py-5 bg-light">
      <div className="container col-lg-6">
        <h4 className="text-center mb-4">Update Product Details</h4>
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
          <div className="form-group">
            <label htmlFor="productname">Product Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Product Name"
              value={productname}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="mt-2">
              Product Description
            </label>
            <input
              type="text"
              placeholder="Enter description"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category" className="mt-2">
              Product Category
            </label>
            <input
              type="text"
              placeholder="Enter category"
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="price" className="mt-2">
              Product Price
            </label>
            <input
              type="text"
              placeholder="Enter price"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image" className="mt-2">
              Choose an image:
            </label>
            <div
              className="d-flex align-items-center cursor-pointer"
              onClick={handleImageClick}
            >
              {/* Display the existing image */}
              {existingImage && (
                <img
                  src={`data:image/jpeg;base64,${existingImage}`}
                  alt={productname}
                  className="img-thumbnail me-2"
                  style={{ width: "100px", height: "100px" }}
                />
              )}
              <input
                type="file"
                className="form-control-file mt-2"
                id="imageUpload"
                accept=".jpg,.png,.jpeg"
                onChange={(e) => {
                  setImage(e.target.files[0]); // Set the selected file
                }}
                style={{ display: "none" }} // Hide the file input
              />
              <span className="btn btn-secondary">Upload New Image</span>
            </div>
          </div>

          <button className="btn btn-success mt-3 w-100">Save</button>
        </form>
        <br />
      </div>
    </section>
  );
}

export default UpdateProduct;
