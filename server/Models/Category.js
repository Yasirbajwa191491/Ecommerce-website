const {Schema,model}=require("mongoose");

const categorySchema=new Schema({
	id:{
		type: Number,
		required:true,
		unique:true,
	default:1
	},
	CategoryCode:{
		type:String,
		required:true,
	},
	CategoryName:{
		type: String,
		required:true,
		unique:true,
	},
	Date:{
		type: Date,
	default: new Date().toJSON().slice(0, 10)
	}
})
const Category=model("Category",categorySchema);


module.exports=Category;