function scrape(app) {
  var Xray = require("x-ray");
  var Article = app.models.Article;
  var scrape = new Xray();
  var author = require("./addAuthor.js");
  var request = require('request');
  var base_url = require('./baseurl.js');

  var links = null;
  var i = 0;

  scrape('http://www.telegraph.co.uk/football/', '.component-content .list-of-entities__item .list-of-entities__item-body-headline', [{
    title: 'a',
    link: 'a@href'
  }])(function(err, obj) {
    if (!err) {
      links = obj;
      links.forEach(function(item) {
        item.title = item.title.replace(/Exclusive interview!/, 'Exclusive interview! ').replace(/Exclusive!/, 'Exclusive! ');
      })
      links.reverse();
      author.addAuthor(app, i, function cb() {
        i++;
        if (i > links.length - 1) {
          request(base_url + '/Articles?filter[where][source]=TELEGRAPH&filter[order]=createdAt%20DESC&filter[limit]=' + links.length.toString(), function(err, res, body) {
            if (JSON.parse(body)) {
              var parsed = JSON.parse(body);
              app.io.emit('_articles', parsed);
            }
          });
          return;
        }
        return author.addAuthor(app, i, cb, links, Article, '.byline__author-name a', 'TELEGRAPH');
      }, links, Article, '.byline__author-name a', 'TELEGRAPH');
    }
  });

}
module.exports = scrape;
