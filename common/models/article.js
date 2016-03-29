module.exports = function(Article) {
Article.validatesUniquenessOf('link', {message: 'must not repeat'});
};
