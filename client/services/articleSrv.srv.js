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
        srv.getSocial = getSocial;
        srv.isScrolledIntoView = isScrolledIntoView;
        srv.getGamblerArticles = getGamblerArticles;
        srv.setAnimOptions=setAnimOptions;
        srv.sources = ['ESPNFC', 'BBC', 'EUROSPORT', 'FOOTBALL-ESPANA', 'FOOTBALL-ITALIA', 'FOOTBALL 365', 'THE GUARDIAN', 'THE INDEPENDENT', 'REDDIT', 'SKY SPORTS', 'TELEGRAPH'];
        srv.animOptions=['enter top over 3s after 0.5s','enter right after 0.5s','enter bottom over 1s and move 300px after 0.3s','enter top over 0.5s and move 200px','enter bottom over 1s and move 100px','enter top','enter bottom over 1s and move 300px after 0.3s','enter left','enter top','enter right','enter bottom','enter top over 3s after 0.5s','enter bottom over 1s and move 100px','enter top over 0.5s and move 200px'];
        srv.mediaSelect = 'REDDIT';
        srv.select1 = 'ESPNFC';
        srv.select2 = 'BBC';
        srv.select3 = 'THE GUARDIAN';

        srv.layoutSelect = 1;
        srv.mediaSkipCount = 30;

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
            return api.request('/socials?filter[order]=createdAt%20DESC&filter[limit]=20', {}, 'GET').then(function(res) {
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

            return api.request('/Articles?filter[where][source]=' + source + '&filter[order]=createdAt%20DESC&filter[limit]=30', {}, 'GET').then(function(res) {
                srv.articles = res.data;
                return srv.articles;

            });
        }


        function getMedia() {
            return api.request('/Media?filter[order]=createdAt%20DESC&filter[limit]=18', {}, 'GET').then(function(res) {
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
                    srv.setAnimOptions(item);
                });
                return srv.media;

            });
        }

        function setAnimOptions(item){
            item.reveal=srv.animOptions[Math.round(Math.random() * (srv.animOptions.length - 1))];
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