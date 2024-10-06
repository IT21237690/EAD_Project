import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

function UpdateUser() {
  const { id } = useParams(); // Assuming `id` is the email
  const [Name, setName] = useState('');
  const [Address, setAddress] = useState('');
  const [Email, setEmail] = useState('');
  const [Role, setRole] = useState('');
  const [CreatedDate, setCreatedDate] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5008/api/User/email/${id}`)
      .then(res => {
        const user = res.data;
        setName(user.Name);
        setAddress(user.Address);
        setEmail(user.Email);
        setRole(user.Role);
        setCreatedDate(user.CreatedDate);
      })
      .catch(err => console.log(err));
  }, [id]);

  function handleSubmit(e) {
    e.preventDefault();

    const updated = {
      Name,
      Address,
      Email,
      Role
    };
    
    axios.put(`http://localhost:5008/api/User/update/${Email}`, updated)
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
            <h4>Update User Details</h4>
          </div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="form-control"
              value={Name}
              onChange={(e) => setName(e.target.value)}
            />

            <label htmlFor="address" className="mt-2">Address</label>
            <input
              type="text"
              placeholder="Enter address"
              className="form-control"
              value={Address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <label htmlFor="email" className="mt-2">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              className="form-control"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly 
            />

            <label htmlFor="Role" className="mt-2">Role</label>
            <input
              type="text"
              placeholder="Enter Role"
              className="form-control"
              value={Role}
              onChange={(e) => setRole(e.target.value)}
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

export default UpdateUser;
