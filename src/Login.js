import {useState,useEffect} from 'react'
import styled from 'styled-components'
import {AiFillEye} from "react-icons/ai"
import { NavLink,useNavigate } from 'react-router-dom'
import { toast, ToastContainer} from 'react-toastify';
import axios from 'axios';
  import "react-toastify/dist/ReactToastify.css";
  import { Checkbox } from 'react-input-checkbox';
const Login = () => {
    const [showPassword,setShowPassword]=useState(false)
    const [password,setPassword]=useState('');
	const [token,setToken]=useState("")
    const [ErrorPassword,setErrorPassword]=useState('');
    const [email,setEmail]=useState('');
    const [Erroremail,setErrorEmail]=useState('');
    const [remember,setRemember]=useState(false);
    const navigate=useNavigate()
    
  const loginHandler=async()=>{
   if(!email || !password){
	toast.error("Please Enter required fields", {
        position: toast.POSITION.TOP_RIGHT
      });
	  if(email===''){
      setErrorEmail('Enter Email')
	  }
	  if(password===''){
		setErrorPassword("Enter Password")
	  }
   }else{
	const data=await fetch("http://localhost:8000/login",{
		method:'POST',
		'credentials':'include',
		headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
		,body:JSON.stringify({email,password})
	})
	const response=await data.json();
		if(response.message==='Login Success'){
			toast.success("Login Successfully", {
				position: toast.POSITION.TOP_RIGHT
			  });
			  localStorage.setItem("yasir-ecommerce-token",JSON.stringify(response.token))
			  setEmail('')
			  setPassword('')
			  if(remember===true){
					var date = new Date();
					date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * 3);//here is 3 days
					window.document.cookie = "username" + "=" + email + ";path=" + 'yasir ecommerce' + "/#/;expires=" + date.toGMTString();
				
			  }
			  setTimeout(()=>{
				navigate("/home")
			},100)
		}else{
			toast.error(response.error
				, {
				position: toast.POSITION.TOP_RIGHT
			  });
		}
   }
  }
  useEffect(()=>{
    const secureHandler=async()=>{
      try {
        const response=await axios.get("http://localhost:8000/secure",{
          withCredentials:true
        })
		
		setToken(JSON.parse(localStorage.getItem("yasir-ecommerce-token")))
        if(response.status===200 && token){
			navigate("/home")
        }
    }catch(err){
      console.log(err);
    }

  }
    secureHandler() 
  },[token,navigate]); 
  
 const checkboxHandler=(e)=>{
	setRemember(e.target.checked);
  }
  const loginform=(e)=>{
e.preventDefault();
  }

  return (
	<Wrapper>
        <div className="container" style={{maxWidth:'100%'}}>
	<div className="screen">
		<div className="screen__content">
		<ToastContainer  />
			<form className="login" onClick={loginform}>
				<h3>Login Form:</h3>

				<div className="login__field">
					<i className="login__icon fas fa-user"></i>
					<input type="text" name='email' className="login__input" placeholder="User name / Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                    { email==='' &&  <span  style={{color:'#DB4437',fontSize:'11px'}} >{Erroremail}</span>}
				
				</div>
				<div className="login__field">
					<i className="login__icon fas fa-lock"></i>
					
					{
						showPassword? <div style={{display:'flex'}}>
					<input type="text" className="login__input1" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}   />
					<span ><AiFillEye onClick={()=>setShowPassword(!showPassword)} size={25} style={{backgroundColor:'#dcdcdc',height:'36px'}} /></span> 
					</div> : <div style={{display:'flex'}}>
					<input type="password" className="login__input1" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}  />
					<span ><AiFillEye onClick={()=>setShowPassword(!showPassword)} size={25} style={{backgroundColor:'#dcdcdc',height:'36px'}} /></span> 
					</div>
					}
                    { password==='' &&  <span  style={{color:'#DB4437',fontSize:'11px'}} >{ErrorPassword}</span>}
					
				</div>
				<button className="button login__submit" onClick={loginHandler}>
					<span className="button__text">Log In Now</span>
					<i className="button__icon fas fa-chevron-right"></i>
				</button>
				<div style={{display:'flex', marginTop:'10px', fontSize:'12px'}}>
				<Checkbox theme="fancy-checkbox" value={remember} onChange={checkboxHandler}  />
                                            <label className="form-check-label" htmlFor="remember-me"> Remember Me</label>	
											</div>	
				<h3 style={{color:'white',marginTop:'60px',marginLeft:'20px',display:'flex',width:'300px'}}>Don't have an account? <NavLink to="/signup" style={{color:'white',marginLeft:'5px'}}> Sign Up</NavLink></h3>


			</form>
			
		</div>
		<div className="screen__background">
			<span className="screen__background__shape screen__background__shape4"></span>
			<span className="screen__background__shape screen__background__shape3"></span>		
			<span className="screen__background__shape screen__background__shape2"></span>
			<span className="screen__background__shape screen__background__shape1"></span>
		</div>		
	</div>
