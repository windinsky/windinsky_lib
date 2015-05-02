module.exports = function(req,res,next){
	res.redirect = function(path,data){
		var headers = {
			'Location': path
		};
		if (data) {
			try{
				headers['set-cookie'] = "flash="+escape(JSON.stringify(data))+"; Max-Age=100000; path=/;";
			}catch(e){
				console.log(e);
			}
		};
		res.writeHeader(302,headers);
		res.end();
	};
	next();
}
