function scrape(app) {
  var Article = app.models.Article;
  var Media = app.models.Media;
  var request = require('request');
  var noodle = require('noodlejs');
  var base_url = require('./baseurl.js');
  var i = 0;
  var fs = require('fs');

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
          if (err) {} else {
            cb();
          }
        });
      }

    });

  }

      noodle.query({
          url: 'https://www.reddit.com/r/soccer/hot/.json?limit=40',
          type: 'json',
          selector: '',
          cache:false,
      })
          .then(function(res) {
              if (!res.results[0].error) {
                var list = res.results[0].results[0].data.children;
                var links = [];
                console.log('links: ', list);
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

                    if (/streamable/.test(post.link)) {
                      var shortcode = /[^/]*$/.exec(post.link)[0];

                      noodle.query({
                          url: 'http://api.streamable.com/videos/' + shortcode,
                          type: 'json',
                          selector: '',
                          cache:false,
                      })
                      .then(function(res){
                        if (!(/Video does not/.test(res))) {
                          var thumb = res.results[0].results[0];
                          post.thumbnail = thumb.thumbnail_url;
                          Media.create(post, function(err, res) {

                            if (!err) {
                              app.io.emit('socket_media', res);

                            }
                          });
                        }
                      })
                      .fail(function(error){
                        console.log('uh oh error getting thumbnail for streambale', error);
                      });

                    } else {

                      if (item.data.media) {
                        post.thumbnail = item.data.media.oembed.thumbnail_url;
                      }

                      Media.create(post, function(err, res) {
                        console.log('Media added', post.title);
                        if (!err) {
                          app.io.emit('socket_media', res);
                        }
                      });
                    }
                  }
                });
                links.reverse();

                addEntry(i, links, function cb() {
                  i++;
                  if (i == links.length) {
                    request(base_url + '/Articles?filter[where][source]=REDDIT&filter[order]=createdAt%20DESC&filter[limit]=' + links.length.toString(), function(err, res, body) {
                      if(JSON.parse(body))
                      {
                      var parsed = JSON.parse(body);
                      app.io.emit('_articles', parsed);
                      }
                    });
                    return;
                  }
                  return addEntry(i, links, cb);
                });


              }
              else {
                console.log('error in response', res.results[0].error);
              }

          })
          .fail(function (error) {
              console.log('Uh oh', error.message);
          });

}

module.exports = scrape;
