module.exports = function(Social) {
Social.validatesUniquenessOf('link', {message: 'must not repeat'});

};
