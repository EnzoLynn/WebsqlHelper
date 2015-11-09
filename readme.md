WebSqlHelper Version 1.0
==== 
Example:<br>  
//require
//If surport es6 require('src/WebSqlHelper');
var dbHelper = require('build/WebSqlHelper');<br>  
//Open Database
dbHelper.openDatabase();
	 
//Select 
dbHelper.select('LOGS', '*', {
		"id": 2
	}, function(message) {
		console.log(message);
		if (message.success) {
			for (var i = 0; i < message.result.rows.length; i++) {
				console.log(message.result.rows[i]);
			};
		};
});
//Update
dbHelper.update('LOGS',{log:'update'},{
		id:2
	}, function(message) {
		console.log(message);		 
});
//Delete
dbHelper.delete('LOGS',{"id": 1});
	dbHelper.createTable('test',{id:"integer primary key autoincrement",name:"not null"},function(message){
		 console.log(message);
});
//Insert
dbHelper.insert('LOGS',{
		id:3,
		log:(new Date()).getTime()
	},function(message){
		console.log(message);
});