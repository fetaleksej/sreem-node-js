var sql = new (require("./module/CMySqlRequest"))('fr37729.tw1.ru', 'fr37729_math', 'fr37729_math', 'xorxordiv');
sql.addNewResultTest("Alex Fet 1991", 2, 88, function(date){
	console.log(date);
});