 

function scrape(app) {
    var Xray = require("x-ray");
    var Article = app.models.Article;
    var scrape = new Xray();
    var links = null;
    var i = 0;

    var request = require('request');
    var base_url = require('./baseurl.js');

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
                            source: 'FOOTBALL 365',
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
                    source: 'FOOTBALL 365',
                    count: 0
                }
                Article.create(item, function(err, res) {
                    if (err) {
                    } else {
                        cb();
                    }
                });
            }

        });

    }

    // 4 scrapes for 4 different parts of the page
    scrape('http://www.football365.com/all-the-news', '.hero__figure', [{
        title: '.hero__figcaption h2',
        link: 'a@href'
    }])(function(err, obj) {
        if (!err) {
            links = obj;
            scrape('http://www.football365.com/all-the-news', '.hero__list .hero__item', [{
                title: '.hero-sml__figcaption h3',
                link: 'a@href'
            }])(function(err2, obj2) {
                if (!err2) {
                    scrape('http://www.football365.com/all-the-news', '.articleList .articleList__item', [{
                        title: '.articleList__figcaption h3',
                        link: 'a@href'
                    }])(function(err3, obj3) {
                        if (!err3) {
                            scrape('http://www.football365.com/all-the-news', '.widget .articleList__item', [{
                                title: '.articleList__figcaption h3',
                                link: 'a@href'
                            }])(function(err4, obj4) {
                                if (!err4) {
                                    obj4.forEach(function(item) {
                                        item.title = item.title.replace(/\n +/, "").replace(/ {3,}/, "");
                                    });

                                    links = links.concat(obj2).concat(obj4).concat(obj3);
                                    links.reverse();

                                    addEntry(i, links, function cb() {
                                        i++;
                                        if (i == links.length) {
                                            request(base_url + '/Articles?filter[where][source]=FOOTBALL%20365&filter[order]=createdAt%20DESC&filter[limit]=' + links.length.toString(), function(err, res, body) {
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
                    });
                }
            });
        }
    });




}

module.exports = scrape;
