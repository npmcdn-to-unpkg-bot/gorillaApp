function scrape(app) {

    var Xray = require("x-ray");
    var Article = app.models.Article;
    var scrape = new Xray();
    var author = require("./addAuthor.js");

    var links = null;
    var i = 0;

    scrape('http://www.dirtytackle.net/', 'h1.entry-title', [{
        title: 'a',
        link: 'a@href'
    }])(function(err, obj) {
        if (!err) {
            links = obj;
            links.forEach(function(item) {
                item.title = item.title.replace(/\t/g, "");
            });

            author.addAuthor(app, i, function cb() {
                i++;
                if (i > links.length - 1) {
                    return;
                }
                return author.addAuthor(app, i, cb, links, Article, '.entry-author-byline a', 'DIRTYTACKLE');
            }, links, Article, '.entry-author-byline a', 'DIRTYTACKLE');
        }
        else {console.log('DIRTY TACKLE-------------------------------------',err)}
    });
}

module.exports = scrape;