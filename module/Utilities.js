var qs = require('querystring');
String.prototype.trim = function(){return this.replace(/^\s+|\s+$/g, '');};

var Class = function(req, res, onChange){
	this.request = req;
	this.response = res;
	this.onChange = onChange;
	this.countOnRun = 0;
	this.countNeedRun = 1;
	this.body = "";
	this.parseHeader = function(header){
		var strHeader = header.split("\n");
		var arHeaders = Object();
		for(item in strHeader){
			var subStr = item.split(": ");
			arHeaders[subStr[0]] = subStr[1].split("; ");
			var newSubElement = Array();
			for(subItem in arHeaders[subStr[0]]){
				var arSubParams = subItem.split("=");
				if( arSubParams.length < 1 )
					newSubElement.push({key: arSubParams[0], item: arSubParams[1]});
				else
					newSubElement.push({key: "", item: arSubParams[0]});
			}
			arHeaders[subStr[0]] = newSubElement;
		}
		return arHeaders;
	}
	this.parseMultipart = function(body, boundory, callback){
		var params = body.split(boundory);
		for(var i = 0; i < params.length; i++){
			var header = params[i].split("\n\n");
			var data = header[1];
			header = this.parseHeader(header[0]);
			console.log(header);
		}
		callback.call(this, params);
	};
	this.run = function(){
		this.countOnRun = 0;
		this.countNeedRun = 1;
		this.paramsConvert();
	};
	this.onRun = function(){
		this.countOnRun++;
		if( this.countOnRun == this.countNeedRun )
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
				if(self.request.headers["content-type"].indexOf("boudary=") == -1){
					self.request.POST = qs.parse(body);
				}
				self.parseMultipart.call(self, body, function(){
					
				});
			});
		};
	}
}