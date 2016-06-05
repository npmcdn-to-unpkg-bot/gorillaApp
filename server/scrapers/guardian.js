function scrape(app) {
    var Xray = require("x-ray");
    var Article = app.models.Article;
    var scrape = new Xray();
    var author = require("./addAuthor.js");
    var request = require('request');
    var base_url = require('./baseurl.js');
    var links = null;
    var i = 0;

    scrape('http://www.theguardian.com/football/all', '.fc-item .fc-item__title', [{
        title: 'a',
        link: 'a@href'
    }])(function(err, obj) {

        if (!err) {
            obj.forEach(function(item) {
                item.title = item.title.replace(/\n/g, "").replace(/Fiver/, "Fiver ").replace(/Sportblog/, "Sportblog ").replace(/WhoScored\?/, "WhoScored? ").replace(/Match previews/,"Match previews ").replace(/Live/,"Live ").replace(/Podcast/,"Podcast ");
            });
            links = obj;
            links.reverse();
            author.addAuthor(app, i, function cb() {
                i++;
                if (i > links.length - 1) {
                    request(base_url + '/Articles?filter[where][source]=THE%20GUARDIAN&filter[order]=createdAt%20DESC&filter[limit]=' + links.length.toString(), function(err, res, body) {
                        if(JSON.parse(body))
                        {
                        var parsed = JSON.parse(body);
                        app.io.emit('_articles', parsed);
                      }
                    });
                    return;
                }
                return author.addAuthor(app, i, cb, links, Article, 'a.tone-colour', 'THE GUARDIAN');
            }, links, Article, 'a.tone-colour', 'THE GUARDIAN');
        }

    });

}

module.exports = scrape;
