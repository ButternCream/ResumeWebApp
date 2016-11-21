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

// Return the add a new school form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    account_dal.getAll(function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('skill/skillAdd', {'skill': result});
        }
    });
});

// View the resume for the given id
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.skill_name == null) {
        res.send('A skill name must be provided.');
    }
    else if (req.query.desc == null){
        res.send('A description must be provided');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        account_dal.insert(req.query, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/skill/all');
            }
        });
    }
});

// Delete a resume for the given resume-id
router.get('/delete', function(req, res){
    if(req.query.skill_id == null) {
        res.send('address_id is null');
    }
    else {
        account_dal.delete(req.query.skill_id, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/skill/all');
            }
        });
    }
});


module.exports = router;
