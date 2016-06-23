function scrape(app) {
  var Article = app.models.Article;
  var Media = app.models.Media;
  var request = require('request');
  var base_url = require('./baseurl.js');
  var i = 0;
  var http = require('http');
  var newMedia=require('./scripts/newMedia');

  try {

    http.get({
      hostname: 'www.reddit.com',
      path: '/r/soccer/hot/.json?limit=40',
      headers: {
        'Content-Type': 'application/json'
      }
    }, function(response) {
      // Continuously update stream with data
      var body = '';
      response.on('data', function(d) {
        body += d;
      });
      response.on('end', function() {
        // Data reception is done, do whatever with it!
        var list = JSON.parse(body).data.children;
        list.forEach(newMedia);
      }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
      });
    });
  }

  catch (err){
    console.log('ERROR ON GET REQUEST: ',err);
  }

}
module.exports=scrape;
