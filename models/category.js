var mongoose=require('mongoose');
var schema=mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	description:{
		type:String,
		required:true
	},
	modified:{
		type:Date,
		default:Date.now
	},
	user_id:{
		type:String
	}
});
module.exports=mongoose.model("Category",schema);
