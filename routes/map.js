var express = require('express');
var router = express.Router();
var db = require('../db.js');
var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {

    var province = ["廣東省", "浙江省", "江蘇省", "山東省", "四川省", "福建省", "雲南省", "海南省", "河南省", "湖南省", "河北省", "湖北省", "安徽省", "陝西省", "江西省", "貴州省", "遼寧省", "山西省", "黑龍江省", "甘肅省", "吉林省", "青海省"];
    var data = [];

    async.forEachOf(province, function(dataElement, i, inner_callback) {
        console.log(dataElement);

        db.query('SELECT COUNT(province) AS cts FROM city_info WHERE province = ?', [dataElement], function(err, result, row) {
            if (!err) {
                console.log(result);
                data.push([dataElement, result[0].cts]);
                inner_callback(null);
            } else {
                console.log("[mysql error] QQ", err);
                inner_callback(err);
            }
        });
    }, function(err) {
        if (err) {
            //handle the error if the query throws an error
            console.log("ERRRRRRRR");
        } else {
            //whatever you wanna do after all the iterations are done
            console.log("data: " + data);
            res.render('map', { test: data });
        }
    });

});


module.exports = router;