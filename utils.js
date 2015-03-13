/*
	Provide tool functions to windinsky module
	author: wangningbo
	data:2013/11/17
	modify-log:
	-----------------------------------------------------------------------------------------
	|	NAME 		DATE		LOG 														|
	|	wangningbo	2013/11/17	add toCamule function 										|
	-----------------------------------------------------------------------------------------
*/

exports.toCamule = function(str){
	var result = '',start = 0;
	for (var i = 0; i < str.length; i++) {
		var s = str[i];
		if(s.match(/[^\w\d]/)){
			start = 1;
			continue;
		}
		result += start ? s.toUpperCase() : s;
		start = 0;
	};
};

exports.extend = function(target,params,inject){
	if (!params) return target;
	if (inject) {
		for(var i in params){
			target[i] = params[i];
		}
		return ;
	};
	var obj = {};
	for(var i in target){
		obj[i] = target[i];
	}
	for(var i in params){
		obj[i] = params[i];
	}
	return obj;
};