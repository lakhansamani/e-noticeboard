var mongoose=require('mongoose');
var schema=mongoose.Schema({
	token:{
		type:String,
		required:true,
		unique:true
	}
});
module.exports=mongoose.model("Token",schema);
