//module.exports = function(app) { 



//router.get('/bbc', function(req, res) {
function scrape(app) {

    var Xray = require("x-ray");
    var Article = app.models.Article;
    var scrape = new Xray();
    var author = require("./addAuthor.js");

    var links = null;
    var i = 0;

    scrape('http://www.bbc.com/sport/football', '.anfield__item .lakeside__title', [{
        title: 'a',
        link: 'a@href'
    }])(function(err, obj) {
        if (!err) {
            scrape('http://www.bbc.com/sport/football', '#features .gel-layout__item .lakeside__title', [{
                title: 'a',
                link: 'a@href'
            }])(function(err2, obj2) {
                if (!err2) {
                    links = obj.concat(obj2);

                    links.forEach(function(item) {
                        item.title = item.title.replace(/ /, "");
                        console.log(item.title);
                        console.log(item.link);

                    });

                    author.addAuthor(app, i, function cb() {
                        i++;
                        if (i > links.length - 1) {
                            return;
                        }
                        return author.addAuthor(app, i, cb, links, Article, 'p.gel-long-primer', 'BBC');
                    }, links, Article, 'p.gel-long-primer', 'BBC');
                }

            });
        }

    });
}
module.exports = scrape;

// scrape();

//res.send('bbc!');
//});

//app.use(router);

//}