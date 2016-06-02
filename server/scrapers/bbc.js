//module.exports = function(app) { 



//router.get('/bbc', function(req, res) {
function scrape(app) {

  var Xray = require("x-ray");
  var Article = app.models.Article;
  var scrape = new Xray();
  var author = require("./addAuthor.js");
  var request = require('request');
  var base_url = require('./baseurl.js');

  var links = null;
  var i = 0;

  scrape('http://www.bbc.com/sport/football', '.anfield__item .lakeside__title', [{
    title: 'a',
    link: 'a@href'
  }])(function(err, obj) {
    if (!err) {
      scrape('http://www.bbc.com/sport/football', '#features .gel-layout__item .lakeside__title', [{
        title: 'a',
        link: 'a@href'
      }])(function(err2, obj2) {
        if (!err2) {
          links = obj.concat(obj2);
          links.forEach(function(item) {
            item.title = item.title.replace(/ /, "");

          });
          links.reverse();
          author.addAuthor(app, i, function cb() {
            i++;
            if (i > links.length - 1) {
              request(base_url + '/Articles?filter[where][source]=BBC&filter[order]=createdAt%20DESC&filter[limit]=' + links.length.toString(), function(err, res, body) {
                if (body) {
                  var parsed = JSON.parse(body);
                  app.io.emit('_articles', parsed);
                }
              });
              return;
            }
            return author.addAuthor(app, i, cb, links, Article, 'p.gel-long-primer', 'BBC');
          }, links, Article, 'p.gel-long-primer', 'BBC');
        }

      });
    }

  });
}
module.exports = scrape;

// scrape();

//res.send('bbc!');
//});

//app.use(router);

//}
