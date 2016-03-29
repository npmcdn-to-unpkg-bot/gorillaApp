function scrape(app) {
    var Xray = require("x-ray");
    var Article = app.models.Article;
    var scrape = new Xray();
    var author = require("./addAuthor.js");

    var links = null;
    var i = 0;


    // SCRAPING TOP HEADLINES FIRST
    scrape('http://www.espnfc.com/', '.top-headline-item', [{
        title: '.text-content a',
        link: '.text-content a@href',

    }])(function(err, obj) {
        if (!err) {
            links = obj;

            author.addAuthor(app, i, function cb() {
                i++;
                if (i > links.length - 1) {
                    return;
                }
                return author.addAuthor(app, i, cb, links, Article, '.author a', 'ESPNFC');
            }, links, Article, '.author a', 'ESPNFC');
            secScrape();
        }
    });

    function secScrape() {
        var j = 0;

        scrape('http://www.espnfc.com/', '.home-page-row .grid-item', [{
            title: '.text-content a',
            link: '.text-content a@href',

        }])(function(err2, obj) {
            if (err2) {
                console.log('error SECONDARY', err2);
            } else {
                links = obj.slice(0, 20);
                console.log('Secondary scrape: ', links);

                author.addAuthor(app, j, function cb() {
                    j++;
                    if (j > 19) {
                        return;
                    }
                    return author.addAuthor(app, j, cb, links, Article, '.author a', 'ESPNFC');
                }, links, Article, '.author a', 'ESPNFC');
            }
        });




    }


}

module.exports = scrape;