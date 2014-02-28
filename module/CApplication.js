var qs = require('querystring');
String.prototype.trim = function(){return this.replace(/^\s+|\s+$/g, '');};

var Class = function(req, res, onChange){
	this.request = req;
	this.response = res;
	this.onChange = onChange;
	this.countOnRun = 0;
	this.countNeedRun = 1;
	this.body = "";
	this.parseParamHeader = function(param){
		var explodeParams = param.split("; ");
		var arSubParams = {};
		arSubParams.params = {};
		for( item in explodeParams){
			if(item == 0){
				arSubParams.value = explodeParams[item];
				continue;
			}
			var subExplode = explodeParams[item].split("=");
			arSubParams.params[subExplode[0]] = subExplode[1].replace(/"/g,"");
		}
		return arSubParams;
	}
	this.parseHeader = function(header){
		var strHeader = header.split("\r\n");
		var arHeaders = Object();
		for(item in strHeader){
			var subStr = strHeader[item].split(": ");
			arHeaders[subStr[0]] = this.parseParamHeader(subStr[1]);
		}
		return arHeaders;
	}
	this.parseMultipart = function(body, boundory, callback){
		var params = body.split("--" + boundory);
		var retParams = Array();
		for(var i = 0; i < params.length; i++){
			params[i] = params[i].trim();
			if(!params[i] || params[i] == "--")
				continue;
			var header = params[i].split("\r\n\r\n");
			var data = null;
			if(header[1])
				data = header[1];
			header = this.parseHeader(header[0]);
			retParams.push({"data":data, "header":header});
		}
		callback.call(this, retParams);
	};
	this.run = function(){
		this.countOnRun = 0;
		this.countNeedRun = 1;
		this.paramsConvert();
	};
	this.onRun = function(){
		if( ++this.countOnRun == this.countNeedRun )
			this.onChange(this.request, this.response);
	};
	this.paramsConvert = function(){
		var url = this.request.url;
		var params = qs.parse(url.substr( url.indexOf("?") != -1 ? url.indexOf("?") + 1 : url.length));
		url = url.substr(0, url.indexOf("?") != -1 ? url.indexOf("?") : undefined);
		this.request.url = url;
		this.request.GET = params;
		this.request.POST = {};
		this.request.FILES = {};

		if(req.method == "POST"){
			var self = this;
			var body = "";
			req.on("data", function(data){
				body += data;
			});
			req.on("end", function(){
				if(self.request.headers["content-type"].indexOf("boundary=") == -1){
					self.request.POST = qs.parse(body.toString);
					self.onRun();
					return;
				}
				var boundary = self.parseParamHeader.call(self,self.request.headers["content-type"]).params["boundary"];
				self.parseMultipart.call(self, body, boundary, function(params){
					for(item in params){
						if( params[item].header["Content-Type"] && params[item].header["Content-Type"].value == "application/octet-stream"){
							this.request.FILES[params[item].header["Content-Disposition"].params.name] = {
								data: new Buffer( params[item].data ? params[item].data : 0 ),
								name: params[item].header["Content-Disposition"].params.filename
							};
						}
						else{
							this.request.POST[params[item].header["Content-Disposition"].params.name] = params[item].data;
						}
					}
					this.onRun();
				});
			});
			return;
		}
		this.onRun();
	}
}
module.exports = Class;