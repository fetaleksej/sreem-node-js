var mysql = require('./mysql');
var CLogicRating = require("./CLogicRating");

var Class = function(host, db, user, password){
	var self = this;
	this.errors = [];
	this.cache = {};
	this.timerHandle;
	this.connectOptions = {
	  host     : host,
	  user     : user,
	  password : password,
	}

	this.getListResult = function(callback){
		if( typeof(callback) != "function")
			return;
		if(this.cache && this.cache.listResult){
			callback.call(this, this.cache.listResult);
			return;
		}
		var onRequest = callback;
		this.createConnection(function(){
			if(err = this.getLastError()){
				onRequest.call(this, null, err);
				return;
			}
			var self = this;
			this.connection.query("SELECT * FROM `result` ORDER BY `date_create` DESC LIMIT 8",function(err, rows, field){
				if(err){
					onRequest.call(self, null);
					return;
				}
				var arResult = []
				var point = new CLogicRating();
				for(i in rows){
					var resPoints = {"5": point.getWPointBy100(rows[i].result), "16": point.get16PointBy100(rows[i].result),"100": rows[i].result};
					arResult.push({name : rows[i].name, date: rows[i].date_create, point: resPoints});
				}
				arResult = {date: (new Date()).getTime(), data: arResult};
				self.cache.listResult = arResult;
				onRequest.call(self, arResult);
			});
		});
	}
	this.getStatisticsData = function(callback){
		if( typeof(callback) != "function" )
			return;
		if(this.cache && this.cache.statistics){
			callback.call(this, this.cache.statistics);
			return;
		}
		var onRequest = callback;
		this.createConnection(function(err){
			if(err = this.getLastError()){
				onRequest.call(this, null, err);
				return;
			}
			var self = this;
			this.connection.query(	"SELECT result.*, theme.name as theme_name, theme.description as theme_description FROM `result`,`theme` WHERE result.id_theme = theme.id",
				function(err, rows, field){
					if(err){
						onRequest.call(self, null, err);
						return;
					}
					var point = new CLogicRating();
					var resTheme = {};
					for(i in rows){
						point.push(rows[i].result);
						resTheme[rows[i].theme_name] ? resTheme[rows[i].theme_name]++ : resTheme[rows[i].theme_name] = 1;
					}
					var resPoint = {"5": point.statWPoints, "16": point.stat16Points, "100": point.stat100Points};
					var arResult = {date: (new Date()).getTime(), data: {theme: resTheme, point: resPoint}};
					self.cache.statistics = arResult;
					onRequest.call(self, arResult, null);	
			});
		});
	} 
	this.addNewResultTest = function(name, point, theme, callback){
		if(typeof(callback) != "function")
			return;
		this.createConnection(function(err){
			if(err = this.getLastError()){
				callback.call(this, err);
				return;
			}
			var self = this;
			this.connection.query('INSERT INTO `result`(`name`, `id_theme`, `result`) VALUES ("'+ name +'", ' + theme + ', ' + point + ')', function(err, rows, field){
				var result = true;
				if(err)
					result = false;
				if(result)
					self.clearCache.call(self);

				callback.call(self, result, err);
			});
		})
	}
	this.createConnection = function(callback){
		this.errors = Array();
		if(typeof(callback) != "function")
			return;
		clearTimeout(this.timerHandle);
		var self = this;
		if(this.connection){
			this.timerHandle = setTimeout(function(){
				self.closeConnection.call(self);
			},5000);
			callback.call(this, null);
			return;
		}
		this.connection = mysql.createConnection(this.connectOptions);
		this.connection.connect(function(err){
			self.errors.push(err);
		});
		this.connection.query("USE " + db, function(err, rows, field){
			self.errors.push(err);
		});
		this.timerHandle = setTimeout(function(){
			self.closeConnection.call(self);
		},5000);
		callback.call(this, null);
	}
	this.closeConnection = function(){
		if(this.connection)
			this.connection.end();
		this.connection = null;
	}
	this.getLastError = function(){
		return this.errors.pop();
	}
	this.clearCache = function(){
		this.cache = {};
	}
	this.end = function(){
		if(this.connection)
			this.connection.end();
	}
}
module.exports = Class;