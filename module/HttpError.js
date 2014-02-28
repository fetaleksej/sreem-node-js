var Class = function(message, code){
	this.httpCode = code;
	this.Error = message;
}
Class.prototype = Error();
module.exports = Class;
