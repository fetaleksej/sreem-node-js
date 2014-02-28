var CHttpError = require("./HttpError");
var CInternalFileSystem = require("./InternalFileSystem");
var Class = function(charset){
	CInternalFileSystem.call(this);
	this.charset = charset;
	this.run = function(req, res){
		path = "./" + req.url;
		var require = req, response = res;
		this.getFile(path, function(data, error){ 
			this.onRun(require, response, data, error);
		});

	}
	this.onRun = function(req, res, data, error){
		var resParam = {};
		var fileName = req.url.substring(req.url.lastIndexOf("/") + 1,req.url.length);
		var format = req.url.substring(req.url.lastIndexOf(".") + 1,req.url.length);
		if( error ){
			resParam.status = error.httpCode;
			resParam.header = {
					"Accept-Ranges": "bytes", 
					"Content-Length": 0,
					"Content-Type": this.getContetType(format)
				};
			resParam.body = error.httpCode + ": " + error.Error;
		}
		else{
			resParam.status = 200;
			resParam.header = {
					"Accept-Ranges": "bytes", 
					"Content-Length": data.length,
					"Content-Transfer-Encoding": "binary",
					"Content-Type": this.getContetType(format)
				};
			resParam.body = data;	
		}
		res.writeHead(resParam.status, resParam.header);
		res.write(resParam.body);
		res.end();
	}
	this.getContetType = function(format){
		var arayTypes = {
			"jpg"	: "image/jpeg",
			"png"	: "image/png",
			"gif"	: "image/gif",
			"js"	: "application/x-javascript; charset=" + this.charset,
			"css"	: "text/css; charset=" + this.charset,
			"xml"	: "application/xhtml+xml; charset=" + this.charset
		}
		if( arayTypes[format] != undefined )
			return arayTypes[format];
		return "text/richtext";
	}
}
module.exports = Class;