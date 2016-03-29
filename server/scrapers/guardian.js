function scrape(app) {
    var Xray = require("x-ray");
    var Article = app.models.Article;
    var scrape = new Xray();
    var author = require("./addAuthor.js");

    var links = null;
    var i = 0;

    scrape('http://www.theguardian.com/football/all', '.fc-item .fc-item__title', [{
        title: 'a',
        link: 'a@href'
    }]).limit(30)(function(err, obj) {
        if (err){console.log('CANT FIND ITEMS:', err)}
        if (!err) {
            obj.forEach(function(item) {
                item.title = item.title.replace(/\n/g, "").replace(/Fiver/, "Fiver ").replace(/Sportblog/, "Sportblog ").replace(/WhoScored\?/, "WhoScored? ");
            });
            links = obj;
            author.addAuthor(app, i, function cb() {
                i++;
                if (i > 29) {
                    return;
                }
                return author.addAuthor(app, i, cb, links, Article, 'a.tone-colour', 'THE GUARDIAN');
            }, links, Article, 'a.tone-colour', 'THE GUARDIAN');
        }

    });

}

module.exports = scrape;