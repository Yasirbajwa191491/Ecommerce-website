const express=require("express");
const router=express.Router();
const User=require("../Schema")
const Subscribe=require("../Models/Subscribe")
const Message=require("../Models/Message")
const Admin=require("../Models/Admin")
const Product=require("../Models/Product")
const jwt = require('jsonwebtoken');
const bcrypt=require("bcryptjs")
const dotenv=require("dotenv");
const path=require("path");
const cors=require("cors");
const Category=require("../Models/Category");
const Company=require("../Models/Company");
const cookieParser=require("cookie-parser");
const multer=require("multer");
const {v4:uuidv4}=require("uuid");
const AuthenticateMiddleware=require("../Middleware/AuthenticateMiddleware")
const dashboardMiddleware=require("../Middleware/dashboardMiddleware")
dotenv.config({path:'./config.env'});

router.use("/public",express.static("public"));
router.use(cors({credentials: true, origin: 'http://localhost:3000'}));
router.use(cookieParser());
//routes
router.get("/",(req,res)=>{
res.send("Home Page")
})

// Registration Route
router.post("/signup",async(req,res)=>{
    try {
        const {name,username,email,password,cpassword,address}=req.body;
        if(!name || !username || !email || !password || !cpassword){
    return  res.status(200).send({error:"Please fill all required property"})
        }
        const checkemail=await User.findOne({email:email});
        if(checkemail){
       res.status(200).send({error:"Email already exist"}); 
        }else{
            if(password ===cpassword){
            const newuser=new User({name,username,email,password,cpassword,address});
            const newprod=await newuser.save();
            if(newprod){
                const token=await jwt.sign({_id:newprod._id},process.env.SECRET_KEY);
                newprod.tokens=newprod.tokens.concat({token:token});
                await newprod.save();
                res.cookie('ecommerce_token',token,{
                    expires: new Date(Date.now()+258920000000),
                    httpOnly:true,
                })
          return  res.status(201).send({message:'User Created',token:token});
            }else{
             return   res.status(201).send({error:'User not Created'});

            }
            }else{
    return   res.status(200).send({error:"Password and Confirm Password are not matching"}); 

            }
        }
    } catch (error) {
       res.status(200).send(error) 
    }
})


//Login Route
router.post("/login",async(req,res)=>{
try {
    const {email,password}=req.body;
    if(!email || !password){
        res.status(200).send({error:"Please fill all required fields"})
    }
     const check=await User.findOne({$or:[{'email':email},{'username':email}]});
    
    if(check){
    const passwordCheck=await bcrypt.compare(password,check.password)

    if(passwordCheck){
        const token=await jwt.sign({_id:check._id},process.env.SECRET_KEY);
        check.tokens=check.tokens.concat({token:token});
        await check.save();
        res.cookie('ecommerce_token',token,{
            expires: new Date(Date.now()+258920000000),
            httpOnly:true,
        })
        return  res.status(200).send({message:'Login Success',token:token});
    }else{
        return res.status(200).json({error: "invalid login details"})
    }
    }else{
        return res.status(200).json({error: "invalid login detail1"})
    }
} catch (error) {
    res.status(200).send(error) 
    
}
})
//without middleware routes
router.post("/subscribe",async(req,res)=>{
    try {
        const check=await Subscribe.findOne({email:req.body.email})
        if(check){
      res.status(200).send({message:"Email already exists"})
        }else{
            const newSubscribe=new Subscribe({email:req.body.email})
            await newSubscribe.save(); 
            res.status(201).send({message:"subscribed"})
        }
     
    } catch (error) {
       res.status(422).send(error) 
    }
})
router.get("/dashboard/messages_list",async(req,res)=>{
const messages=await Message.find({}).sort({_id:-1});
res.status(200).send(messages)
})

