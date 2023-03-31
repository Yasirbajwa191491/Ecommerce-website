const jwt=require("jsonwebtoken");
const User=require("../Schema");
const dotenv=require("dotenv");
dotenv.config({path:'./config.env'});

const AuthenticateMiddleware=async(req,res,next)=>{
try {
  const token=req.cookies.ecommerce_token;
  
  const verify=jwt.verify(token,process.env.SECRET_KEY);
  if(verify){
   const productDetail=await User.findOne({"tokens.token":token}).select("-password -cpassword -tokens")
  
   req.rootUser=productDetail;
   req.token=token
   next();
  }else{
    res.status(401).send({error:"Un-Authorized User: No token provided"})
  }

} catch (error) {
    res.status(401).send({error:"Un-Authorized User: No token provided",err:error})
}
}
module.exports=AuthenticateMiddleware;