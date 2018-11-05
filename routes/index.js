var express = require('express');
var router = express.Router();
var db = require('../db.js');

// /* GET home page. */
router.get('/', function(req, res) {

    if (req.session.passport) {
        var userID = req.session.passport.user;
        db.query('SELECT * FROM login WHERE id = ?', [userID], function(err, result, row) {
            if (err) console.log("[mysql error]", err);
            var auth_check;
            auth_check = result;
            console.log("This is from index.js" + result);
            res.render('index', { auth_check: auth_check });

        })
    } else {
        res.render('index', { auth_check: null });
    }
});


module.exports = router;