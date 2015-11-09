WebSqlHelper Version 1.0
==== 
Example:<br>  
//require<br>
//If surport es6 require('src/WebSqlHelper');<br>
var dbHelper = require('build/WebSqlHelper');<br>  
//Open Database<br>
dbHelper.openDatabase();<br>
	 
//Select <br>
```javascript
dbHelper.select('LOGS', '*', {<br>
		"id": 2<br>
	}, function(message) {<br>
		console.log(message);<br>
		if (message.success) {<br>
			for (var i = 0; i < message.result.rows.length; i++) {<br>
				console.log(message.result.rows[i]);<br>
			};<br>
		};<br>
});<br>
//Update<br>
dbHelper.update('LOGS',{log:'update'},{<br>
		id:2<br>
	}, function(message) {<br>
		console.log(message);	<br>	 
});<br>
//Delete<br>
dbHelper.delete('LOGS',{"id": 1});<br>
	dbHelper.createTable('test',{id:"integer primary key autoincrement",name:"not null"},function(message){<br>
		 console.log(message);<br>
});<br>
//Insert<br>
dbHelper.insert('LOGS',{<br>
		id:3,<br>
		log:(new Date()).getTime()<br>
	},function(message){<br>
		console.log(message);<br>
});<br>