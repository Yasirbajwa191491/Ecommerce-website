const jwt=require("jsonwebtoken");
const Product=require("../Schema");
const dotenv=require("dotenv");
dotenv.config({path:'./config.env'});

const AuthenticateMiddleware=async(req,res,next)=>{
try {
  const token=req.cookies.ecommerce_token;
  
  const verify=jwt.verify(token,process.env.SECRET_KEY);
  if(verify){
   const productDetail=await Product.findOne({"tokens.token":token}).select("-password -cpassword -tokens")
  
   res.send(req.rootUser=productDetail)
   req.rootUser=productDetail;
   req.token=token;
   req._id=productDetail._id
   next();
  }else{
    res.status(401).send({error:"Un-Authorized User: No token provided"})
  }

} catch (error) {
    res.status(401).send({error:"Un-Authorized User: No token provided",err:error})
}
}
module.exports=AuthenticateMiddleware;