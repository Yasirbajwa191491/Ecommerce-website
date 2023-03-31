const jwt=require("jsonwebtoken");
const Admin=require("../Models/Admin");
const dotenv=require("dotenv");
dotenv.config({path:'./config.env'});

const dashboardMiddleware=async(req,res,next)=>{
try {
  const token=req.cookies.dashboard_token;
  
  const verify=jwt.verify(token,process.env.SECRET_KEY);
  if(verify){
   const adminDetail=await Admin.findOne({"tokens.token":token}).select("-password -tokens")
  
   req.rootUser=adminDetail;
   next();
  }else{
    res.status(401).send({error:"Un-Authorized Admin: No token provided"})
  }

} catch (error) {
    res.status(401).send({error:"Un-Authorized Admin: No token provided",err:error})
}
}
module.exports=dashboardMiddleware;