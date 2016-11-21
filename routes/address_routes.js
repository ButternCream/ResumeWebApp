/**
 * Created by scott on 11/9/2016.
 */
var express = require('express');
var router = express.Router();
var account_dal = require('../model/address_dal');


// View All accounts
router.get('/all', function(req, res) {
    account_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('address/addressViewAll', { 'result':result });
        }
    });

});

// View the account for the given id
router.get('/', function(req, res){
    if(req.query.address_id == null) {
        res.send('account is null');
    }
    else {account_dal.getById(req.query.address_id, function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('address/addressViewById', {'result': result});
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
            res.render('address/addressAdd', {'address': result});
        }
    });
});

// View the resume for the given id
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.street == null) {
        res.send('A street must be provided.');
    }
    else if (req.query.zip_code == null){
        res.send('A zip code must be provided');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        account_dal.insert(req.query, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/address/all');
            }
        });
    }
});

// Delete a resume for the given resume-id
router.get('/delete', function(req, res){
    if(req.query.address_id == null) {
        res.send('address_id is null');
    }
    else {
        account_dal.delete(req.query.address_id, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/address/all');
            }
        });
    }
});

module.exports = router;
