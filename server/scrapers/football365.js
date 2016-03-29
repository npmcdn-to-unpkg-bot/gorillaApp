 

function scrape(app) {
    var Xray = require("x-ray");
    var Article = app.models.Article;
    var scrape = new Xray();
    var links = null;
    var i = 0;

    // 4 scrapes for 4 different parts of the page 
    scrape('http://www.football365.com/all-the-news', '.hero__figure', [{
        title: '.hero__figcaption h2',
        link: 'a@href'
    }])(function(err, obj) {
        if (!err) {
            links = obj;
            scrape('http://www.football365.com/all-the-news', '.hero__list .hero__item', [{
                title: '.hero-sml__figcaption h3',
                link: 'a@href'
            }])(function(err2, obj2) {
                if (!err2) {
                    scrape('http://www.football365.com/all-the-news', '.articleList .articleList__item', [{
                        title: '.articleList__figcaption h3',
                        link: 'a@href'
                    }])(function(err3, obj3) {
                        if (!err3) {
                            scrape('http://www.football365.com/all-the-news', '.widget .articleList__item', [{
                                title: '.articleList__figcaption h3',
                                link: 'a@href'
                            }])(function(err4, obj4) {
                                if (!err4) {
                                    obj4.forEach(function(item) {
                                        item.title = item.title.replace(/\n +/, "").replace(/ {3,}/, "");
                                    });

                                    links = links.concat(obj2).concat(obj4).concat(obj3);

                                    links.forEach(function(link) {
                                        var item = {
                                            title: link.title,
                                            link: link.link,
                                            author: 'Staff',
                                            source: 'FOOTBALL 365',
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
                            });
                        }
                    });
                }
            });
        }
    });




}

module.exports = scrape;