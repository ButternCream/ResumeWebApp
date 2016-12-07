var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.getAll = function(callback) {
    var query = 'SELECT * FROM resume_view;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(school_id, callback) {
    var query = 'SELECT * FROM resume_view WHERE resume_id = ?';
    var queryData = [school_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.insert = function(params, callback) {
    var query = 'INSERT INTO resume (resume_name, account_id) VALUES (?, ?)';

    // the question marks in the sql query above will be replaced by the values of the
    // the data in queryData
    var queryData = [params.resume_name, params.account_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

exports.delete = function(resume_id, callback) {
    var query = 'DELETE FROM resume WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

/*
 * BEGIN LAB 12
*/

//declare the function so it can be used locally
var resumeInsertAll = function(resume_id, skillIdArray, schoolIdArray, companyIdArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO resume_skill (resume_id, skill_id) VALUES ?';
    var query2 = 'INSERT INTO resume_school (resume_id, school_id) VALUES ?';
    var query3 = 'INSERT INTO resume_company (resume_id, company_id) VALUES ?';
    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var resumeSkillData = [];
    for(var i=0; i < skillIdArray.length; i++) {
        resumeSkillData.push([resume_id, skillIdArray[i]]);
    }
    var resumeSchoolData = [];
    for(i=0; i < schoolIdArray.length; i++) {
        resumeSchoolData.push([resume_id, schoolIdArray[i]]);
    }
    var resumeCompanyData = [];
    for(i=0; i < companyIdArray.length; i++) {
        resumeCompanyData.push([resume_id, companyIdArray[i]]);
    }

    connection.query(query, [resumeSkillData], function(err, result){
        if (err){
            callback(err, result);
        }
        connection.query(query2, [resumeSchoolData], function(err, result){
           if (err){
               callback(err, result);
           }
           connection.query(query3, [resumeCompanyData], function(err, result){
              callback(err, result);
           });
        });
    });
};

//export the same function so it can be used by external callers
module.exports.resumeInsertAll = resumeInsertAll;

//declare the function so it can be used locally
var resumeDeleteAll = function(resume_id, callback){
    var query = 'DELETE FROM resume_skill WHERE resume_id = ?';
    var query2 = 'DELETE FROM resume_school WHERE resume_id = ?';
    var query3 = 'DELETE FROM resume_company WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        if (err){
            callback(err, result);
        }
        connection.query(query2, queryData, function(err, result) {
            if (err){
                callback(err, result);
            }
            connection.query(query3, queryData, function(err, result) {
                callback(err ,result);

            });
        });

    });
};
//export the same function so it can be used by external callers
module.exports.resumeDeleteAll = resumeDeleteAll;

exports.update = function(params, callback) {
    var query = 'UPDATE resume SET resume_name = ? WHERE resume_id = ?';
    var queryData = [params.resume_name, params.resume_id];

    connection.query(query, queryData, function(err, result) {
        //delete company_address entries for this company
        resumeDeleteAll(params.resume_id, function(err, result){
            if(params.skill_id != null) {
                //insert company_address ids
                resumeInsertAll(params.resume_id, params.skill_id, params.school_id, params.company_id, function(err, result){
                    callback(err, result);
                });}
            else {
                callback(err, result);
            }
        });
    });
};

/*  Stored procedure used in this example
 DROP PROCEDURE IF EXISTS company_getinfo;

 DELIMITER //
 CREATE PROCEDURE company_getinfo (_company_id int)
 BEGIN

 SELECT * FROM company WHERE company_id = _company_id;

 SELECT a.*, s.company_id FROM address a
 LEFT JOIN company_address s on s.address_id = a.address_id AND company_id = _company_id;

 END //
 DELIMITER ;

 # Call the Stored Procedure
 CALL company_getinfo (4);

 */

exports.edit = function(resume_id, callback) {
    var query = 'CALL resume_getstats(?)';
    var queryData = [resume_id];

    connection.query(query, queryData, function (err, result) {
        callback(err, result);
    });
};
