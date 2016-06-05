function scrape(app) {
    var Xray = require("x-ray");
    var Article = app.models.Article;
    var scrape = new Xray();
    var author = require("./addAuthor.js");
    var request = require('request');
    var base_url = require('./baseurl.js');

    var links = null;
    var i = 0;

    scrape('http://www.eurosport.com/football/', '.storylist-container h2', [{
        title: 'a',
        link: 'a@href'
    }])(function(err, obj) {
        if (!err) {
            links = obj;
            links.forEach(function(item) {
                if (item.link[item.link.length - 1] === " ") {
                    item.link = item.link.substring(0, item.link.length - 1);
                }
            });

            scrape('http://www.eurosport.com/football/', '#col-right h2.storylist-latest__main-title', [{
                title: 'a',
                link: 'a@href'
            }])(function(err2, obj2) {
                if (!err2) {
                    links = links.concat(obj2);
                    links.forEach(function(item) {
                        if (item.link[item.link.length - 1] === " ") {
                            item.link = item.link.substring(0, item.link.length - 1);
                        }
                    });
                    links.reverse();
                    author.addAuthor(app, i, function cb() {
                        i++;
                        if (i > links.length - 1) {
                            request(base_url + '/Articles?filter[where][source]=EUROSPORT&filter[order]=createdAt%20DESC&filter[limit]=' + links.length.toString(), function(err, res, body) {
                              if(JSON.parse(body))
                              {
                                var parsed=JSON.parse(body);
                                app.io.emit('_articles', parsed);
                              }
                            });
                            return;
                        }
                        return author.addAuthor(app, i, cb, links, Article, '.storyfull__sidebar-author-name a', 'EUROSPORT');
                    }, links, Article, '.storyfull__sidebar-author-name a', 'EUROSPORT');


                }
            });
        }
    });

}
module.exports = scrape;
