module.exports = function(Article, options) {
  // Model is the model class
  // options is an object containing the config properties from model definition
  Article.defineProperty('added', {type: Date, default: Date.now()});

}

module.exports = function(Media, options) {
  // Model is the model class
  // options is an object containing the config properties from model definition
  Media.defineProperty('added', {type: Date, default: Date.now()});

}