const {Schema,model}=require("mongoose");

const  productSchema=new Schema({
	id:{
		type:String,
	},
	name:{
		type: String,
        required:true,
		unique:true,
	},
	company:{
		type: String,
	},
	price:{
		type: Number,
	},
	colors:[String]
	,
	image:[],
	category:{
		type:String
	},
	featured:{
		type: Boolean
	},
	shipping:{
		type: Boolean
	},
	stock:{
		type: Number
	},
	reviews:{
		type: Number
	},
	stars:{
		type: Number
	},
	description:{
		type: String
	}
})
const Product=model("Product",productSchema);


module.exports=Product;