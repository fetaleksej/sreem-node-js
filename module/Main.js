var CInternalFileSystem = require("./InternalFileSystem");
var Class = function(charset){
	CInternalFileSystem.call(this);
	this.charset = charset;
	this.run = function( req, res ){
		var request = req, response = res;
		this.getFile("./html/index.html", function(data, error){
			this.onRun(request, response, data, error);
		});
	}
	this.onRun = function(req, res, data, error){
		var htmlString = data.toString();
		var resParam = {};
		if( error ){
			resParam.status = error.httpCode;
			resParam.header = {"Content-Type": this.getContetType(format)};
			resParam.body = error.httpCode + ": " + error.Error;
		}
		else{
			resParam.status = 200;
			resParam.header = {"Content-Type": "text/html; charset=" + this.charset};
			resParam.body = htmlString;	
		}
		res.writeHead(resParam.status, resParam.header);
		res.write(resParam.body);
		res.end();
	}
}
module.exports = Class;