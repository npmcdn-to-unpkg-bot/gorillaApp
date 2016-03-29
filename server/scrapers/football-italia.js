function scrape(app) {
    var Xray = require("x-ray");
    var Article = app.models.Article;
    var author = require("./addAuthor.js");
    var scrape = new Xray();
    var router = app.loopback.Router();

    var i = 0;

    scrape('http://www.football-italia.net/news', '.news-idx-item', [{
        title: 'a',
        link: 'a@href'
    }])(function(err, obj) {
        if (!err) {

            obj.forEach(function(link) {
                var item = {
                    title: link.title,
                    link: link.link,
                    author: 'Staff',
                    source: 'FOOTBALL-ITALIA',
                    count: 0
                }
                Article.create(item, function(err, res) {
                   if (!err) {
                    console.log('added article', res);
                    app.io.emit('scrape_complete', res);

                } else {
                    console.log('error:', err);
                }

                });
            })
        }
    })
}
module.exports = scrape;