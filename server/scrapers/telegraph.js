function scrape(app) {
    var Xray = require("x-ray");
    var Article = app.models.Article;
    var scrape = new Xray();
    var author = require("./addAuthor.js");


    var links = null;
    var i = 0;

    scrape('http://www.telegraph.co.uk/football/', '.component-content .list-of-entities__item .list-of-entities__item-body-headline', [{
        title: 'a',
        link: 'a@href'
    }])(function(err, obj) {
        if (!err) {
            links = obj;

            author.addAuthor(app, i, function cb() {
                i++;
                if (i > links.length - 1) {
                    return;
                }
                return author.addAuthor(app, i, cb, links, Article, '.byline__author-name a', 'TELEGRAPH');
            }, links, Article, '.byline__author-name a', 'TELEGRAPH');
        }
    });

}
module.exports = scrape;