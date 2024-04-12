import styled from "styled-components";
import { useEffect,useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer} from 'react-toastify';
  import "react-toastify/dist/ReactToastify.css";
const Wrapper = styled.section`
    padding: 9rem 0 5rem 0;
    text-align: center;

    .container {
      margin-top: 6rem;

      .contact-form {
        max-width: 50rem;
        margin: auto;

        .contact-inputs {
          display: flex;
          flex-direction: column;
          gap: 3rem;

          input[type="submit"] {
            cursor: pointer;
            transition: all 0.2s;

            &:hover {
              background-color: ${({ theme }) => theme.colors.white};
              border: 1px solid ${({ theme }) => theme.colors.btn};
              color: ${({ theme }) => theme.colors.btn};
              transform: scale(0.9);
            }
          }
        }
      }
    }
  `;
const Contact = () => {
  const [username,setUsername]=useState("")
  const [email,setEmail]=useState("")
  const [message,setMessage]=useState("")
  const navigate=useNavigate();

  const messageHandler=async()=>{
    try {
      const response=await axios.post("http://localhost:8000/sendmessages",{
        username,email,message
      })
      if(response.data.message==="Message Submitted"){
        toast.success("Message Submitted", {
          position: toast.POSITION.TOP_RIGHT
          });
          setMessage(" ");
      }
    } catch (error) {
      console.log(error);
    }
  }
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
  },[]);
  

  return (
    <Wrapper>
		<ToastContainer  />
      <h2 className="common-heading">Contact page</h2>

      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3404.929367191278!2d73.06780311510305!3d31.416072081404288!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x392242bef30a05ed%3A0x39e814b7f874c28d!2sGovernment%20College%20University%20Faisalabad!5e0!3m2!1sen!2s!4v1678903927671!5m2!1sen!2s"
        width="100%"
        height="400"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"></iframe>

      <div className="container">
        <div className="contact-form">
          <form onSubmit={(e)=>e.preventDefault()}
            action="https://formspree.io/f/xeqdgwnq"
            method="POST"
            className="contact-inputs">
            <input
              type="text"
              placeholder="username"
              name="username"
              required
              autoComplete="off"
              value={username}
              readOnly={true}
            />

            <input
              type="email"
              value={email}
              name="Email"
              placeholder="Email"
              autoComplete="off"
              required
              readOnly
            />

            <textarea
              name="Message"
              cols="30"
              rows="10"
              required
              autoComplete="off"
              placeholder="Enter you message" value={message}
              onChange={(e)=>setMessage(e.target.value)}
              ></textarea>

            <input type="submit" value="send" onClick={messageHandler} />
          </form>
        </div>
      </div>
    </Wrapper>
  );
};

export default Contact;
