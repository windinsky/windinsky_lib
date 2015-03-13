/*
	wrap request and response for better using
	author: wangningbo
	data:2013/11/17
	modify-log:
	-----------------------------------------------------------------------------------------
		NAME 		DATE		LOG
		wangningbo	2013/11/17	add cookie wrapper
		wangningbo	2013/11/17	add session wrapper
	-----------------------------------------------------------------------------------------
*/
var utils = require('../../utils');
var middleware = {
	req: [],
	res: [],
	config: {}
};

exports.process = function(req,res,emitter){
	var count = middleware.req.length;
	emitter.on('done',function(){
		count--;
		if(count == 0){
			emitter.ended = true;
			emitter.emit('end');
		}
	});
	wrapRequest(req,emitter);
	wrapResponse(res);
	return emitter;
}

function wrapRequest(req,emitter){
	for (var i = 0; i < middleware.req.length; i++) {
		middleware.req[i].processRequest(req,emitter);
	};
}
function wrapResponse(res){
	for (var i = 0; i < middleware.res.length; i++) {
		middleware.res[i].processResponse(res);
	};
}

exports.wrapRequest = wrapRequest;
exports.wrapResponse = wrapResponse;

exports.add = function(name,_middleware){
	var mw = _middleware || require('./'+name);
	switch(mw.type){
		case 'request':
			middleware.req.push(mw);
			break;
		case 'response':
			middleware.res.push(mw);
			break;
		default:
			middleware.req.push(mw);
			middleware.res.push(mw);
			break;
	}
};

exports.setViewEngine = function(engine,default_filters){
	middleware.res.push({
		processResponse: function(res){
			res.render = function(view,opt,filter){
				var _script = '';
				utils.extend(opt,middleware.config['view options'],true);
				// utils.extend(opt,{
				// 	__delayScript: function(script){
				// 		_script = script;
				// 		return '';
				// 	},
				// 	__delayedScript: function(){
				// 		return _script;
				// 	}
				// },true);
				for(var i in filter){
					engine.filters[i] = filter[i];
				}
				for(var i in default_filters){
					engine.filters[i] = default_filters[i];
				}
				return engine.renderFile(middleware.config.view+view+'.html',opt,function(err,template){
					res.writeHead(200,{
						'Content-Type':'text/html;charset=utf-8',
						'Server':'wellyer',
						'Company':'wellyer',
						'Access-Control-Allow-Origin':'static.wellyer.com'
					});
					if (err) throw err;
					return res.end(template+'\n');
				});
			},
			res.json = function(json){
				res.writeHead(200,{
					'Content-Type':'application/json;charset=utf-8',
					'Server':'windinsky'
				});
				return res.end(JSON.stringify(json));
			}
		}
	});
};

exports.set = function(name,value){
	middleware.config[name] = value;
}
