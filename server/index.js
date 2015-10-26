

var express 		= require('express');
var app 			= express();
var path 			= require('path');
var request 		= require('request');
var qs				= require('qs');

//Globals
var publicPath  	= path.join(__dirname, '../public');
var basePath 		= path.join(publicPath + '/views/');

//Set View Engine
//var engines 		= require('consolidate');
app.set('views', basePath);
app.set('view engine', 'jade')

//Pocket Creds
var auth_url 		= 'https://getpocket.com/v3/oauth/request';
var api_base 		= 'https://getpocket.com/v3/get';
var consumer_key 	= '47223-a06b16ff1189ac15f5d76440';
var redirect_uri  	= 'http://socialmonster.com/authSuccess';
var token;

//Middleware
console.log('registering ' + publicPath + ' as static');
app.use(express.static(publicPath));
app.use(express.static(basePath));

//Routes
app.route('/').get(home);
app.route('/auth').get(auth);
app.route('/authSuccess').get(authSuccess);



function auth(req, res) {
	var req_obj = {	
		url: 'https://getpocket.com/v3/oauth/request', 
		form: {
			'consumer_key': consumer_key, 
			'redirect_uri': redirect_uri
		}
	};

	request.post(req_obj, function (error, r, code) {
	  if (!error && res.statusCode == 200) {
	  	token = code.split('=')[1];
	    res.redirect('https://getpocket.com/auth/authorize?request_token=' + token + '&redirect_uri=' + redirect_uri);
	  } else {
	  	console.log(error);
	  }
	});
}

function authSuccess(req, res){
	var req_obj = {	
		url: 'https://getpocket.com/v3/oauth/authorize', 
		form: {
			'consumer_key': consumer_key, 
			'code': token
		}
	};

	request.post(req_obj, function (error, r, data) {
	  if (!error && r.statusCode == 200) {
	  	var data = qs.parse(data);
	    res.render('authSuccess', data);
	  } else {
	  	console.log(error);
	  }
	});
	//res.sendFile(path.join(basePath + 'authSuccess.html'));
}

function home(req, res){
	res.sendFile(path.join(basePath + 'index.html'));
}

var server = app.listen(3000, function () {
  console.log('Example app listening at port 3000');
});