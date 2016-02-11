var EventEmitter = require('events').EventEmitter
    , util = require('util')
    , url = require( 'url' )
    , http = require( 'http' )

function Action( func , restrict , domain_config ){
	EventEmitter.call(this);
	var self = this;
    self.domain_config = domain_config || {};
	this.execute = function(req,res){
        this.req = req;
        this.res = res;
		if(restrict){
			var method = req.method.toLowerCase();
			var _method = req.__post._method;
			if(restrict.indexOf(method) == -1 && restrict.index(_method) == -1){
				return self.emit('error',{
					code:404,
					msg: 'method `'+req.method.toLowerCase()+'` is not supported'
				});
			}
		}

		if(global.DEBUG){
			return func.call(this,req,res);
		}else{
			try{
				func.call(this,req,res);
			}catch(e){
				console.log(e);
				self.emit('error',500);
			}
		}
	}
}

util.inherits(Action,EventEmitter);

Action.prototype.ajax = function( url ){

    if( !this.domain_config ) throw '没有声明多域名';
    console.log('laile action')
    var self = this;

    var domain_short = url.split('::')[0] , domain = this.domain_config[ domain_short ];

    var headers = this.req.headers;
    delete headers.hosts;

    
    var options = { host : domain , path : url.split('::')[1] , method : this.req.method , headers : headers };

    var connector = http.request( options , function( response ){
        self.res.writeHeader( response.statusCode , response.headers );
        response.pipe( self.res , { end : true } );
    });

    this.req.pipe( connector );

    connector.end();

}

Action.prototype.send = function( interfaces , callback ){
    
    this.__count = 0;
    this.__result_data = {};
    this.__result_error = undefined;
    for(var i in interfaces){
        this.__count++;
        this._send( interfaces[i] , i , callback );
    }

};

Action.prototype._send = function( url , key , callback ){

    var self = this;

    if( !this.domain_config ) throw '没有声明多域名';

    var domain_short = url.split('::')[0] , domain = this.domain_config[ domain_short ];
    var headers = this.req.headers;
    delete headers.host;
    
    var options = { host : domain , path : url.split('::')[1] , method : this.req.method , headers : headers };

    var connector = http.request( options , function( response ){

        var data = '';

        response.on( 'data' , function( chunk){
            data += chunk;
        });

        response.once( 'end' , function(){
            self.count--;
            try{
                self.__result_data[key] = JSON.parse( data );
            }catch( e ){
                self.__result_error = self.__result_error || {};
                self.__result_error[key] = 'interface ' + key + ' parse failed, url : ' + url + ', content:' + data ;
            }
            if( !self.count ){
                callback( self.__result_error , self.__result_data );
            }
        });

    });

    connector.write( this.req.body || '' );

    connector.on( 'error' , function( err ){

        self.count--;
        self.__result_data[key] = undefined;
        self.__result_error = self.__result_error || {};
        self.__result_error[key] = err;

        if( !self.count ){
            callback( self.__result_error , self.__result_data );
        }
    
    });

    connector.end();

};

module.exports = Action;
