var url = require('url');
var formidable = require('formidable');

module.exports = function(req,res,next){
	var form = new formidable.IncomingForm();
	req.__get = {};
	req.__post = {};
	var loaded = false;
	form.parse(req,function(err,fields,files){
		req.fields = fields;
		req.files = files;
		if(loaded){
			next();
		}else{
			loaded = true;
		}
	});

	req.once('data',function(data){
		if(!req.body)
			req.body = data.toString();
		else
			req.body += data.toString();
	});

	req.once('end',function(){
		req.__get = url.parse(req.url,true).query;
		try{
			req.__post = url.parse('?'+req.body,true).query;
		}catch(e){
		}
		if(loaded){
			next();
		}else{
			loaded = true;
		}
	});
};
