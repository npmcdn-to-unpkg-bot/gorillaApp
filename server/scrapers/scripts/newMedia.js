var http = require('http');
var request = require('request');
var noodle = require('noodlejs');
var base_url = require('../baseurl.js');
var app = require('../../server');
var Article = app.models.Article;
var Media = app.models.Media;

function newMedia(item) {
  if ((/gfycat/.test(item.data.domain)) || (/streamable/.test(item.data.domain)) || (/youtu/.test(item.data.domain))) {
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
      request('http://api.streamable.com/videos/' + shortcode, function(err, res, body) {
        if(!err){
          if (!(/Video does not/.test(body))) {
            var thumb = JSON.parse(body);
            post.thumbnail = thumb.thumbnail_url;
            console.log('THUMB',post.thumbnail);
            Media.create(post, function(err, res) {
              if (!err) {
                app.io.emit('socket_media', res);
              }
            });
          }
        }
      });
    

    } else {

      if (item.data.media) {
        post.thumbnail = item.data.media.oembed.thumbnail_url;
      }

      Media.create(post, function(err, res) {
        if (!err) {
          console.log('Media added', post.title);
          app.io.emit('socket_media', res);
        }
      });
    }
  }
}


module.exports = newMedia;
