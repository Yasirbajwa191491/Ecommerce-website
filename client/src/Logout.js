import React,{useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer} from 'react-toastify';
  import "react-toastify/dist/ReactToastify.css";

const Logout = () => {
    const navigate=useNavigate();
    useEffect(()=>{
        const logoutHandler=async()=>{
        const response=await axios.get("http://localhost:8000/logout",{
            withCredentials:true
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
        },[])
  return (
    <>
		<ToastContainer  />
    Logout Page</>
  )
}

export default Logout