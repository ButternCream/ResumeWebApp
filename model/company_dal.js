var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.getAll = function(callback) {
    var query = 'SELECT * FROM company;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(school_id, callback) {
    var query = 'SELECT * FROM company WHERE company_id = ?';
    var queryData = [school_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};