function scrape(app) {
    var Xray = require("x-ray");
    var Article = app.models.Article;
    var scrape = new Xray();
    var author = require("./addAuthor.js");
    var request = require('request');
    var base_url = require('./baseurl.js');
    var links = null;
    var i = 0;

    scrape('http://www.independent.co.uk/sport/football', '.section h1', [{
        title: 'a',
        link: 'a@href'
    }])(function(err, obj) {
        if (!err) {
            scrape('http://www.independent.co.uk/sport/football', '.grid-mod-collection-sub-section li', [{
                title: 'a',
                link: 'a@href'
            }])(function(err2, obj2) {
                if (!err2) {
                    obj2.forEach(function(item) {
                        item.title = item.title.replace(/\n/g, "").replace(/ {3,}/, "");
                    });
                    var index = 0;
                    obj.forEach(function(item, i) {
                        if (/Our new app/.test(item.title)) {
                            index = i;
                        }
                    });
                    obj = obj.slice(0, index).concat(obj2).concat(obj.slice(index + 2));
                    obj = obj.splice(0, obj.length - 6);

                    links = obj;
                    links.reverse();

                    author.addAuthor(app, i, function cb() {
                        i++;
                        if (i > links.length - 1) {
                            request(base_url + '/Articles?filter[where][source]=THE%20INDEPENDENT&filter[order]=createdAt%20DESC&filter[limit]=' + links.length.toString(), function(err, res, body) {
                                var parsed = JSON.parse(body);
                                app.io.emit('_articles', parsed);
                            });
                            return;
                        }
                        return author.addAuthor(app, i, cb, links, Article, 'li.author a', 'THE INDEPENDENT');
                    }, links, Article, 'li.author a', 'THE INDEPENDENT');
                }

            });
        }
    });

}

module.exports = scrape;