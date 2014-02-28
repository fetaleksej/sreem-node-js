var sql = new (require("./module/CMySqlRequest"))('fr37729.tw1.ru', 'fr37729_math', 'fr37729_math', 'xorxordiv');
sql.getListResult(function(data){
	console.log(data);
})
sql.end();