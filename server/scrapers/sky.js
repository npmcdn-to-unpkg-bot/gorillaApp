function scrape(app) {
    var Article = app.models.Article;
    var request = require('request');
    var Xray = require("x-ray");
    var scrape = new Xray();
    var noodle = require('noodlejs');
    var request = require('request');
    var base_url = require('./baseurl.js');

    var links = null;
    var i = 0;

    var addEntry = function(i, links, cb) {

        var where = {
            where: {
                link: links[i].link
            }
        };

        Article.findOne(where, function(err, instance) {
            if (!err && instance != null) {
                Article.destroyById(instance.id, function(err) {
                    if (!err) {

                        Article.create(links[i], function(err, res) {
                            if (err) {} else {
                                cb();
                            }

                        });
                    }
                });


            } else {


                Article.create(links[i], function(err, res) {
                    if (err) {
                    } else {
                        cb();
                    }
                });
            }

        });

    }

    //using existing non-official sky api
    request('https://skysportsapi.herokuapp.com/sky/getnews/football/v1.0/', function(error, response, body) {
        links = [];
        if (error) {
        }
        if (!error && response.statusCode == 200) {
            JSON.parse(body).forEach(function(item) {
                links.push({
                    title: item.title.replace(/ /, ""),
                    link: item.link
                });

            });
            //using noodle scraper for this page
            links.forEach(function(link) {
                noodle.query({
                    url: link.link,
                    type: 'html',
                    selector: 'h3.article__writer-name',
                    extract: 'text',
                    cache:false,
                })
                    .then(function(res) {
                        if (!res.results[0].error) {
                            link.author = res.results[0].results[0].replace(/By /, "");
                        }
                        else {
                            link.author="na";
                        }
                        link.source = 'SKY SPORTS';
                        link.count = 0;

                    });
            })

            links.reverse();

            addEntry(i, links, function cb() {
                i++;
                if (i == links.length) {
                    request(base_url + '/Articles?filter[where][source]=SKY%20SPORTS&filter[order]=createdAt%20DESC&filter[limit]=' + links.length.toString(), function(err, res, body) {
                        if(JSON.parse(body))
                        {
                        var parsed = JSON.parse(body);
                        app.io.emit('_articles', parsed);
                      }
                    });
                    return;
                }
                return addEntry(i, links, cb);
            });


        }


    });



}
module.exports = scrape;
