module.exports = function(req,res,next){
	req.flash = function(){
		var flash = req.cookie.flash;
		if(flash){
			res.cookie.set('flash','',{ maxAge:0,path:'/' });
			return JSON.parse(unescape(flash));
		}else{
			return "";
		}
	}
	res.flash = function(msg){
		res.setHeader('set-cookie','flash='+escape(JSON.stringify(msg))+'; maxAge=30; path=/');
	}
	next();
};
