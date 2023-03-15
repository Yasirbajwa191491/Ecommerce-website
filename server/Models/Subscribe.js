const {model,Schema}=require("mongoose");
const validatornpm=require("validator");

const subscribe=new Schema({
    email:{
        type: String,
        required: true,
        unique: [true, "Email adress is already present"],
        validate:{
            validator:function(val){
                return validatornpm.isEmail(val)
            },
            message:"Please enter valid email"
        }
    }
})
const Subscribe=model("Subscribe",subscribe);
module.exports=Subscribe;
