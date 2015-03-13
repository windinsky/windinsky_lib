

var utils = require('../utils');
var EventEmitter = require('events').EventEmitter;


var windinsky = {
	version: '1.0.2',
	author: 'windinsky',
	router: require('router'),
	controller: require('controller'),
	config:{
		'views' : '/views'
	}
};

//var set = exports.set = function(key,value){
//	if (key === 'sites') {
//		windinsky.router.setSites(value);
//	};
//	if (key === 'api') {
//		windinsky.router.setApiPath(value);
//	};
//	if (key === 'views') {
//		windinsky.middleware.set('view',value);
//	};
//	if (key === 'views options') {
//		windinsky.middleware.set('view options',value);
//	};
//	if (key === 'view engine') {
//		windinsky.middleware.setViewEngine(value,arguments[2]);
//	};
//	if (key === 'routeBasedOn') {
//		windinsky.router.setBasedOn(value);
//	};
//	windinsky.config[key] = value || windinsky.config[key];
//};

exports.use = function(module_name){
	uses.push(module_name);
	//windinsky[util.toCamule(module_name)] = module || require(module_name);
};
var uses = [];

exports.process = function(req,res){

	uses.forEach(function(u,i){
		try{
			require(u)(req,res);
		}catch(e){

		}
	});

	req.once('end',function(){
		windinsky.router.route(windinsky.config.controllers,req,res);
	});

};

exports.controller = windinsky.controller;
exports.utils = utils;

//function check_cfg(){
//	if (!windinsky.config['view engine']) {
//		throw '================================================================='+
//			'\nMiss view engine.'+
//			'\nplease add:'+
//				'\n\twindinsky.use("views engine",your_view_engine_module);'+
//			'\nto your start-server-script.'+
//			'\nFor example:'+
//			'\n\twindinsky.use("views engine",require("ejs"));'+
//			'\n=================================================================';
//	};
//	if (!windinsky.config['views']) {
//		throw '================================================================='+
//			'\nMiss views path config.'+
//			'\nplease add:'+
//				'\n\twindinsky.set("views","your_views_folder_path");'+
//			'\nto your start-server-script.'+
//			'\n=================================================================';
//	};
//}
