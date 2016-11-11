/**
 * Created by scott on 11/9/2016.
 */
var express = require('express');
var router = express.Router();
var account_dal = require('../model/skill_dal');


// View All accounts
router.get('/all', function(req, res) {
    account_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('skill/skillViewAll', { 'result':result });
        }
    });

});

// View the account for the given id
router.get('/', function(req, res){
    if(req.query.skill_id == null) {
        res.send('account is null');
    }
    else {account_dal.getById(req.query.skill_id, function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('skill/skillViewById', {'result': result});
        }
    });
    }
});

module.exports = router;