router.get("/dashboard/users_list",async(req,res)=>{
const messages=await User.find({}).select("-password -cpassword -tokens").sort({_id:-1});
res.status(200).send(messages)
})
router.post("/sendmessages",async(req,res)=>{
    try {
        const {username,email,message}=req.body;
        const check =await Message.findOne({email:email});
        if(check){
            check.usermessages=check.usermessages.concat({message})
            await check.save();
            res.status(201).send({message:"Message Submitted"})
        }else{
            const newmessage=new Message({username,email});
            const checking=await newmessage.save();
            checking.usermessages=checking.usermessages.concat({message})
            
            await checking.save();
            res.status(201).send({message:"Message Submitted",checking})
        }
    } catch (error) {
        res.status(422).send(error)  
    }
})
//secure route
router.get("/secure",AuthenticateMiddleware,(req,res)=>{
    if(req.rootUser){
        res.status(200).send(req.rootUser);
    }else{

    }
    
})
router.get("/dashboard/secure",dashboardMiddleware,(req,res)=>{
    if(req.rootUser){
        res.status(200).send(req.rootUser);
    }else{

    }
    
})
//logout route
router.get("/logout",async(req,res)=>{
    try {
           const token=req.cookies.ecommerce_token;
    const verify=jwt.verify(token,process.env.SECRET_KEY);
    const user=await User.findOne({_id:verify._id});
  user.tokens=[];
    // user.tokens=user.tokens.filter((eleE)=>{
    //   return eleE.token !==token;
    // })
   await user.save();
      res.clearCookie("ecommerce_token")  
      res.status(200).send({message:"logout success"})
    } catch (error) {
        res.status(422).send(error)
    }
})
router.get("/dashboard/logout",async(req,res)=>{
    try {
           const token=req.cookies.dashboard_token;
    const verify=jwt.verify(token,process.env.SECRET_KEY);
    const user=await Admin.findOne({_id:verify._id});
  user.tokens=[];
   await user.save();
      res.clearCookie("ecommerce_token")  
      res.status(200).send({message:"logout success"})
    } catch (error) {
        res.status(422).send(error)
    }
})

//Dashboard Routes
router.post("/dashboard/signup",async(req,res)=>{
try {
        const {username,email,password}=req.body;
        if(!username || !email || !password){
    return  res.status(200).send({error:"Please fill all required property"})
        }
        const checkemail=await Admin.findOne({email:email});
        if(checkemail){
       res.status(200).send({error:"Email already exist"}); 
        }else{
            const newuser=new Admin({username,email,password});
            const newprod=await newuser.save();
            if(newprod){
                const token=await jwt.sign({_id:newprod._id},process.env.SECRET_KEY);
                newprod.tokens=newprod.tokens.concat({token:token});
                await newprod.save();
                res.cookie('dashboard_token',token,{
                    expires: new Date(Date.now()+288000000),
                    httpOnly:true,
                })
          return  res.status(201).send({message:'User Created',token:token});
            }else{
             return   res.status(201).send({error:'User not Created'});

            }
            
        }
    } catch (error) {
       res.status(200).send(error) 
    }
})
router.post("/dashboard/login",async(req,res)=>{
try {
    const {email,password}=req.body;
    if(!email || !password){
        res.status(200).send({error:"Please fill all required fields"})
    }
     const check=await Admin.findOne({$or:[{'email':email},{'username':email}]});
    
    if(check){
    const passwordCheck=await bcrypt.compare(password,check.password)

    if(passwordCheck){
        const token=await jwt.sign({_id:check._id},process.env.SECRET_KEY);
        check.tokens=check.tokens.concat({token:token});
        await check.save();
        res.cookie('dashboard_token',token,{
                    expires: new Date(Date.now()+288000000),
                    httpOnly:true,
                })
        return  res.status(200).send({message:'Login Success',token:token});
    }else{
        return res.status(200).json({error: "invalid login details"})
    }
    }else{
        return res.status(200).json({error: "invalid login detail"})
    }
} catch (error) {
    res.status(200).send(error) 
    
}
})

