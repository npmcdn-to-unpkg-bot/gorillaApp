var addAuthor = function(app, i, cb, links, article, selector, source) {
    // var loopback = require('loopback');
    // var app = module.exports = loopback();
    var Xray = require("x-ray");
    var Article = article;
    var scrape = new Xray();

    scrape(links[i].link, selector)(function(err2, res) {

        if (!err2) {

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
            var where = {
                where: {
                    link: links[i].link
                }
            };
            Article.findOne(where, function(err, instance) {
                if (!err && instance != null) {
                    Article.destroyById(instance.id, function(err) {
                        if (!err) {
                            Article.create(articleInstance, function(err, res) {
                                if (err) {} else {}

                                cb();

                            });
                        }
                    });


                } else {
                    Article.create(articleInstance, function(err, res) {
                        if (err) {} else {

                        }

                        cb();

                    });
                }

            });


        } else {
            if (source == "ESPNFC") {
                var author = 'ESPN staff';
            } else {
                var author = "Staff";
            }

            var articleInstance = {
                title: links[i].title,
                link: links[i].link,
                author: author,
                source: source,
                count: 0
            }

            var where = {
                where: {
                    link: links[i].link
                }
            };
            Article.findOne(where, function(err, instance) {
                if (!err && instance != null) {
                    Article.destroyById(instance.id, function(err) {
                        if (!err) {
                            Article.create(articleInstance, function(err, res) {
                                if (err) {} else {

                                }

                                cb();

                            });
                        }
                    });


                } else {
                    Article.create(articleInstance, function(err, res) {
                        if (err) {} else {

                        }

                        cb();

                    });
                }


            });
        }
    });
};

module.exports = {
    addAuthor: addAuthor
};
