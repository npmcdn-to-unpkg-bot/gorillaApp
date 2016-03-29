function scrape(app) {
    var Xray = require("x-ray");
    var Article = app.models.Article;
    var scrape = new Xray();
    var author = require("./addAuthor.js");


    var links = null;
    var i = 0;

    scrape('http://www.eurosport.com/football/', '.storylist-container h2', [{
        title: 'a',
        link: 'a@href'
    }])(function(err, obj) {
        if (!err) {
            links = obj;

            scrape('http://www.eurosport.com/football/', '#col-right h2.storylist-latest__main-title', [{
                title: 'a',
                link: 'a@href'
            }])(function(err2, obj2) {
                if (!err2) {
                    links = links.concat(obj2);

                    author.addAuthor(app, i, function cb() {
                        i++;
                        if (i > links.length - 1) {
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