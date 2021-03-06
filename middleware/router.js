var Url = require('url');
var config = {
	basedOn: function(req){
		return req.url.split('?')[0];
	}
};

var route = {
	rules:[],
	route: function(ctrl_path,req,res){
		try{
			ctrl_path += config.sites[req.headers.host].toLowerCase() + '/';
		}catch(e){
			console.log('illegal hosts:' + req.headers.host);
		}
		var m = null
			, path = config.basedOn(req).toLowerCase();
		for (var i = 0; i < route.rules.length; i++) {
			var rule = route.rules[i]
				, m = path.match(rule[0]);
			
			if (m === null) continue;

			var info = rule[1].apply(null,m.slice(1))
				, ctrl = info.controller || 'index'
				, action = info.action || 'index'
				, param = info.param || undefined;

			ctrl !== '' && (ctrl += '.js');

			var ctrl_name = ctrl === '' ? ctrl_path.substr(0,ctrl_path.length-1) : (ctrl_path + ctrl);
			if (debug) {
				ctrl = require(ctrl_name);
			}else{
				try{
					ctrl = require(ctrl_name);
				}catch(e){
					console.log('controller "' + ctrl + '" is missing.');
					return res.redirect('404.html');
				}
			}
			if (!debug) {
				if (!ctrl || !ctrl[action]) {
					console.log('action "' + action + '" for controller "' + ctrl + '" is missing.');
					return res.redirect('404.html');
				};
			};
			return ctrl[action](req,res,param);
		};
		return res.end('404');
	},
	bind: function(regExp,fn){
		this.rules.push([regExp,fn]);
	},
	process: function(fn,req,res){
		return new Controller(fn)(req,res);
	},
	setApiPath: function(path){
		config.api = path;
	},
	setViewPath: function(path){
		config.view = path;
	},
	setSites: function(sites){
		config.sites = sites;
	},
	setViewEngine: function(engin){
		config.viewEngine = engin;
	},
	setBasedOn: function(func){
		config.basedOn = func;
	}
}

module.exports = route;

route.bind(/^(\/)$/,function(){
	return {};
});

route.bind(/^\/([\w_]+)\/$/,function(ctrl){
	return {controller:ctrl};
});

route.bind(/^\/([\w_]+)\/([\w_]+)\/([\w_]+)\/$/,function(ctrl,action,params){
	return {
		controller:ctrl,
		action:action,
		param:params
	};
});

route.bind(/^\/([\w_]+)\/([\w_]+)\/$/,function(ctrl,action){
	return {
		controller:ctrl,
		action:action
	};
});
