const express=require("express");
const app=express();
const dotenv=require("dotenv");
const cors = require('cors')
require("./connection/conn")
app.use(express.json());

app.use(require("./routes/Router"))
app.use(cors())
//environment variable
dotenv.config({path:'./config.env'});
const port=process.env.PORT;

app.listen(port,()=>{
    console.log('Server is running at the port:'+port);
})
