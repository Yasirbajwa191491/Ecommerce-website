import HeroSection from "./components/HeroSection";
import { useProductContext } from "./context/productcontex";
import { useEffect,useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const About = () => {
  const [mydata,setMyData]=useState({});
  const navigate=useNavigate();
  const { myName } = useProductContext();

  
  const data = {
    name: "Yasir store",
    data:mydata.name
  };
  useEffect(()=>{
    const secureHandler=async()=>{
      try {
        const response=await axios.get("http://localhost:8000/secure",{
          withCredentials:true
        })
        if(response.status===200){
      setMyData(response.data)
        }else{
          navigate("/")
        }
    }catch(err){
      navigate("/")
      console.log(err);
    }
  }
    secureHandler()
  },[]);
  return (
    <>
      {myName}
      <HeroSection myData={data} />
    </>
  );
};

export default About;
