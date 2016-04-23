(function() {
    'use strict'

    angular
        .module('gorilla')
        .service('artSrv', ArticleService);

    function ArticleService(api, $window, $http, $q) {

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
        srv.hasAuthor = hasAuthor;
        srv.addClick=addClick;
        srv.sources = ['ESPNFC', 'BBC', 'EUROSPORT', 'FOOTBALL-ESPANA', 'FOOTBALL-ITALIA', 'FOOTBALL 365', 'THE GUARDIAN', 'THE INDEPENDENT', 'REDDIT', 'SKY SPORTS', 'TELEGRAPH'];
        srv.mediaSelect = 'REDDIT';
        srv.select1 = 'ESPNFC';
        srv.select2 = 'BBC';
        srv.select3 = 'THE GUARDIAN';
        srv.popover = 'popover.html';
        srv.layoutSelect = 1;
        srv.mediaSkipCount = 30;
        srv.articleOpen=articleOpen;

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

              
                    return srv.media;

            });
        }

        function addClick(item){

            api.request('/Articles/'+item.id,{},'GET').then(function(res){
                var count={count:++res.data.count};
                api.request('/Articles/'+item.id,count,'PUT').then(function(response){
                });
            });
        }
         function articleOpen(item){
           addClick(item);
            $window.open(item.link);

        }
        //streamable only
        // srv.delInvalidLinks = function(arr) {
        //     var deferred = $q.defer();
        //     var length = arr.length;
        //     console.log('delinv');
        //     arr.forEach(function(item, i) {
        //         item.title = item.title.toUpperCase();
        //         if (/streamable/.test(item.link)) {
        //             var shortcode = /[^/]*$/.exec(item.link)[0];
        //             $http.get('http://api.streamable.com/videos/' + shortcode).then(function(resp) {
        //                 if (resp.data.status != 2) {
        //                     arr = arr.filter(item2 => item2 !== item);
        //                 }
        //                 console.log('i is ',i);
        //                 if (i == length - 1) {
        //                     deferred.resolve(arr);
        //                 }
        //             });

        //         }
        //     });

        //     return deferred.promise;

        // }

        function hasAuthor(item) {
            if (item.source == "FOOTBALL-ESPANA" || item.source == "FOOTBALL-ITALIA" || item.source == "FOOTBALL 365" || item.source == "REDDIT") {
                return false;
            } else {
                return true;
            }
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