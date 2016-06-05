function scrape(app) {
    var Xray = require("x-ray");
    var Article = app.models.Article;
    var scrape = new Xray();
    var author = require("./addAuthor.js");
    var request = require('request');
    var base_url = require('./baseurl.js');
    var links = null;
    var i = 0;


    // SCRAPING TOP HEADLINES FIRST
    scrape('http://www.espnfc.com/', '#top-story', [{
        title: '.text-content a',
        link: '.text-content a@href'
    }])(function(err1, obj1) {
        links = obj1;
        // console.log(links);
        scrape('http://www.espnfc.com/', '.top-headline-item', [{
            title: '.text-content a',
            link: '.text-content a@href',

        }])(function(err, obj) {
            if (!err) {
                links = links.concat(obj);

                scrape('http://www.espnfc.com/', '#top-story ul li', [{
                    title: '.text-content  a',
                    link: '.text-content  a@href',
                }])(function(err3, obj3) {
                    if (!err3) {
                        obj3.forEach(function(item) {
                            item.title = item.title.replace(/\t/g, "").replace(/\n/g, "");
                        });

                        links = links.concat(obj3);
                        scrape('http://www.espnfc.com/', '.home-page-row .grid-item', [{
                            title: '.text-content a',
                            link: '.text-content a@href',

                        }])(function(err4, obj4) {
                            if (err4) {} else {
                                links = links.concat(obj4.slice(0, 20));
                                links.reverse();
                                links.forEach(function(item) {
                                    item.link = item.link.replace(/ /g, "");
                                });
                                console.log('links for ESPNFC', links);
                                author.addAuthor(app, i, function cb() {
                                    i++;
                                    if (i > links.length - 1) {
                                        request(base_url + '/Articles?filter[where][source]=ESPNFC&filter[order]=createdAt%20DESC&filter[limit]=' + links.length.toString(), function(err, res, body) {
                                            if (!err && JSON.parse(body)) {

                                                var parsed = JSON.parse(body);
                                                app.io.emit('_articles', parsed);
                                            }
                                        });
                                        return;
                                    }
                                    return author.addAuthor(app, i, cb, links, Article, '.author a', 'ESPNFC');
                                }, links, Article, '.author a', 'ESPNFC');
                            }
                        });

                    }

                });
            }


        })
    });



}

module.exports = scrape;
