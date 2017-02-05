var express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    bodyParser = require('body-parser'),
    url = require('url'),
    templates = require('consolidate');

var appRoutes = require('./routes/app'),
    app = express();

require('./models/configuration');

app.engine('hbs', templates.handlebars);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public/images', 'icon.png')));
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb',extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cookieSession({
    name: 'session',
    keys: ['Jaxa9696', '16031997'],
    maxAge: 7 * 24 * 60 * 60 * 1000
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE');
    next();
});

app.use('/', appRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

// console.log('Server? has runned at port 1337');
// app.listen(1337);
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});