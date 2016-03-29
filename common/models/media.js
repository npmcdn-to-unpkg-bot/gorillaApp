module.exports = function(Media) {
	Media.validatesUniquenessOf('link', {message: 'must not repeat'});

};
