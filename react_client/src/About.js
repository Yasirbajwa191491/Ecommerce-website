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
        const response = await axios.get('/secure', {
          headers: {
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("yasir-ecommerce-token")),
            'Content-Type': 'application/json'
          }
        });
        if(response.data.message==='Access token is valid'){
        }else{
          navigate("/")
        }
    }catch(err){
      navigate("/")
      console.log(err);
    }
  }
    secureHandler()
  },[navigate]);
  return (
    <>
      {myName}
      <HeroSection myData={data} />
    </>
  );
};

export default About;
