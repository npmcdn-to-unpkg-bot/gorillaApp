var addAuthor = function(app, i, cb, links, article, selector, source) {
    // var loopback = require('loopback');
    // var app = module.exports = loopback();
    var Xray = require("x-ray");
    var Article = article;
    var scrape = new Xray();

    scrape(links[i].link, selector)(function(err2, res) {
        if (err2) {
            console.log('error found:', err2)
        }
        if (!err2) {
            console.log('attempting link:', links[i].link);

            res = res.replace(/By/, "");
            var regex = /[a-zA-Z]+ [a-zA-Z]+/g;
            var name = regex.exec(res)[0];
            links[i].author = name;
            var articleInstance = {
                title: links[i].title,
                link: links[i].link,
                author: links[i].author,
                source: source,
                count: 0
            }
            Article.create(articleInstance, function(err, res) {
                if (err) {
                    console.log('error for article ',res.source,'  ', res.title, 'IS:', err.name);
                } else {
                    console.log('added article', res.title);
                    app.io.emit('scrape_complete',res);

                }

                cb();

            });
        } else {
            console.log('no author found');
            var articleInstance = {
                title: links[i].title,
                link: links[i].link,
                author: 'n/a',
                source: source,
                count: 0
            }
            Article.create(articleInstance, function(err, res) {
                if (err) {
                    console.log('error is: ', err.name);
                } else {
                    console.log('added article', res.title);
                    app.io.emit('scrape_complete',res);

                }
                cb();

            });
        }
    });
};

module.exports = {
    addAuthor: addAuthor
};