var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var logger = require('morgan');
var formidable = require('formidable');
var fs = require('fs');
var db = require('./db.js');
var xlsxj = require("xlsx-to-json");
var Passport = require('passport');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');


var indexRouter = require('./routes/index');
var infoRouter = require('./routes/info');
var usersRouter = require('./routes/users');
var uploadsucRouter = require('./routes/uploadsuc');
var keyinRouter = require('./routes/keyin');
var uploadfailRouter = require('./routes/uploadfail');
var loginRouter = require('./routes/login');
var mapRouter = require('./routes/map');
var loginDirRouter = require('./routes/loginDir');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(Passport.initialize());
app.use(session({
    secret: 'ROC',
    cookie: {
        secure: false,
        maxAge: 20 * 60 * 1000
    },
    resave: true,
    saveUninitialized: true,
}));
app.use(Passport.session());

app.use(flash());



app.post('/login', Passport.authenticate('local', {
    failureFlash: true,
    successRedirect: '/loginDir',
    failureRedirect: '/login'
}));

app.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/'); //Inside a callback… bulletproof!
    });
});



app.use('/', indexRouter);
app.use('/keyin', keyinRouter);
app.use('/users', usersRouter);
app.use('/info', infoRouter);
app.use('/uploadsuc', uploadsucRouter);
app.use('/uploadfail', uploadfailRouter);
app.use('/login', loginRouter);
app.use('/map', mapRouter);
app.use('/loginDir', loginDirRouter);

//passport settings
Passport.serializeUser(function(user, done) {
    done(null, user.id);
});

Passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    })
});

Passport.use('local', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
    },
    function(username, password, done) {
        db.query('SELECT * FROM login WHERE username = ?', [username], function(err, rows, fields) {
            if (err)
                return done(err);
            if (!rows.length) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            if (password != rows[0].password) {
                return done(null, false, { message: 'Incorrect password.' });
            } else {
                return done(null, rows[0]);
            }
            // all is well, return successful user
        });
    }));



//form data handling
app.post('/uploadinfo', function(req, res, err) {
    console.log("start uploading");
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err) console.log(err);
        var oldpath = files.imgtoupload.path;
        var newpath = __dirname + '/public/uploads/' + files.imgtoupload.name;
        var rel_path = newpath.slice(__dirname.length + 7);
        console.log(rel_path);
        var userid = req.session.passport.user;
        var img_check = newpath.slice(-3);
        console.log(img_check);


        if (newpath.match(/\.(jpg|jpeg|png)$/i)) {
            db.query('select * from login where id = ?', [userid], function(err, login_result) {
                if (err) throw err;
                var authG = login_result[0].auth_group;
                var sql = "INSERT INTO city_info (`province`, `category`, `infrastructure`, `main_act`, `effect`, `nearby`, `value`, `method`, `action_opt`,`delay`,`paralyze`,`restriction`,`img_url`,`user_id`, `user_group`) VALUES ?";
                var values = [];
                values.push([fields.province, fields.category, fields.infrastructure, fields.main_act, fields.effect, fields.nearby, fields.value, fields.method, fields.action_opt, fields.delay, fields.paralyze, fields.restriction, rel_path, userid, authG]);

                db.query('select * from city_info where img_url = ?', [rel_path], function(err, result) {
                    if (result[0] == null) {
                        db.query(sql, [values], function(err, result) {
                            if (err) console.log(err)
                            console.log('success');
                            res.render('uploadsuc');
                        });
                        fs.rename(oldpath, newpath, function(err) {
                            if (err) throw err;
                        })
                    } else {
                        res.render('uploadfail');
                    }
                });
            });
        } else {
            res.render('uploadfail');
        }
    })
});

//delete from form
app.post('/delete_info', function(req, res, err) {
    console.log("start deleting");
    var form = new formidable.IncomingForm();
    //if(req.session.passport.user)console.log("update!!! session: "+req.session.passport.user);
    console.log("???");
    form.parse(req, function(err, fields, files) {
        if (err) console.log(err);
        console.log("id" + fields.id);
        var sql = 'DELETE FROM `city_info` WHERE  id = ?';
        var values = [];
        //, fields.infrastructure
        values.push(fields.id);
        db.query(sql, values, function(err, result) {
            if (err) {
                console.log(err)
            }
            console.log('success');
            res.redirect('back');
        });
    })
});

