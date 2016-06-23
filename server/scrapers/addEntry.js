
var app = require('../server');
var Article = app.models.Article;
var request = require('request');
var base_url = require('./baseurl.js');

function addEntry(i, links, cb) {
  var where = {
    where: {
      link: links[i].link
    }
  };
  var callback=cb;
  Article.findOne(where, function(err, instance) {
    if (!err && instance != null) {
      Article.destroyById(instance.id, function(err) {
        if (!err) {
          Article.create(links[i], function(err, res) {
              callback(links);
          });
        }
      });
    } else {
      Article.create(links[i], function(err, res) {
          if(!err){
            callback(links);
          }

      });
    }

  });

}

module.exports=addEntry;
