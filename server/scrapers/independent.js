function scrape(app) {
    var Xray = require("x-ray");
    var Article = app.models.Article;
    var scrape = new Xray();
    var author = require("./addAuthor.js");

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
                    author.addAuthor(app, i, function cb() {
                        i++;
                        if (i > links.length - 1) {
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