</div>
</Wrapper>
  )
}

const Wrapper = styled.section`
	* {
	box-sizing: border-box;
	margin: 0;
	padding: 0;	
	font-family: Raleway, sans-serif;
}

body {
	background: linear-gradient(90deg, #C7C5F4, #776BCC);		
}

.container {
	display: flex;
	align-items: center;
	justify-content: center;
	${'' /* margin: 10px; */}
	padding: 10px;
	${'' /* width:100% !important; */}
	height:100%;	
	background: linear-gradient(90deg, #C7C5F4, #776BCC);		
}

.screen {		
	background: linear-gradient(90deg, #5D54A4, #7C78B8);		
	position: relative;	
	height: 600px;
	width: 360px;	
	box-shadow: 0px 0px 24px #5C5696;
}

.screen__content {
	z-index: 1;
	position: relative;	
	height: 100%;
}

.screen__background {		
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 0;
	-webkit-clip-path: inset(0 0 0 0);
	clip-path: inset(0 0 0 0);	
}

.screen__background__shape {
	transform: rotate(45deg);
	position: absolute;
}

.screen__background__shape1 {
	height: 520px;
	width: 520px;
	background: #FFF;	
	top: -50px;
	right: 120px;	
	border-radius: 0 72px 0 0;
}

.screen__background__shape2 {
	height: 220px;
	width: 220px;
	background: #6C63AC;	
	top: -172px;
	right: 0;	
	border-radius: 32px;
}

.screen__background__shape3 {
	height: 540px;
	width: 190px;
	background: linear-gradient(270deg, #5D54A4, #6A679E);
	top: -24px;
	right: 0;	
	border-radius: 32px;
}

.screen__background__shape4 {
	height: 400px;
	width: 200px;
	background: #7E7BB9;	
	top: 420px;
	right: 50px;	
	border-radius: 60px;
}

.login {
	width: 320px;
	padding: 30px;
	padding-top: 156px;
}

.login__field {
	padding: 20px 0px;	
	position: relative;	
}

.login__icon {
	position: absolute;
	top: 30px;
	color: #7875B5;
}

.login__input1 {
	border: none;
	border-bottom: 2px solid #D1D1D4;
	background: white;
	padding: 10px;
	padding-left: 24px;
	font-weight: 700;
	width: 90%;
	transition: .2s;
}

.login__input1:active,
.login__input1:focus,
.login__input1:hover {
	outline: none;
	border-bottom-color: #6A679E;
}
.login__input {
	border: none;
	border-bottom: 2px solid #D1D1D4;
	background: none;
	padding: 10px;
	padding-left: 24px;
	font-weight: 700;
	width: 100%;
	transition: .2s;
}

.login__input:active,
.login__input:focus,
.login__input:hover {
	outline: none;
	border-bottom-color: #6A679E;
}

.login__submit {
	background: #fff;
	font-size: 14px;
	margin-top: 30px;
	padding: 16px 20px;
	border-radius: 26px;
	border: 1px solid #D4D3E8;
	text-transform: uppercase;
	font-weight: 700;
	display: flex;
	align-items: center;
	width: 100%;
	color: #4C489D;
	box-shadow: 0px 2px 2px #5C5696;
	cursor: pointer;
	transition: .2s;
}

.login__submit:active,
.login__submit:focus,
.login__submit:hover {
	border-color: #6A679E;
	outline: none;
}

.button__icon {
	font-size: 24px;
	margin-left: auto;
	color: #7875B5;
}

.social-login {	
	position: absolute;
	height: 140px;
	width: 160px;
	text-align: center;
	bottom: 0px;
	right: 0px;
	color: #fff;
}

.social-icons {
	display: flex;
	align-items: center;
	justify-content: center;
}

.social-login__icon {
	padding: 20px 10px;
	color: #fff;
	text-decoration: none;	
	text-shadow: 0px 0px 8px #7875B5;
}

.social-login__icon:hover {
	transform: scale(1.5);	
}`
export default Login