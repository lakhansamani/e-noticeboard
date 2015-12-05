var express = require('express');
var router = express.Router();
var passport = require('./../auth');
var user=require('./../models/user');
var token=require('./../models/token');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/login',passport.authenticate('local',{
	failureRedirect:'/',
	successRedirect:'/home'
}));
router.get('/token/:token',function(req,res){
	var t=new token();
	t.token=req.params.token;
	t.save(function(err,result){
		if(err){
			console.log(err);
		}
		else{
			res.send("done");
		}
	});
});
router.get('/client_login',function(req,res){
	res.render('client_login',{'title':'login'});
})
router.get('/register',function(req,res){
	res.render('register',{'title':'login'});
})
router.post('/register',function(req,res){
	var u=new user();
	u.name=req.body.name;
	u.username=req.body.username;
	u.password=u.generateHash(req.body.password);
	u.save(function(err,result){
		if(err){
			console.log(err);
		}
		else{
			res.redirect('/users/client_login');
		}
	})
})
router.post('/client_login',passport.authenticate('local',{
	failureRedirect:'/',
	successRedirect:'/clientboard'
}));
router.get('/client_logout',function(req,res){
	req.logout();
	res.redirect('/users/client_login');
});
router.get('/logout',function(req,res){
	req.logout();
	res.redirect('/');
});
module.exports = router;
