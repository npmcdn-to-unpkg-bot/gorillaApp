function scrape(app) {
  var Article = app.models.Article;
  var Media = app.models.Media;
  var request = require('request');
  var base_url = require('./baseurl.js');
  var i = 0;
  var addEntry = require('./addEntry');
  var http = require('http');
  var newLink = require('./scripts/newLink');

  try {
    http.get({
      hostname: 'www.reddit.com',
      path: '/r/soccer/hot/.json?limit=40',
      headers: {
        'Content-Type': 'application/json'
      }
    }, function(response) {
      var body = '';
      response.on('data', function(d) {
        body += d;
      });
      response.on('end', function() {
        var list = JSON.parse(body).data.children;
        var links = newLink(list, []);
        links.reverse();
        addEntry(i, links, function cb() {
          i++;
          if (i == links.length) {
            request(base_url + '/Articles?filter[where][source]=REDDIT&filter[order]=createdAt%20DESC&filter[limit]=' + links.length.toString(), function(err, res, body) {
              if (JSON.parse(body)) {
                var parsed = JSON.parse(body);
                app.io.emit('_articles', parsed);
              }
            });
            return;
          }
          return addEntry(i, links, cb);
        });
      }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
      });
    });

  }
  catch (err){
    console.log('OOOPS! Error:', err);
  }

}

module.exports = scrape;
