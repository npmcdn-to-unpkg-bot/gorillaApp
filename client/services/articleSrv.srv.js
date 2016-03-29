(function() {
    'use strict'

    angular
        .module('gorilla')
        .service('artSrv', ArticleService);

    function ArticleService(api, $window) {

        var srv = this;
        srv.getArticles = getArticles;
        srv.articles = [];
        srv.gamblerArticles = [];
        srv.media = [];
        srv.social = [];
        srv.getMedia = getMedia;
        srv.getSocial=getSocial;
        srv.isScrolledIntoView = isScrolledIntoView;
        srv.getGamblerArticles = getGamblerArticles;
        srv.sources = ['ESPNFC', 'BBC', 'EUROSPORT', 'FOOTBALL-ESPANA', 'FOOTBALL-ITALIA', 'FOOTBALL 365', 'THE GUARDIAN', 'THE INDEPENDENT', 'REDDIT', 'SKY SPORTS', 'TELEGRAPH'];
        srv.mediaSelect='REDDIT';
        srv.mediaSkipCount=30;

        function getGamblerArticles(source1, source2, source3) {
            srv.getArticles(source1).then(function(res) {
                srv.gamblerArticles[0] = res;
                srv.getArticles(source2).then(function(res2) {
                    srv.gamblerArticles[1] = res2;
                    srv.getArticles(source3).then(function(res3) {
                        srv.gamblerArticles[2] = res3;
                        return srv.gamblerArticles;

                    });
                });
            });



        }

        function getSocial() {
            return api.request('/socials?filter[order]=added%20DESC&filter[limit]=30', {}, 'GET').then(function(res) {
                srv.media = res.data.map(function(item) {
                    if (!item.thumbnail) {
                        var thumb = "/assets/img/media_thumb_logo.png";
                    } else if (typeof item.thumbnail == 'string') {
                        var thumb = item.thumbnail;
                    } else {
                        var thumb = item.thumbnail.url;
                    }
                    return {
                        title: item.title.toUpperCase(),
                        source: item.source,
                        link: item.link,
                        thumbnail: thumb,
                        name: item.name,
                        type: item.type
                    }
                });
                srv.media.forEach(function(item) {
                    if (item.title.length > 50) {
                        item.title = item.title.substr(0, 50) + '...';
                    }

                });

                return srv.social;

            });
        }

        function getArticles(source) {

            return api.request('/Articles?filter[where][source]=' + source + '&filter[order]=added%20DESC&filter[limit]=30', {}, 'GET').then(function(res) {
                srv.articles = res.data.map(function(item) {
                    if (res.data[0].source == 'REDDIT') {
                        return {
                            title: item.title,
                            source: item.source,
                            comments: item.comments,
                            link: item.link
                        }
                    } else {
                        return {
                            title: item.title,
                            source: item.source,
                            link: item.link
                        }
                    }
                });

                console.log('articles loaded');
                return srv.articles;

            });
        }


        function getMedia() {
            return api.request('/Media?filter[order]=added%20DESC&filter[limit]=30', {}, 'GET').then(function(res) {
                srv.media = res.data.map(function(item) {
                    if (!item.thumbnail) {
                        var thumb = "/assets/img/media_thumb_logo.png";
                    } else {
                        var thumb = item.thumbnail;
                    }
                    return {
                        title: item.title.toUpperCase(),
                        source: item.source,
                        link: item.link,
                        thumbnail: thumb,
                        comments: item.comments
                    }
                });
                srv.media.forEach(function(item) {
                    if (item.title.length > 48) {
                        item.title = item.title.substr(0, 48) + '...';
                    }
                });
                return srv.media;

            });
        }


        function isScrolledIntoView(elem) {
            var $elem = $(elem);
            var $window = $(window);

            var docViewTop = $window.scrollTop();
            var docViewBottom = docViewTop + $window.height();

            var elemTop = $elem.offset().top;
            var elemBottom = elemTop + $elem.height();

            return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
        }




    }



})();