//update from form
app.post('/update_info', function(req, res, err) {
    if (req.session.passport.user) console.log("update!!! session: " + req.session.passport.user);
    console.log("start uploading");
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err) console.log(err);
        var oldpath = files.imgtoupload.path;
        console.log("oldpath");
        var newpath = __dirname + '/public/uploads/' + files.imgtoupload.name;
        console.log("newpath");
        var rel_path = newpath.slice(__dirname.length + 7);
        console.log(rel_path);

        if (newpath.match(/\.(jpg|jpeg|png)$/i)) {

            var sql = 'UPDATE  city_info SET infrastructure = ?, category = ?, main_act = ?, effect = ?, nearby = ?, value = ?, method = ?, action_opt = ?, delay = ?, paralyze = ?, restriction = ?, img_url = ?  WHERE id = ?';
            var sql2 = 'UPDATE  city_info SET infrastructure = ?, category = ?, main_act = ?, effect = ?, nearby = ?, value = ?, method = ?, action_opt = ?, delay = ?, paralyze = ?, restriction = ? WHERE id = ?';
            var values = [],
                values2 = [];
            values.push(fields.infrastructure, fields.category, fields.main_act, fields.effect, fields.nearby, fields.value, fields.method, fields.action_opt, fields.delay, fields.paralyze, fields.restriction, rel_path, fields.id);
            values2.push(fields.infrastructure, fields.category, fields.main_act, fields.effect, fields.nearby, fields.value, fields.method, fields.action_opt, fields.delay, fields.paralyze, fields.restriction, fields.id);
            if (files.imgtoupload.size) {
                db.query('select * from city_info where img_url = ?', [rel_path], function(err, result) {
                    if (result[0] == null) {
                        db.query(sql, values, function(err, result) {
                            if (err) {
                                console.log(err);
                                res.render('uploadfail');
                            }
                            console.log('success');
                            res.redirect('back');
                        });
                        fs.rename(oldpath, newpath, function(err) {
                            if (err) throw err;
                        })
                    } else {
                        res.render('uploadfail');
                    }
                });
            } else {
                values.pop(rel_path);
                db.query(sql2, values2, function(err, result) {
                    if (err) {
                        console.log(err);
                        res.render('uploadfail');
                    }
                    console.log('success');
                    res.redirect('back');
                });
            }
        } else {
            res.render('uploadfail');
        }
    })
});
// import excel to database
app.post('/fileupload', function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var oldpath = files.filetoupload.path;
        var newpath = __dirname + '/uploads/' + files.filetoupload.name;
        fs.rename(oldpath, newpath, function(err) {
            xlsxj({
                    input: newpath,
                    output: "null",
                },

                function(err, result) {

                    var userid = req.session.passport.user
                    var jsondata = result;
                    var values = [];

                    db.query('select * from login where id = ?', [userid], function(err, login_result) {
                        if (err) throw err;
                        var authG = login_result[0].auth_group;
                        for (var i = 0; i < jsondata.length; i++)
                        //Need to change DB later
                            values.push([jsondata[i].省份, jsondata[i].類別, jsondata[i].名稱, jsondata[i].主要業務, jsondata[i].效益, jsondata[i].關鍵設施, jsondata[i].相對價值, jsondata[i].戰具手法, jsondata[i].我方行動工具選項, jsondata[i].遲滯, jsondata[i].癱瘓, jsondata[i].限制, userid, authG]);
                        console.log(Object.keys(result));
                        if (Object.keys(result[0]).length === 12) {
                            db.query('INSERT INTO city_info(province, category, infrastructure, main_act, effect, nearby, value, method, action_opt, delay, paralyze, restriction, user_id, user_group) VALUES ?', [values], function(err, result) {
                                console.log('success');
                                res.render('uploadsuc');
                            });
                        } else {
                            res.send('Upload failed! Please readjust your xlsx format!');
                        }
                        //remove file after uploaded to db
                        fs.unlink(newpath, (err) => {
                            if (err) throw err;
                            console.log(newpath + " has been removed from folder");
                        });


                    });
                });

        });

    });

});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error')
});


module.exports = app;