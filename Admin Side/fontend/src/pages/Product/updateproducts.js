import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

function UpdateProduct() {
  const { id } = useParams(); // Assuming `id` is the email
  const[productname,setProductName]= useState("");
  const[description,setDescription]=useState("");
  const [price, setPrice] = useState("");


  useEffect(() => {
    axios.get(`http://localhost:5008/api/Product/id/${id}`)
      .then(res => {
        const user = res.data;
        setProductName(user.productname);
        setDescription(user.description);
        setPrice(user.price);
      })
      .catch(err => console.log(err));
  }, [id]);

  function handleSubmit(e) {
    e.preventDefault();

    const updated = {
      productname,
      description,
      price,
    };
    
    axios.put(`http://localhost:5008/api/Product/update/${id}`, updated)
      .then(res => {
        alert(res.data);
      })
      .catch(err => {
        alert(err.message);
      });
  }

  return (
    <section>
      <div className="container col-lg-5">
        <form onSubmit={handleSubmit}>
          <div className="form-group py-3">
            <h4>Update Product Details</h4>
          </div>
          <div className="form-group">
            <label htmlFor="productname">Product Name</label>
            <input
              type="text"
              className="form-control"
              value={productname}
              onChange={(e) => setProductName(e.target.value)}
            />

            <label htmlFor="description" className="mt-2">Product Description</label>
            <input
              type="text"
              placeholder="Enter description"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label htmlFor="price" className="mt-2">Product Price</label>
            <input
              type="text"
              placeholder="Enter price"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              readOnly 
            />

            
          </div>
          <button className="btn btn-success mt-2">Save</button>
        </form>
        <br />
        <Link to="/addstudent" className="btn btn-success">Add User</Link>
      </div>
    </section>
  );
};

export default UpdateProduct;
