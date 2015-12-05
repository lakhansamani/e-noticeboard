var express = require('express');
var router = express.Router();
var passport = require('./../auth');
var user=require('./../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/login',passport.authenticate('local',{
	failureRedirect:'/',
	successRedirect:'/home'
}));
router.get('/client_login',function(req,res){
	res.render('client_login',{'title':'login'});
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
