const {model,Schema}=require("mongoose")
const validatornpm=require("validator");

const messageSchema=new Schema({
    username:{
        type: String,
        required: true,
    },
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
    },
    usermessages:[{
        message:{
            type: String
        }
    }]
})
const Message=model("Message",messageSchema)
module.exports=Message;