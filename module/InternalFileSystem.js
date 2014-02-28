var fs = require("fs");
var CHttpError = require("./HttpError");

var Class = function(){
	this.getFile = function(path, loadFile){
		var onLoadFile = loadFile;
		if( this.arrayFile[path] != undefined ){
			this.arrayFile[path].count++;
			onLoadFile.call(this, this.arrayFile[path].data, null);
			return;
		}
		var self = this;
	    function callback(error, data){
			if( error != null ){
				var retError;
				if( error.errno == 34 )
					retError = new CHttpError("Not Found", 404);
				else 
					retError = new CHttpError("Internal Server Error", 500);
				onLoadFile.call(self, {}, retError);
				return;
			}
			self.arrayFile[path] = { path: path, count: 1, data: data};
			onLoadFile.call(self, self.arrayFile[path].data, null);
		}
		fs.readFile(path,{},callback);
	}
	this.arrayFile = Object();
	this.onTime = function(){
		for(var item in this.arrayFile){
			this.arrayFile[item].count--;
			if( !this.arrayFile[item].count )
				delete this.arrayFile[item];
		}
		var self = this;
		setTimeout(function(){
			self.onTime.call(self);
		}, 20000);
	};
	this.onTime();
	this.clearCache = function(){
		delete this.arrayFile;
		this.arrayFile = Object();
	}
}
module.exports = Class;
