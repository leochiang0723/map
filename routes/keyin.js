var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.passport) {
        res.render('keyin');
    } else {
        res.redirect('/login');
    }

});

module.exports = router;