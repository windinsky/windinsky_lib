module.exports = function(req,res,next){
	req.wants = function(){
		var accept = req.headers['accept'] || '';
		if (accept.indexOf('html') !== -1) {
			return 'html';
		};
		if (accept.indexOf('json') !== -1 || accept.indexOf('javascript') !== -1) {
			return 'json';
		};
		if (accept.indexOf('xml') !== -1) {
			return 'xml';
		};
	}
	next();
}
