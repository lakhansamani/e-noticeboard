var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var gcm=require("node-gcm");
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('./auth');
var MongoStore = require('connect-mongo')(session); // helps storing session in db
var category = require('./models/category.js');
var token=require('./models/token');
var dburi="mongodb://admin:admin@ds041583.mongolab.com:41583/serverboard";
var db=mongoose.connect(dburi);

var routes = require('./routes/index');
var users = require('./routes/users');
var categories = require('./routes/categories');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// view engine setup
app.set('port',4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(cookieParser());
app.use(session({
    secret: 'kasdfsdf3242342423',
    store: new MongoStore({
        mongooseConnection:mongoose.connection
    }),
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/category',categories);
app.get('/noticeboard',function(req,res){
    res.sendFile(__dirname + '/index.html');
});
app.get('/clientboard',function(req,res){
    res.sendFile(__dirname + '/clientboard.html');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    token.find({},function(err,result){
      if(err){
        console.log(err);
      }
      else{
        var device_tokens = [];
        for(var i=0;i<result.length;i++){
          device_tokens.push(result[i].token);
          var message = new gcm.Message();
          var sender = new gcm.Sender('AIzaSyB4SjcrgIdadpuAvkbTAiuqi2vtJFlrkOM');
          message.addData('title', 'New message');
          message.addData('message', 'You have new notice please noticeboard');
          message.addData('sound', 'notification');

          message.collapseKey = 'testing';
          message.delayWhileIdle = true;
          message.timeToLive = 3;
        }
        sender.send(message, device_tokens, 4, function(result){
          console.log(result);
          console.log('push sent to: ' + device_tokens);
        });
      }
    })
    var c = new category({
			name:msg.title,
			user_id:null,
      description:msg.description
		})
		c.save(function(err){
			if(err){
				console.log(err);
			}
			else{
        var stringData="<b>"+msg.title+"</b><br/><p>"+msg.description+"</p>";
        io.emit('chat message',stringData);
			}
		})
  });
});
http.listen(process.env.PORT ||3000, function(){
  console.log('listening on port 3000');
});
