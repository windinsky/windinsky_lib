var engine = require('ejs');
var utils = require('../utils');
var path = require('path');

module.exports = function(req,res,next,options){

	res.render = function(view,opt,filter){

		for(var i in filter){
			engine.filters[i] = filter[i];
		}

		var viewPath = options.viewPath;

		if(typeof viewPath == 'function'){
			viewPath = viewPath(req);
		}

		var file_name = view.indexOf('.') == -1 ? view + (options.view_file_suffix || '') : view;
		var file_path = path.resolve(viewPath , file_name )

		if(options.default_variables){
			opt = utils.extend( options.default_variables , opt );
		}
		
		return engine.renderFile( file_path , opt , function(err,template){

			if (err) throw err;

			opt = opt || {};

			var headers = { 'Content-Type':'text/html;charset=utf-8' };

			if(!options.headers || !options.headers.framework){
				options.headers = options.headers || {};
				options.headers.framework = 'windinsky';
			}

			utils.extend(headers,options.headers);
			opt.__headers && utils.extend(headers,opt.__headers)

			res.writeHead(200,headers);

			return res.end(template+'\n');
		});
	};
	res.json = function(json){
		res.writeHead(200,{
			'Content-Type':'application/json;charset=utf-8',
			'Server':'windinsky'
		});
		return res.end(JSON.stringify(json));
	}
	next();
}
