import React,{useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer} from 'react-toastify';
  import "react-toastify/dist/ReactToastify.css";

const Logout = () => {
    const navigate=useNavigate();
    useEffect(()=>{
        const logoutHandler=async()=>{
        const response=await axios.get("/logoutUser",{
          headers: {
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("yasir-ecommerce-token")),
            'Content-Type': 'application/json'
          }
        })
        if(response.data.message="logout success"){
            toast.success("Logout Successfully", {
				position: toast.POSITION.TOP_RIGHT
			  });
            localStorage.clear();
            setTimeout(()=>{
				navigate("/")
			},500)
        }
        }
        logoutHandler();
        },[navigate])
  return (
    <>
		<ToastContainer  />
    Logout Page</>
  )
}

export default Logout