var express = require('express');
var router = express.Router();
var db = require('../db.js');
var querystring = require('querystring');

/* GET info's listing. */
router.get('/', function(req, res, next) {
    var auth_check = null;
    if (req.session.passport) {
        console.log(req.session.passport.user);
        db.query('SELECT * FROM login WHERE id = ?', [req.session.passport.user], function(err, result, row) {
            if (err) console.log("[mysql error]", err);
            auth_check = result;
            console.log(result);

        });
    }
    var querycity = req.query.area;
    //auth_check= [{'id':'0', 'auth_level':'1'}]; //TOM: for debugging test
    db.query('SELECT * FROM city_info WHERE province=(?)', [querycity], function(err, result, row) {
        if (err) console.log("[mysql error]", err);
        var data = result;
        res.render('info', { data: data, auth_check: auth_check });
        console.log(req.query.area);
    })
});


module.exports = router;