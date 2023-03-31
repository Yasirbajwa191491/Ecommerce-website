const {Schema,model}=require("mongoose");
const validatornpm=require("validator");
const bcrypt=require("bcryptjs")
const adminSchema=new Schema({
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
     password:{
        type: String,
        min: [7,"password should countains atleast 7 characters"],
        required: true,
        trim: true
    },
    tokens:[{
    	token:{
    		type: String,
    		trim: true
    	}
    }]
})
adminSchema.pre("save",async function(next){
    if(this.isModified("password")){
       this.password=await bcrypt.hash(this.password,12);
       }
       next();
})

const Admin=model("Admin",adminSchema);
module.exports=Admin;