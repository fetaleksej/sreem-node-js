var charset = "utf-8";
var http = require("http");
var sys = require("util");
var HttpFile = new (require("./module/HttpFile"))(charset);
var Main = new (require("./module/Main"))(charset);
var CApplication = require("./module/CApplication");
var sql = new (require("./module/CMySqlRequest"))('fr37729.tw1.ru', 'fr37729_math', 'fr37729_math', 'xorxordiv');
var Ajax = new(require("./module/CAjax"))(sql);
//---------------------------------Server---------------------------------------------------
var ipaddr  = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port    = process.env.OPENSHIFT_NODEJS_PORT || 8080;

var server = http.createServer(function(req,res){
	var app = new CApplication(req,res,function(req, res){
		if(req.url == "/"){
			Main.run(req, res);
			return;
		}
		if(req.url.split("/")[1] == "ajax"){
			Ajax.run(req, res);
			return;
		}
		if(req.url.substring(req.url.lastIndexOf("."),req.url.length).length > 0){
			HttpFile.run(req,res);
			return;
		}
		res.writeHead(404,{"Content-Type": "text/html; charset=" + charset});
		res.write("<html><body><title>404: Not Foud</title></body></html>");
		res.end();
	});
	app.run();
});
server.listen(port, ipaddr);

//--------------------------------Server Control---------------------------------------------
/*var consoleInput = process.openStdin()
String.prototype.trim = function(){return this.replace(/^\s+|\s+$/g, '');};

consoleInput.addListener("data",function(d){
	var comand = d.toString().trim();
	if(comand == "exit"){
		server.close();
		process.kill();
		return;
	}
	if(comand == "clear"){
		Main.clearCache();
		HttpFile.clearCache();
		return;
	}
	if(comand == "clear main"){
		Main.clearCache();
		return;	
	}
	if(comand == "clear file"){
		HttpFile.clearCache();
		return;
	}
})*/
//------------------------------------------------------------------------------------