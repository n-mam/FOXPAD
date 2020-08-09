 var mysql = require('mysql');
 
 var pool  = mysql.createPool({
     host     : 'localhost',
     user     : 'root',
     password : 'welcome',
     database : 'foxpad',
     port     : 3306,
     timezone : "+00:00",
     dateStrings : true,
     multipleStatements: true
 });
 
 var exec = function(s, c) {
   console.log(`Executing sql : [${s}]`);
   pool.query(s, c);
 }

 var esc = function(s) {
   return mysql.escape(s);
 }

 module.exports = { exec, esc };
