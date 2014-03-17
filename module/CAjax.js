var Class = function(sql){
	this.sql = sql;
	this.run = function(req, res){
		if(req.url.split("/")[1] != "ajax"){
			this.onRun(req, res);
			return;
		}
		var request = req, respons = res;
		var self = this;
		if(req.GET["method"] == "list"){
			this.sql.getListResult(function(item){
				if( !item ){
					self.onRun.call(self, request, respons);
					return;
				}
				if( item.date == request.GET["timestamp"] ){
					self.onRun.call(self, request, respons);
					return;
				}
				if(req.GET["pointType"] != 16 && req.GET["pointType"] != 100)
					req.GET["pointType"] = 5;
				var retItem = {}
				retItem.date = item.date;
				retItem.data = Array();
				for(i in item.data){
					retItem.data.push({name: item.data[i].name, date: item.data[i].date, point: item.data[i].point[req.GET["pointType"]]});
				}
				self.onRun.call(self, request, respons, retItem);
			});
			return;
		}
		if(req.GET["method"] == "statistic"){
			this.sql.getStatisticsData(function(item){
				if( !item ){
					self.onRun.call(self, request, respons);
					return;
				}
				if( item.date == request.GET["timestamp"] ){
					self.onRun.call(self, request, respons);
					return;
				}
				if(req.GET["pointType"] != 16 && req.GET["pointType"] != 100)
					req.GET["pointType"] = 5;
				var retItem = {}
				retItem.date = item.date;
				retItem.data = {};
				retItem.data.theme = item.data.theme;
				retItem.data.point = item.data.point[req.GET["pointType"]];
				self.onRun.call(self, request, respons, retItem);
			});
			return;
		}
		this.onRun(req, res);
	}
	this.onRun = function(req, res, data){
		var content = "";
		if(data)
			content = JSON.stringify(data);
		res.writeHead(200,{"Content-Type": "text/html"});
		res.write(content);
		res.end();
	}
}
module.exports = Class;