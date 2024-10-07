// import React, { useState } from 'react'
// import { NavLink } from "react-router-dom"
// import { ToastContainer, toast } from 'react-toastify';
// import { useNavigate} from "react-router-dom"
// import 'react-toastify/dist/ReactToastify.css';
// // import "./mix.css"

// const SignIn = () => {

//     const history = useNavigate();

//     const [passShow, setPassShow] = useState(false);
//     // const [cpassShow, setCPassShow] = useState(false);

//     const [inpval, setInpval] = useState({
//         Name: "",
//         Address: "",
//         Email: "",
//         Role: "",
//         Password: "",

//     });

//     const setVal = (e) => {
//         // console.log(e.target.value);
//         const { Name, value } = e.target;

//         setInpval(() => {
//             return {
//                 ...inpval,
//                 [Name]: value
//             }
//         })
//     };

//     const addUserdata = async (e) => {
//         e.preventDefault();

//         const { Name,Address,Email, Role, Password } = inpval;

//         if (Name === "") {
//             toast.warning(" Name is required!", {
//                 position: "top-center"
//             });

//         }else if(Address === "") {
//             toast.warning("Address is required!", {
//                 position: "top-center"
//             });

//         }else if(Role === "") {
//             toast.warning("Role is required!", {
//                 position: "top-center"
//             });

//         }
//          else if (Email === "") {
//             toast.error("Email is required!", {
//                 position: "top-center"
//             });
//         } else if (!Email.includes("@")) {
//             toast.warning("includes @ in your email!", {
//                 position: "top-center"
//             });
//         } else if (Password === "") {
//             toast.error("Password is required!", {
//                 position: "top-center"
//             });
//         } else if (Password.length < 6) {
//             toast.error("password must be 6 char!", {
//                 position: "top-center"
//             });
//         }
//         // else if (cpassword === "") {
//         //     toast.error("confirm password is required!", {
//         //         position: "top-center"
//         //     });
//         // }
//         // else if (cpassword.length < 6) {
//         //     toast.error("confirm password must be 6 char!", {
//         //         position: "top-center"
//         //     });
//         // } else if (password !== cpassword) {
//         //     toast.error("password and confirm password are not matching!", {
//         //         position: "top-center"
//         //     });
//         // }
//          else {
//             console.log("user registration succesfully done");

//             const data = await fetch("/User/add", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({
//                     Name,Address,Email,Role,Password
//                 })
//             });

//             const res = await data.json();

//             if (res.status === 201) {
//                 toast.success("Registration Successful! Please login", {
//                   position: "top-center",
//                   autoClose: 3000,
//                 });
//                 setTimeout(() => {
//                   history("/");
//                 }, 3000);
//               } else if (res.status === 422) {
//                 toast.success("Email Already Exits", {
//                   position: "top-center",
//                   autoClose: 3000,
//                 });
//             }else {
//                 toast.error("Registration Failed", {
//                   position: "top-center",
//                   autoClose: 3000,
//                 });
//                 setInpval({ ...inpval, Name: "",Address:"",Email: "",Role:"",Password: "" });
//             }
//         }
//     }

//     return (
//         <>
//             <section>
//                 <div className="form_data">
//                     <div className="form_heading">
//                         <h1>Sign Up</h1>
//                     </div>
//                     <form>

//                         <div className="form_input">
//                             <label htmlFor="name">Name</label>
//                             <input type="text" onChange={setVal} value={inpval.Name} name="Name" id="name" placeholder='Enter Your Last Name' />
//                         </div>
//                         <div className="form_input">
//                             <label htmlFor="address">Address</label>
//                             <input type="text" onChange={setVal} value={inpval.Address} name="Address" id="address" placeholder='Enter Your Address' />
//                         </div>
//                         <div className="form_input">
//                             <label htmlFor="email">Email</label>
//                             <input type="email" onChange={setVal} value={inpval.Email} name="Email" id="email" placeholder='Enter Your Email Address' />
//                         </div>
//                         <div className="form_input">
//                             <label htmlFor="securityAnswer">Enter the Role</label>
//                             <input type="text" onChange={setVal} value={inpval.Role} name="Role" id="role" placeholder='Enter Your role' />
//                         </div>
//                         <div className="form_input">
//                             <label htmlFor="password">Password</label>
//                             <div className="two">
//                                 <input type={!passShow ? "password" : "text"} value={inpval.Password} onChange={setVal} name="Password" id="password" placeholder='Enter Your password' />
//                                 <div className="showpass" onClick={() => setPassShow(!passShow)}>
//                                     {!passShow ? "Show" : "Hide"}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* <div className="form_input">
//                             <label htmlFor="password">Confirm Password</label>
//                             <div className="two">
//                                 <input type={!cpassShow ? "password" : "text"} value={inpval.cpassword} onChange={setVal} name="cpassword" id="cpassword" placeholder='Confirm password' />
//                                 <div className="showpass" onClick={() => setCPassShow(!cpassShow)}>
//                                     {!cpassShow ? "Show" : "Hide"}
//                                 </div>
//                             </div>
//                         </div> */}

//                         <button className='btn' onClick={addUserdata}>Sign Up</button>
//                         <p>Already have an account? <NavLink to="/">Log In</NavLink></p>
//                     </form>
//                     <ToastContainer />
//                 </div>
//             </section>
//         </>
//     )
// }

// export default SignIn

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { toast, ToastContainer } from "react-toastify"; // Import 'ToastContainer' and 'toast'
import 'react-toastify/dist/ReactToastify.css';
const AddProduct = () => {
  const[productname,setProductName]= useState("");
  const[description,setDescription]=useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError(""); // Reset the error state before submitting
    try {
        const token = localStorage.getItem("token");

      const response = await axios.post("http://localhost:5008/api/Product/add", {
        productname,
        description,
        price,
        imageFile,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      // Check if the status is 200 (OK)
      if (response.status === 201) {
        // Display a success toast notification
        toast.success("Product added successfully!", {
          position: "top-center", // Use string values directly, like 'top-center'
          autoClose: 3000, 
        });
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
                setImageFile(e.target.files[0])
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
