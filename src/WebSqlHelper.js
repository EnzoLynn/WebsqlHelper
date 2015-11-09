define(function(require, exports, module) {
	let jquery = require('jquery.min');
	/**
	 * [message description]
	 * @param  {[type]} options.success [description]
	 * @param  {[type]} options.msg     [description]
	 * @param  {[type]} options.result  [description]
	 * @return {[type]}                 [description]
	 * @example  var dbHelper = require('build/WebSqlHelper');
	 */
	let message = function({
		success, msg, result
	}) {
		return {
			success, msg, result
		};
	};
	let helper = {
		db: null,
		/**
		 * [createTable description]
		 * @param  {[type]}   tableName [description]
		 * @param  {[type]}   fields    [description]
		 * @param  {Function} callback  [description]
		 * @return {[type]}             [description]
         *@example dbHelper.createTable('test', {id: "integer primary key autoincrement",
			name: "not null"
		}, function(message) {
			console.log(message);
		});
		 */
		createTable: function(tableName, fields, callback) {
			const me = this;
			if (me.db == null) {
				me.openDatabase();
			}

			let sql = `CREATE TABLE IF NOT EXISTS ${tableName} (`;

			for (let key in fields) {
				let temp = fields[key] == "" ? "null" : fields[key];
				sql += `${key} ${temp},`;
			}

			sql = sql.substr(0, sql.length - 1);

			sql += ")";
			me.executeSql(sql, [], function(tx, result) {
				if (typeof(callback) == 'function') {
					callback(new message({
						success: true,
						msg: 'ok',
						result: result
					}));
				}
				return true;
			}, function(tx, errmsg) {
				if (typeof(callback) == 'function') {
					callback(new message({
						success: false,
						msg: errmsg,
						result: null
					}));
				}
				return false;
			});

		},
		/**
		 * [openDatabase description]
		 * @param  {[type]} opts [description]
		 * databaseName,version,description,size
		 * @return {[type]}      [description]
		 * @example dbHelper.openDatabase();
		 */
		openDatabase: function(opts) {
			const me = this;
			let def = {
				databaseName: 'appDatabase',
				version: '1.0',
				description: 'DB default',
				size: 2 * 1024 * 1024
			};
			def = jquery.extend(def, opts);
			me.db = openDatabase(def.databaseName, def.version, def.description, def.size);
			return me.db;
		},
		/**
		 * [executeSql description]
		 * @param  {[type]} sql    [description]
		 * @param  {[type]} params [description]
		 * @param  {[type]} sucFun [description]
		 * @param  {[type]} errFun [description]
		 * @return {[type]}        [description]
		 * @example dbHelper.executeSql('select * from logs where id=?',[3],function(tx, result){
	            	console.log(result);
	          },function(tx,errMsg){
	            	console.log(errMsg);
	          });
		 */
		executeSql: function(sql, params, sucFun, errFun) {
			const me = this;
			if (me.db == null) {
				me.openDatabase();
			}
			//transaction(querysqlFun, errorCallback, successCallback); 
			me.db.transaction(function(tx) {
				// executeSql(sqlStatement, arguments, callback, errorCallback); 
				tx.executeSql(sql, params, function(tx, result) {
					if (typeof(sucFun) == 'function') {
						sucFun(tx, result);
					}
					return true;
				}, function(tx, errmsg) {
					if (typeof(errFun) == 'function') {
						errFun(tx, errmsg);
					}
					return false;
				});

			}, function(tx, errmsg) {
				console.log(`transaction errer: ${errmsg}`);
				return false;
			}, function(tx, result) {
				return true;
			});

		},
		/**
		 * [insert description]
		 * @param  {[type]}   tableName [description]
		 * @param  {[type]}   objs      [description]
		 * @param  {Function} callback  [description]
		 * @return {[type]}             [description]
		 * @example dbHelper.insert('LOGS',{
		                  id:3,
		                 log:(new Date()).getTime()
	                    },function(message){
	            	console.log(message);
	          });
		 */
		insert: function(tableName, objs, callback) {
			const me = this;
			let prefix = `INSERT INTO ${tableName} (`;
			let mid = ') values (';
			let suffix = ')';
			let fields = '';
			let values = '';
			let params = [];
			for (let key in objs) {
				fields += key + ',';
				values += '?,';
				params.push(objs[key]);
			}
			fields = fields.substring(0, fields.length - 1);
			values = values.substring(0, values.length - 1);

			var sql = prefix + fields + mid + values + suffix;
			me.executeSql(sql, params, function(tx, result) {
				if (typeof(callback) == 'function') {
					callback(new message({
						success: true,
						msg: 'ok',
						result: result
					}));
				}
				return true;
			}, function(tx, errmsg) {
				if (typeof(callback) == 'function') {
					callback(new message({
						success: false,
						msg: errmsg,
						result: null
					}));
				}
				return false;
			});
		},
		/**
		 * [select description]
		 * @param  {[type]}   tableName    [description]
		 * @param  {[type]}   selectFileds [description]
		 * @param  {[type]}   whereObj     [description]
		 * @param  {Function} callback     [description]
		 * @return {[type]}                [description]
         * @example dbHelper.select('LOGS', '*', {				"id": 2
			},
			function(message) {
				console.log(message);
				if (message.success) {
					for (var i = 0; i < message.result.rows.length; i++) {
						console.log(message.result.rows[i]);
					};
				};
			});
		 */
		select: function(tableName, selectFileds, whereObj, callback) {

			const me = this;
			let sel = selectFileds == '' ? '*' : selectFileds;
			let prefix = `SELECT ${sel} FROM ${tableName} `;
			let where = ' where ';
			let params = [];
			let sql = prefix;
			if (typeof(whereObj) == 'object') {
				for (let key in whereObj) {

					where += `${key}=? and `;
					params.push(whereObj[key]);
				}
				where = where.substring(0, where.length - 4);
				sql += where;
			};
			me.executeSql(sql, params, function(tx, result) {
				if (typeof(callback) == 'function') {
					callback(new message({
						success: true,
						msg: 'ok',
						result: result
					}));
				}
				return true;
			}, function(tx, errmsg) {
				if (typeof(callback) == 'function') {
					callback(new message({
						success: false,
						msg: errmsg,
						result: null
					}));
				}
				return false;
			});
		},
		/**
		 * [update description]
		 * @param  {[type]}   tableName [description]
		 * @param  {[type]}   fileds    [description]
		 * @param  {[type]}   whereObj  [description]
		 * @param  {Function} callback  [description]
		 * @return {[type]}             [description]
         * @example dbHelper.update('LOGS', {			log: 'update'
		}, {
			id: 2
		}, function(message) {
			console.log(message);
		});
		 */
		update: function(tableName, fileds, whereObj, callback) {
			const me = this;
			let sql = "update " + tableName + " set ";
			let params = [],
				where = ' where ';

			for (let key in fileds) {
				sql += `${key}=?,`;
				params.push(fileds[key]);
			}
			sql = sql.substr(0, sql.length - 1);

			if (typeof(whereObj) != "undefined") {
				for (let key in whereObj) {
					where += `${key}=? and `;
					params.push(whereObj[key]);
				}
				where = where.substring(0, where.length - 4);
				sql += where;
			}

			me.executeSql(sql, params, function(tx, result) {
				if (typeof(callback) == 'function') {
					callback(new message({
						success: true,
						msg: 'ok',
						result: result
					}));
				}
				return true;
			}, function(tx, errmsg) {
				if (typeof(callback) == 'function') {
					callback(new message({
						success: false,
						msg: errmsg,
						result: null
					}));
				}
				return false;
			});
		},
		/**
		 * [delete description]
		 * @param  {[type]}   tableName [description]
		 * @param  {[type]}   whereObj  [description]
		 * @param  {Function} callback  [description]
		 * @return {[type]}             [description]
         * @example dbHelper.delete('LOGS', {			"id": 1
		});		
		 */
		delete: function(tableName, whereObj, callback) {
			const me = this;
			let sql = "delete from " + tableName;
			let where = ' where ';
			let params = [];
			if (typeof(whereObj) == 'object') {
				for (let key in whereObj) {

					where += `${key}=? and `;
					params.push(whereObj[key]);
				}
				where = where.substring(0, where.length - 4);
				sql += where;
			};

			me.executeSql(sql, params, function(tx, result) {
				if (typeof(callback) == 'function') {
					callback(new message({
						success: true,
						msg: 'ok',
						result: result
					}));
				}
				return true;
			}, function(tx, errmsg) {
				if (typeof(callback) == 'function') {
					callback(new message({
						success: false,
						msg: errmsg,
						result: null
					}));
				}
				return false;
			});
		}
	};

	module.exports = helper;

});