

function scrape(app) {
    var Xray = require("x-ray");
    var Article = app.models.Article;
    var author = require("./addAuthor.js");
    var scrape = new Xray();
    var request = require('request');
    var base_url = require('./baseurl.js');

    var i = 0;
    var links = [];

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
                        var item = {
                            title: links[i].title,
                            link: links[i].link,
                            author: 'Staff',
                            source: 'FOOTBALL-ESPANA',
                            count: 0
                        }
                        Article.create(item, function(err, res) {
                            if (err) {} else {
                                cb();
                            }

                        });
                    }
                });


            } else {
                var item = {
                    title: links[i].title,
                    link: links[i].link,
                    author: 'Staff',
                    source: 'FOOTBALL-ESPANA',
                    count: 0
                }
                Article.create(item, function(err, res) {

                        cb();

                });
            }

        });

    }

    scrape('http://www.football-espana.net/news', '.news-idx-item', [{
        title: 'a',
        link: 'a@href'
    }])(function(err, obj) {
        if (!err) {
            links = obj;
            links.reverse();

            addEntry(i, links, function cb() {
                i++;
                if (i == links.length) {
                    request(base_url + '/Articles?filter[where][source]=FOOTBALL-ESPANA&filter[order]=createdAt%20DESC&filter[limit]=' + obj.length.toString(), function(err, res, body) {
                      if(JSON.parse(body))
                      {var parsed = JSON.parse(body);
                      app.io.emit('_articles', parsed);}

                    });
                    return;
                }
                return addEntry(i, links, cb);
            });

        }

    });

}

module.exports = scrape;
