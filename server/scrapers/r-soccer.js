function scrape(app) {
    var Article = app.models.Article;
    var Media = app.models.Media;
    var request = require('request');
    var base_url = require('./baseurl.js');
    var i=0;
    var addEntry = function(i, links, cb) {

        var where = {
            where: {
                link: links[i].link
            }
        };

        Article.findOne(where, function(err, instance) {
            if (!err && instance != null) {
                Article.destroyById(instance.id, function(err) {
                    if (!err) {
                        Article.create(links[i], function(err, res) {
                            if (err) {} else {
                                cb();
                            }

                        });
                    }
                });


            } else {
                Article.create(links[i], function(err, res) {
                    if (err) {
                    } else {
                        cb();
                    }
                });
            }

        });

    }

    request('https://www.reddit.com/r/soccer/hot/.json?limit=40', function(err, response, body) {

        if (!(/servers are busy/.test(body)) && !(/unknown error/.test(body)) && body != undefined && !err) {
            var list = JSON.parse(body).data.children;
            var links = [];

            list.forEach(function(item) {
                if (!(/gfycat/.test(item.data.domain)) && !(/streamable/.test(item.data.domain)) && !(/youtu/.test(item.data.domain)) && !(/abload/.test(item.data.domain))) {
                    var post = {
                        title: item.data.title,
                        link: item.data.url,
                        author: 'n/a',
                        count: 0,
                        source: 'REDDIT',
                        comments: 'http://www.reddit.com' + item.data.permalink,
                        num_comments: item.data.num_comments,
                        score: item.data.score

                    };
                    links.push(post);

                } else {

                    var post = {
                        title: item.data.title,
                        link: item.data.url,
                        comments: 'http://www.reddit.com' + item.data.permalink,
                        num_comments: item.data.num_coments,
                        score: item.data.score,
                        source: 'REDDIT',
                        count: 0
                    };

                    if (item.data.media) {
                        post.thumbnail = item.data.media.oembed.thumbnail_url;
                    }

                    Media.create(post, function(err, res) {

                        if (err) {
                        } else {
                            app.io.emit('socket_media', res);

                        }
                    });
                }



            });
            links.reverse();

            addEntry(i, links, function cb() {
                i++;
                if (i == links.length) {
                    request(base_url + '/Articles?filter[where][source]=REDDIT&filter[order]=createdAt%20DESC&filter[limit]=' + links.length.toString(), function(err, res, body) {
                        console.log('res is : ',res);
                        console.log('err is :', err);
                        var parsed = JSON.parse(body);
                        app.io.emit('_articles', parsed);
                    });
                    return;
                }
                return addEntry(i, links, cb);
            });
        }


    });


}

module.exports = scrape;