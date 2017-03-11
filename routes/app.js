var express = require('express'),
    router = express.Router(),
    User = require("../models/users");



router.get('/', function(req, res){
    if (req.cookies.remember){
        User.findById(req.session.username, function (err, user) {
            if (err || user == !undefined || !user || user == null) {
                res.clearCookie('remember');
                res.clearCookie('session');
                res.clearCookie('session.sig');
                res.redirect('/');
            }else {
                res.cookie('remember', 1, {maxAge: 7*24*60*60*1000});
                req.session.authorized = true;
                req.session.username = user._id;
                req.session.userStatus = user.roles;

                var admin = false;
                if (user.roles == "admin"){ admin = true;}

                res.render('header', {admin: admin},
                    function (err, header) {
                        if (err) throw err;
                        res.render( 'adminPage' , {header: header,
                                username: user.username, role: user.roles},
                            function(err, html){
                                if (err) throw err;
                                res.render( 'index', {content: html});
                            });
                    });
            }
        });
    }else{
        res.render('signIn',
            function (err, signIn) {
                if (err) throw err;
                res.render( 'index' ,
                    {content: signIn});
            });
    }
});

router.get('/signIn', function (req, res) {

    //     var testUser = new User({
    //         username: "User",
    //         password: 988880528,
    //         roles: "user"
    //     });
    //
    // // save user to database
    //     testUser.save(function(err) {
    //         if (err) throw err;
    //     });

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
                        req.session.authorized = true;
                        req.session.username = user._id;
                        req.session.userStatus = user.roles;
                        // res.cookie('username', req.query.username, {maxAge: 600* 1000});
                    }

                    var admin = false;
                    if (user.roles == "admin"){ admin = true;}

                    res.render('header', {admin: admin},
                        function (err, header) {
                            if (err) throw err;
                            res.render( 'adminPage' , {header: header,
                                    username: user.username, role: user.roles});
                        });
                }
            });
        }else {
            res.json({message: "error"});
        }
    });

});

router.get('/logoff', function (req, res) {
    res.clearCookie('remember');
    res.clearCookie('session');
    res.clearCookie('session.sig');
    // delete req.session.authorized;
    // delete req.session.username;
    res.redirect('/');
});

module.exports = router;
require('./get-router');
require('./rest');
