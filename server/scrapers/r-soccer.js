function scrape(app) {
    var Article = app.models.Article;
    var Media = app.models.Media;
    var request = require('request');

    request('https://www.reddit.com/r/soccer/hot/.json?limit=50', function(err, response, body) {

        if (!(/servers are busy/.test(body)) && !(/unknown error/.test(body)) && body!=undefined) {
            console.log('catching reddit error:',body);
            var list = JSON.parse(body).data.children;

            list.forEach(function(item) {
                if (!(/gfycat/.test(item.data.domain)) && !(/streamable/.test(item.data.domain)) && !(/youtu/.test(item.data.domain)) && !(/abload/.test(item.data.domain))) {
                    var post = {
                        title: item.data.title,
                        link: item.data.url,
                        author: 'n/a',
                        count: 0,
                        source: 'REDDIT',
                        comments: 'http://www.reddit.com' + item.data.permalink,


                    };
                    Article.create(post, function(err, res) {

                        if (err) {
                            console.log('error:', err.message);
                        } else {
                            console.log('added article', res.title);
                            app.io.emit('scrape_complete', res);

                        }

                    });
                } else {

                    var post = {
                        title: item.data.title,
                        link: item.data.url,
                        comments: 'http://www.reddit.com' + item.data.permalink,
                        score: item.data.score,
                        source:'REDDIT',
                        count: 0
                    };

                    if (item.data.media) {
                        post.thumbnail = item.data.media.oembed.thumbnail_url;
                    }

                    if (post.title.length > 48) {
                        post.title = post.title.substr(0, 48) + '...';
                        console.log(item.link);
                    }
                    Media.create(post, function(err, res) {

                        if (err) {
                            console.log('error:', err.message);
                        } else {
                            console.log('added THUMBNAIL ', res.title);
                            app.io.emit('socket_media', res);

                        }
                    });
                }



            });
        }


    });

}

module.exports = scrape;