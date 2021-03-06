var express = require('express');
var router = express.Router();
var user =  require('./../models/user');
var passport = require('./../auth');
var category = require('./../models/category');

router.get('/categories_home', function(req, res, next) {
  if(req.session.passport.user === undefined){
  	res.redirect("/");
  }
  else{
  		category.find({},function(err,categories){
	  	if(err){
	  		console.log("error");
	  	}
	  	else{
	  		//console.log(req.user._id);
	  		res.render('categories_home', { title: 'Categories',categories:categories,user:req.user });
	  	}
	  })
  }
});
router.get('/data', function(req, res, next) {

  		category.find({ $query: {}, $orderby: { modified: -1 } },function(err,categories){
	  	if(err){
	  		console.log("error");
	  	}
	  	else{
	  		//console.log(req.user._id);
	  		res.json({"notices":categories});
	  	}
	  })

});
router.get('/add_category',function(req,res,next){
	if(req.session.passport.user === undefined){
		res.redirect('/');
	}
	else{
		res.render('add_category',{title:'Add categories',user:req.user})
	}
});
router.post('/add_post',function(req,res,err){
	if(req.session.passport.user === undefined){
		res.redirect('/');
	}
	else{
		var c = new category({
			name:req.body.category_name,
			user_id:req.body.user_id,
      description:req.body.description
		})
		c.save(function(err){
			if(err){
				console.log(err);
			}
			else{
				res.redirect("/category/categories_home");
			}
		})
	}
});
router.get('/delete/:_id',function(req,res,err){
	if(req.session.passport.user === undefined){
		redirect("/");
	}
	else{
		console.log(req.params._id);
		category.remove({_id:req.params._id},function(err,result){
			if(err){
				console.log(err);
			}
			else{
				res.redirect('/category/categories_home');
			}
		})
	}
});

router.get('/edit_category/:_id',function(req,res,err){
	if(req.session.passport.user === undefined){
		res.redirect('/');
	}
	else{
		category.findOne({_id:req.params._id},function(err,category){
			if(err){
				console.log(err);
			}
			else{
				res.render('edit_category',{title:"Edit category",category:category,user:req.user});
			}
		});
	}
});
router.post('/edit_post',function(req,res,err){
	if(req.session.passport.user === undefined){
		res.redirect("/");
	}
	else{
		category.update({_id:req.body._id},{$set:{name:req.body.category_name}},function(err,result){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/category/categories_home");
		}
	})
	}
});
module.exports = router;
