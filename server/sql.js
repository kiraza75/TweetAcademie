var mysql = require('mysql');

var connection = mysql.createConnection(
{
  host     : 'localhost',
  user     : 'root',
  password : '******',
  database : 'tweet_academie'
});

connection.connect();
 
module.exports = connection;