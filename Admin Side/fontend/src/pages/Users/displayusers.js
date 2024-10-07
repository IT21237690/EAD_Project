import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.min.css';

function Display() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5008/api/User/all")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  function handleDelete(Email) {
    if (!Email) {
      console.log("Invalid Email");
      return;
    }

    fetch(`http://localhost:5008/api/User/delete/${encodeURIComponent(Email)}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete user");
        }
        setData((prevData) => prevData.filter((item) => item.Email !== Email));
        Swal.fire("Successfully Deleted");
      })
      .catch((err) => {
        console.error(err);
        Swal.fire("Failed to delete user");
      });
  }

  const filteredData = data.filter((user) =>
    user.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-center my-4">Users Dashboard</h1>
      <div className="container">
        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            aria-label="Search"
            aria-describedby="search-btn"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-outline-secondary" type="button" id="search-btn">
            Search
          </button>
          <Link to="/adduser" className="btn btn-primary ms-2">
            Add User
          </Link>
        </div>

      {/* Table */}
      <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered">
            <thead className="table-primary">
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Address</th>
            <th scope="col">Email</th>
            <th scope="col">Role</th>
            <th scope="col">Created Date</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((user) => (
            <tr key={user.Email}>
              <td>{user.Name}</td>
              <td>{user.Address}</td>
              <td>{user.Email}</td>
              <td>{user.Role}</td>
              <td>{new Date(user.CreatedDate).toLocaleDateString()}</td>
              <td className="d-flex justify-content-around">
                {/* Edit button */}
                <Link to={`/update/${user.Email}`}>
                <button
                      className="btn btn-sm btn-warning" id="EditButton">
                    Edit
                  </button>
                </Link>

                {/* Delete button */}
                <button
                  className="btn btn-sm btn-danger"
                  id="DeleteButton"
                  onClick={() => handleDelete(user.Email)}
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

export default Display;
