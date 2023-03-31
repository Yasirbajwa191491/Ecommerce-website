const {Schema,model}=require("mongoose");

const CompanySchema=new Schema({
	id:{
		type: Number,
		required:true,
		unique:true,
	default:1
	},
	CompanyName:{
		type: String,
		required:true,
		unique:true,
	},
	Date:{
		type: Date,
	default: new Date().toJSON().slice(0, 10)
	}
})
const Company=model("Company",CompanySchema);


module.exports=Company;