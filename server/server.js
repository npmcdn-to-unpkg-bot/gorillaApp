var loopback = require('loopback');
var boot = require('loopback-boot');
var bodyParser = require('body-parser');
var app = module.exports = loopback();
var scrapper = require('./scrapper/start')

app.settings.port = process.argv[2];
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.start = function() {
    // start the web server
    return app.listen(process.argv[2], function() {
        app.emit('started');
        var baseUrl = app.get('url').replace(/\/$/, '');
        console.log('Web server listening at: %s', baseUrl);
        if (app.get('loopback-component-explorer')) {
            var explorerPath = app.get('loopback-component-explorer').mountPath;
            console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
        }
    });
};



boot(app, __dirname, function(err) {
    if (err) throw err;

    // start the server if `$ node server.js`
    if (require.main === module)
    {
        if(app.settings.port == 3002){
            app.io = require('socket.io')(app.start());
            scrapper(app);
        }
        else{
            app.start();
        }

    }


});