router.get("/dashboard/counts_users",async(req,res)=>{
    let totalusers=await User.where({}).countDocuments();
    res.status(200).json(totalusers);
})
router.get("/dashboard/counts_subscribers",async(req,res)=>{
    let totalusers=await Subscribe.where({}).countDocuments();
    res.status(200).json(totalusers);
})
router.get("/dashboard/counts_products",async(req,res)=>{
    let totalusers=await Product.where({}).countDocuments();
    res.status(200).json(totalusers);
})
router.get("/dashboard/counts_admin",async(req,res)=>{
    let totalusers=await Admin.where({}).countDocuments();
    res.status(200).json(totalusers);
})
router.post("/dashboard/insert_category",async(req,res)=>{
    try{

     const {CategoryCode,CategoryName}=req.body;
     const check=await Category.findOne({CategoryName})
     if(check){
        return res.status(200).send({error:"Category Name already Exist"})
     }else{
         let result=await Category.findOne({}).sort({_id:-1}).limit(1)
         if (result) {
           const newCategory=new Category({id:result.id+1,CategoryCode,CategoryName});
     await newCategory.save(); 
 }else{
    const newCategory=new Category({CategoryCode,CategoryName});
     await newCategory.save();
 }
     
     res.status(201).send({message:'Category Created'});
     }
    
    }catch(error){
        console.log(error)
    }
})
router.post("/dashboard/insert_company",async(req,res)=>{
    try{

     const {CompanyName}=req.body;
     const check=await Company.findOne({CompanyName})
     if(check){
        return res.status(200).send({error:"Company Name already Exist"})
     }else{
         let result=await Company.findOne({}).sort({_id:-1}).limit(1)
         if(result){
            const newCategory=new Company({id:result.id+1,CompanyName});
     await newCategory.save();
 }else{
    const newCategory=new Company({CompanyName});
     await newCategory.save();
 }
     
     res.status(201).send({message:'Company Created'});
     }
    
    }catch(error){
        console.log(error)
    }
})
router.delete("/dashboard/catgories_delete/:id",async(req,res)=>{
    try{
     const id=req.params.id;
     // res.send(id)
    await Category.deleteOne({id:id})
     res.status(200).send({message:'Category Deleted'});
    }catch(error){
        console.log(error)
    }
})
router.delete("/dashboard/company_delete/:id",async(req,res)=>{
    try{
     const id=req.params.id;
    await Company.deleteOne({id:id})
     res.status(200).send({message:'Company Deleted'});
    }catch(error){
        console.log(error)
    }
})
router.post("/dashboard/update_company",async(req,res)=>{
    try{
     const {CompanyName,id}=req.body;
    await Company.updateOne({id},[{$set:{CompanyName}}])
     res.status(201).send({message:'Company Updated'});
    }catch(error){
        console.log(error)
    }
})
router.post("/dashboard/update_category",async(req,res)=>{
    try{
     const {CategoryCode,CategoryName,CategoryId}=req.body;
    await Category.updateOne({id:CategoryId},[{$set:{CategoryCode,CategoryName}}])
     res.status(201).send({message:'Category Updated'});
    }catch(error){
        console.log(error)
    }
})
router.get("/dashboard/catgories_list",async(req,res)=>{
    const data=await Category.find({});
    res.status(200).send(data)
})
router.get("/dashboard/categories_numbers",async(req,res)=>{
    try{
    let arr =[];
//    let result= req.query.category.map(async(cur)=>{
//        let cat=await Product.countDocuments({category:cur});
//      arr.push(cat)
//      return arr
//     })
//    console.log(result)
// if(resolve(result)){
//     res.status(200).send(arr)
// }
    for(let x=0;x<req.query.category.length;x++){
        let cat=await Product.countDocuments({category:req.query.category[x]});
        arr.push(cat)
    }
    res.status(200).send(arr)
    }catch(Err){
        res.send(Err)
    }
})
router.delete("/dashboard/delete_product/:id",async(req,res)=>{
    let _id=req.params.id
    let check=await Product.findByIdAndDelete(_id)
   if(check){
    res.status(200).send({message:"Product Deleted"});
   }
})
router.get("/dashboard/product_list",async(req,res)=>{
    const data=await Product.find({}).sort({"_id":-1});
    res.status(200).send(data)
})
router.get("/dashboard/filterproduct_byletter",async(req,res)=>{
    const data=await Product.find({}).sort({"name":1});
    res.status(200).send(data)
})
router.get("/dashboard/product_orderlist",async(req,res)=>{
    const data=await Product.find({}).sort({"_id":1});
    res.status(200).send(data)
})
router.get("/dashboard/product_singlelist/:id",async(req,res)=>{
    const data=await Product.findOne({id:req.params.id});
    res.status(200).send(data)
})
router.get("/dashboard/product_datalist",async(req,res)=>{
    try{
     let total_stock=await Product.aggregate([
 {
    $group: {
      _id: null,
     total_stock: { $sum: '$stock' },
     total_reviews: { $sum: '$reviews' },
     total_price: { $sum: '$price' },
    },
  },
  { $project: { _id: 0 } },
])
     res.send(total_stock)
    }catch(error){
        res.status(200).send(error)
    }
})
router.get("/dashboard/productsearch/:key",async(req,res)=>{
    try{
     // const check=await Product.find({$or:[{'id':/^+req.params.name+/},{'name':/^+req.params.name+/}]});
     const check=await Product.find({ $or: [
        { id: { $regex: req.params.key } },
        { name: { $regex: req.params.key } }
      ],});
     res.status(200).send(check)
    }catch(error){
        res.status(200).send(error)
    }
})
router.get("/dashboard/company_list",async(req,res)=>{
    const data=await Company.find({});
    res.status(200).send(data)
})
var uniqueId=uuidv4();
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join(__dirname,"../../public/public"))
       
    },
     filename: function(req,file,cb){
            cb(null,file.originalname)
        }
})
const filefilter=(req,file,cb)=>{
    if(file.mimetype==='image/jpeg' || file.mimetype==='image/png' || file.mimetype==='image/webp'){
        cb(null,true)
    }else{
        cb(null,false)
    }
}
const upload=multer({
    storage:storage,
    limits:{
      fileSize:1024*1024*5,  
    },
    fileFilter:filefilter

})
router.post("/dashboard/add_product", upload.fields([{name:'image1'},{name:'image2'},{name:'image3'},{name:'image4'}]),async(req,res)=>{
try {
    let {id,name,price,description,stock,reviews,stars,company,category,colors,featured,shipping}=req.body
    if( !name || !company || !category){
        return res.status(200).send({error:"Enter Required Fields"})
    }
     
    colors=JSON.parse(colors)
     let arr=[];
     let arr1=[
     {
        id:"randomid1",
        width:"1080",
        height:"650",
        url:"/public/"+req.files.image1[0].originalname,
        filename:req.files.image1[0].originalname,
        size:1080,
        type:req.files.image1[0].mimetype
     },
      {
        id:"randomid2",
        width:"1080",
        height:"650",
        url:"/public/"+req.files.image2[0].originalname,
        filename:req.files.image2[0].originalname,
        size:1080,
        type:req.files.image2[0].mimetype
     },
      {
        id:"randomid3",
        width:"1080",
        height:"650",
        url:"/public/"+req.files.image3[0].originalname,
        filename:req.files.image3[0].originalname,
        size:1080,
        type:req.files.image3[0].mimetype
     },
      {
        id:"randomid4",
        width:"1080",
        height:"650",
        url:"/public/"+req.files.image4[0].originalname,
        filename:req.files.image4[0].originalname,
        size:1080,
        type:req.files.image4[0].mimetype
     },
     ];
     colors.map((curEle)=>{
        return arr.push(curEle.value)
     })
     let  exist=await Product.findOne({$or:[{'name':name},{'id':id}]});

    if(exist){
        return res.status(200).send({error:"Product Already Exists"})
    }else{
        if(stars>5){
        return res.status(200).send({error:"Enter Valid Stars Value"})

        }
       const newproduct=new Product({
        id,name,stars,price,description,stock,reviews,company,category,featured,shipping,colors:arr,image:arr1
    })
   let saveProduct=await newproduct.save();
   if(saveProduct){

    res.status(201).send({message:"New Product Inserted"})  
   }
    
    }
      
} catch (error) {
    console.log(error);
}

})
router.patch("/dashboard/edit_product",async(req,res)=>{
try{
 let {id,name,price,stock,reviews,stars,company,category,colors}=req.body
    if( !name || !company || !category){
        return res.status(200).send({error:"Enter Required Fields"})
    }
    let arr=[];
      colors.map((curEle)=>{
        return arr.push(curEle.value)
     })
        if(stars>5){
        return res.status(200).send({error:"Enter Valid Stars Value"})

        }
         let  exist=await Product.findOne({
   $and: [
      { _id: { $ne: id } },
      { name: name  }
   ]
} );
         if(exist){
            return res.status(200).send({error:"Product Name Already Exists"})
         }else{

            let updateProduct=await Product.findByIdAndUpdate({_id:id},{$set:{name:name,price:price,stock:stock,reviews:reviews,stars:stars,company:company,category:category,colors:arr}},{
        new: true
      })
            
            if(updateProduct){
                res.status(200).send({message:"Product Updated"})
            }else{
              res.status(200).send({error:"Product not found"})  
            }
         }
}catch(error){

}
})
module.exports=router;