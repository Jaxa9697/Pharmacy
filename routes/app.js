var express = require('express'),
    router = express.Router(),
    User = require("../models/users");

router.get('/', function(req, res){
    if (req.cookies.remember){
        res.cookie('remember', 1, {maxAge: 7*24*60*60*1000});
        res.render('header',
            function (err, header) {
                if (err) throw err;
                res.render( 'adminPage' , {header: header},
                function(err, html){
                    if (err) throw err;
                    res.render( 'index',
                        {title: 'Ветеренарная аптека',
                        content: html});
                });
            });
    }else{
        res.render('signIn',
            function (err, signIn) {
                if (err) throw err;
                res.render( 'index' ,
                    {title: 'Ветеренарная аптека',
                        content: signIn
                    });
            });
    }
});

router.get('/signIn', function (req, res) {

    // create a user a new user
    // var testUser = new User({
    //     username: req.query.username,
    //     password: req.query.password
    // });

// save user to database
//     testUser.save(function(err) {
//         if (err) throw err;

// fetch user and test password verification
        User.findOne({ username: req.query.username }, function(err, user) {
            if (err)  throw err;
            if (user){
                user.comparePassword(req.query.password , function(err, isMatch) {
                    if (err)  throw err;

                    if (!isMatch) {
                        res.json({message: "error"});
                    }else{
                        if (err) throw err;
                        if (req.query.remember == 'true'){
                            res.cookie('remember', 1, {maxAge: 7*24*60*60*1000});
                            // res.cookie('username', req.query.username, {maxAge: 600* 1000});
                        }

                        res.render('header',
                            function (err, header) {
                                if (err) throw err;
                                res.render( 'adminPage' , {header: header});
                        });
                    }
                });
            }else {
                res.json({message: "error"});
            }
        });
    // });

});

router.get('/logoff', function (req, res) {
    res.clearCookie('remember');
    res.redirect('/');
});

module.exports = router;
require('./get-router');
require('./rest');
