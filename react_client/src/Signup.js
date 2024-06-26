import {useState} from 'react'
import styled from 'styled-components'
import {AiFillEye} from "react-icons/ai"
import { NavLink,useNavigate } from 'react-router-dom'
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
  import "react-toastify/dist/ReactToastify.css";
const Signup = () => {
    const [showPassword,setShowPassword]=useState(false)
    const [showPassword1,setShowPassword1]=useState(false)
    const [inputHandler,setInputHandler]=useState({
        email:'',
        password:'',
        cpassword:'',
        name:'',
        username:'',
        address:'',
    });
    const navigate=useNavigate()
    const [errorName,setErrorName]=useState('')
    const [errorEmail,setErrorEmail]=useState('')
    const [errorUsername,setErrorUsername]=useState('')
    const [errorPassword,setErrorPassword]=useState('')
    const [errorCPassword,setErrorCPassword]=useState('')
  const formHandler=(e)=>{
    const name=e.target.name
    const value=e.target.value
    setInputHandler({...inputHandler,[name]:value})
  }
  const signupHandler=async()=>{
	try {
		const {name,username,email,password,cpassword,address}=inputHandler;
		if(!name || !username || !email || !password || !cpassword){
			toast.error("Please Enter required fields", {
				position: toast.POSITION.TOP_RIGHT
			  });
			  if(name===''){
				setErrorName('Enter Name')
			  }
			  if(username===''){
				setErrorUsername('Enter Username')
			  }
			  if(email===''){
				setErrorEmail('Enter Email')
			  }
			  if(password===''){
				setErrorPassword('Enter Password')
			  }
			  if(cpassword===''){
				setErrorCPassword('Enter Confirm Password')
			  }
		}else{
		let res=await axios.post('/signup',{
			name,username,email,password,cpassword,address
		})
		const Response=res.data;
			if(Response.message==='User Created'){
				toast.success("User Created Successfully", {
					position: toast.POSITION.TOP_RIGHT
				  });
				  localStorage.setItem("yasir-ecommerce-token",JSON.stringify(Response.token))
				
				  setInputHandler({...inputHandler,
					email:'',
					password:'',
					cpassword:'',
					name:'',
					username:'',
					address:'',
				})
				setTimeout(()=>{
					navigate("/home")
				},100)
		
			}else{
				toast.error(Response.error
					, {
					position: toast.POSITION.TOP_RIGHT
				  });
			}
		
		}	
	} catch (error) {
		console.log(error);
		toast.error(error.response.data?.message, {
			position: toast.POSITION.TOP_RIGHT
		  });
	}
  
  }
  const loginform=(e)=>{
e.preventDefault();
  }
  return (
	<Wrapper>
        <div className="container" style={{maxWidth:'100%'}}>
	<div className="screen">
		<div className="screen__content">
			<form className="login" onClick={loginform}>
            <ToastContainer />
				<h3>Sign Up Form:</h3>

				<div className="login__field">
					<i className="login__icon fas fa-user"></i>
					<input type="text" name='name' className="login__input" placeholder="Name" value={inputHandler.name} onChange={formHandler} />
                 { inputHandler.name==='' &&  <span  style={{color:'#DB4437',fontSize:'11px'}} >{errorName}</span>}
				</div>
				<div className="login__field">
					<i className="login__icon fas fa-user"></i>
					<input type="text" name='username' className="login__input" placeholder="Username" value={inputHandler.username} onChange={formHandler} />
                    { inputHandler.username==='' &&  <span  style={{color:'#DB4437',fontSize:'11px'}} >{errorUsername}</span>}
				
                </div>
				<div className="login__field">
					<i className="login__icon fas fa-user"></i>
					<input type="text" name='email' className="login__input" placeholder="Email" value={inputHandler.email} onChange={formHandler} />
                    { inputHandler.email==='' &&  <span  style={{color:'#DB4437',fontSize:'11px'}} >{errorEmail}</span>}
				   
                </div>
				<div className="login__field">
					<i className="login__icon fas fa-lock"></i>
					
					{
						showPassword? <div style={{display:'flex'}}>
					<input type="text" name='password' className="login__input1" placeholder="Password" value={inputHandler.password} onChange={formHandler}   />
					<span ><AiFillEye onClick={()=>setShowPassword(!showPassword)} size={25} style={{backgroundColor:'#dcdcdc',height:'36px'}} /></span> 
					</div> : <div style={{display:'flex'}}>
					<input type="password" name='password' className="login__input1" placeholder="Password" value={inputHandler.password} onChange={formHandler}  />
					<span ><AiFillEye onClick={()=>setShowPassword(!showPassword)} size={25} style={{backgroundColor:'#dcdcdc',height:'36px'}} /></span> 
					</div>
					}
                    { inputHandler.password==='' &&  <span  style={{color:'#DB4437',fontSize:'11px'}} >{errorPassword}</span>}
					
				</div>
				<div className="login__field">
					<i className="login__icon fas fa-lock"></i>
					
					{
						showPassword1? <div style={{display:'flex'}}>
					<input type="text" name='cpassword' className="login__input1" placeholder="Confirm Password" value={inputHandler.cpassword} onChange={formHandler}   />
					<span ><AiFillEye onClick={()=>setShowPassword1(!showPassword1)} size={25} style={{backgroundColor:'#dcdcdc',height:'36px'}} /></span> 
					</div> : <div style={{display:'flex'}}>
					<input type="password" name='cpassword' className="login__input1" placeholder="Confirm Password" value={inputHandler.cpassword} onChange={formHandler}  />
					<span ><AiFillEye onClick={()=>setShowPassword1(!showPassword1)} size={25} style={{backgroundColor:'#dcdcdc',height:'36px'}} /></span> 
					</div>
					}
                    { inputHandler.cpassword==='' &&  <span  style={{color:'#DB4437',fontSize:'11px'}} >{errorCPassword}</span>}
					
				</div>
                <div className="login__field">
					<i className="login__icon fas fa-user"></i>
					<input type="text" name='address' className="login__input" placeholder="Address" value={inputHandler.address} onChange={formHandler} />
				</div>
				<button className="button login__submit" onClick={signupHandler}>
					<span className="button__text">Sign Up Now</span>
					<i className="button__icon fas fa-chevron-right"></i>
				</button>
				<h3 style={{color:'white',marginTop:'60px',marginLeft:'20px',display:'flex',width:'300px'}}>Do You have an account? <NavLink to="/" style={{color:'white',marginLeft:'5px'}}> Login</NavLink></h3>


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
	padding: 10px;
	height:100%;	
	background: linear-gradient(90deg, #C7C5F4, #776BCC);		
}

.screen {		
	background: linear-gradient(90deg, #5D54A4, #7C78B8);		
	position: relative;	
	height: 850px;
	width: 460px;	
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
	background: white;
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
	${'' /* text-transform: uppercase; */}
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
export default Signup