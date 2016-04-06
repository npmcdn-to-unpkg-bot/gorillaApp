module.exports = function(server) {
    var router = server.loopback.Router();
    var path=require('path');
    server.use(server.loopback.static(path.resolve(__dirname, '../client')));
    console.log(server.settings.port);
    if (server.settings.port == 3002) {
        server.io.on('connection', function(socket) {
            console.log('a user connected');
            socket.emit('socket_connected',{msg:'socket connected'});
        });
        var bbc = require('./../scrapers/bbc.js');
        var espnfc = require('./../scrapers/espnfc.js');
        var eurosport = require('./../scrapers/eurosport.js');
        var football_espana = require('./../scrapers/football-espana.js');
        var football_italia = require('./../scrapers/football-italia.js');
        var f365 = require('./../scrapers/football365.js');
        var guardian = require('./../scrapers/guardian.js');
        var independent = require('./../scrapers/independent.js');
        var reddit = require('./../scrapers/r-soccer.js');
        var sky = require('./../scrapers/sky.js');
        var telegraph = require('./../scrapers/telegraph.js');
        var ig = require('./../scrapers/ig.js');

        var redditInterval=20000;
        var interval=120000;
        // TIMERS --------------------
        var espnTimer =   setInterval(function() {
            espnfc(server)
        }, 180000);
        var bbcTimer = setInterval(function() {
            bbc(server)
        }, 250000);
        var eurosportTimer = setInterval(function() {
            eurosport(server)
        }, interval);
        var espanaTimer = setInterval(function() {
            football_espana(server)
        }, 300000);
        var italiaTimer = setInterval(function() {
            football_italia(server)
        }, 300000);
        var f36gTimer = setInterval(function() {
            f365(server)
        }, 600000);
        var guardianTimer = setInterval(function() {
            guardian(server)
        }, 400000);
        var independentTimer = setInterval(function() {
            independent(server)
        }, interval);
        // var redditTimer = setInterval(function() {
        //     reddit(server)
        // }, redditInterval);
        var skyTimer = setInterval(function() {
            sky(server)
        }, 500000);
        var teleTimer = setInterval(function() {
            telegraph(server)
        }, 360000);
        var igTimer = setInterval(function() {
            ig(server)
        }, 600000);

    }
};