var Class = function(token, sql){
	this.token = token;
	this.sql = sql;
	this.checkParams = function(arParams, arElments){
		for(var i in arElments)
			if( !(arParams[i] && arParams[i].length > arElments[i]))
				return false;
		return true;
	}
	this.run = function(req, res){
		var self = this;	
		if(req.url.split("/")[1] != "api"){
			this.onRun(req, res, {status: 404, data: {description:"Request is not api request", code: 404}});
			return;
		}
		if(req.GET["token"] != this.token){
			this.onRun(req, res, {status: 400, data:{description:"Wrong token", code:400}});
			return;
		}
		if(req.GET["method"] == "addNewResult"){
			if(!this.checkParams(req.GET,{"name": 3, "point": 0, "theme": 0})){
				this.onRun(req, res, {status: 400, data:{description:"Wrong input parametrs", code:400}});
				return;
			}
			this.sql.addNewResultTest(req.GET["name"], req.GET["point"], req.GET["theme"], function(data, err){
				self.onRun.call(self, req, res, {status: 200, data: {description:"OK", code:200, data: data}});
			});
			return;
		}
		if(req.GET["method"] == "getListResult"){
			this.sql.getListResult(function(data){
				self.onRun.call(self, req, res, {status: 200, data: {description:"OK", code:200, data: data.data}});
			});
			return;
		}
		this.onRun(req, res, {status: 400, data: { description: "Wrong method", code: 400}});
	}
	this.onRun = function(req, res, data){
		var status = 200;
		var body = "";
		if(data && data.status)
			status = data.status;
		if(data && data.data)
			body = JSON.stringify(data.data);
		res.writeHead(status, {"Content-Type": "text/html"});
		res.write(body);
		res.end();
	}
};
module.exports = Class;