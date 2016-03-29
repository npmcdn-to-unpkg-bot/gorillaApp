function scrape(app) {
    var Article = app.models.Article;
    var request = require('request');
    var Xray = require("x-ray");
    var scrape = new Xray();
    var noodle = require('noodlejs');


    var links = null;
    var i = 0;

    //using existing non-official sky api
    request('https://skysportsapi.herokuapp.com/sky/getnews/football/v1.0/', function(error, response, body) {
        links = [];
        if (!error && response.statusCode == 200) {

            JSON.parse(body).forEach(function(item) {
                links.push({
                    title: item.title.replace(/ /, ""),
                    link: item.link
                });

            });
            //using noodle scraper for this page
            links.forEach(function(link) {
                noodle.query({
                    url: link.link,
                    type: 'html',
                    selector: 'h3.article__writer-name',
                    extract: 'text'
                })
                    .then(function(res) {
                        link.author = res.results[0].results[0].replace(/By /, "");
                        console.log(link);
                        var item = {
                            title: link.title,
                            link: link.link,
                            author: link.author,
                            source: 'SKY SPORTS',
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
                    });
            })

        }


    });

}
module.exports = scrape;