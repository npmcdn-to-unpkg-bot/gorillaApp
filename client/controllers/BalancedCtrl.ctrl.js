(function() {
    angular.module('gorilla')
        .controller('balancedCtrl', BalancedCtrl)


    function BalancedCtrl($http, api, artSrv, articles, media, $uibModal, socket, $window,$scope) {

        var ctrl = this;
        ctrl.http = $http;
        ctrl.api = api;
        ctrl.artSrv = artSrv;
        ctrl.articles = articles;
        ctrl.media = ctrl.artSrv.media;
        ctrl.loadSource = loadSource;
        ctrl.loadNextMedia = loadNextMedia;
        ctrl.skipCount = 30;
        ctrl.skipMediaCount = 30;
        ctrl.$uibModal = $uibModal;
        ctrl.mediaOpen = mediaOpen;
        ctrl.loadNext = loadNext;
        ctrl.select = 'ESPNFC';
        ctrl.socket = socket;

        enableListeners();



        setTimeout(function() {

            document.getElementById('scrollWindow').onscroll = function() {
                console.log('scrolling');
                if (ctrl.artSrv.isScrolledIntoView('#lastElement')) {
                    ctrl.loadNext();
                }
            }
            document.getElementById('mediaScroll').onscroll = function() {
                console.log('scrolling media');
                if (ctrl.artSrv.isScrolledIntoView('#lastMedia')) {
                    ctrl.loadNextMedia();
                }
            }


        });


        

        function loadNext() {
            console.log('LOADING NEXT');
            ctrl.api.request('/Articles?filter[where][source]=' + ctrl.select + '&filter[skip]=' + ctrl.skipCount + '&filter[order]=added%20DESC&filter[limit]=30', {}, 'GET').then(function(res) {
                console.log('attempted to load next');
                ctrl.articles = ctrl.articles.concat(res.data);
                ctrl.skipCount += 30;
                $('#lastElement').remove();
                $('#scrollList').append('<span id="lastElement"></span>');

            });

        }

        function loadSource() {
            setTimeout(function() {
                ctrl.artSrv.getArticles(ctrl.select).then(function(res) {
                    ctrl.articles = res;
                    ctrl.skipCount = 30;
                    $('#lastMedia').remove();
                    $('#mediaList').append('<span id="lastMedia"></span>');
                });
            });
        }

        function enableListeners() {

            ctrl.socket.on('scrape_complete', function(data) {
                console.log('NEW ARTICLE COMING!');
                console.log(data);
                if (ctrl.select == data.source) {
                    var exists = false;
                    ctrl.articles.forEach(function(item) {
                        if (item.link == data.link) {
                            exists = true;
                        }
                    });
                    if (!exists) {
                        ctrl.articles.unshift(data);
                    }

                }
            });

            ctrl.socket.on('socket_media', function(data) {
                console.log('NEW MEDIA COMING!', data);
                if (ctrl.mediaSelect == data.source) {
                    var hasAdded = false;
                    ctrl.media.forEach(function(item) {
                        if (item.link == data.link) {
                            hasAdded = true;
                        }
                    });
                    if (hasAdded == false) {
                        ctrl.media.unshift(data);
                    }

                }
            });
        }


        function loadNextMedia() {
            console.log('LOADING');
            if (ctrl.mediaSelect == 'REDDIT') {
                ctrl.api.request('/Media?filter[skip]=' + ctrl.skipMediaCount + '&filter[order]=added%20DESC&filter[limit]=30', {}, 'GET').then(function(res) {
                    console.log("loading next media:", res);
                    ctrl.media = ctrl.media.concat(res.data);
                    ctrl.skipMediaCount += 30;
                    $('#lastMedia').remove();
                    $('#mediaList').append('<span id="lastMedia"></span>');

                });
            } else {
                ctrl.api.request('/socials?filter[skip]=' + ctrl.skipMediaCount + '&filter[order]=added%20DESC&filter[limit]=30', {}, 'GET').then(function(res) {
                    var next = [];
                    next = res.data.map(function(item) {
                        if (!item.thumbnail) {
                            var thumb = "/assets/img/media_thumb_logo.png";
                        } else if (typeof item.thumbnail == 'string') {
                            var thumb = item.thumbnail;
                        } else {
                            var thumb = item.thumbnail.url;
                        }
                        console.log('title about to be assembled', item.title, 'thumbnail: ', item.thumbnail);
                        return {
                            title: item.title,
                            source: item.source,
                            link: item.link,
                            thumbnail: thumb,
                            name: item.name,
                            type: item.type
                        }
                    });
                    next.forEach(function(item) {
                        if (item.title.length > 48) {
                            item.title = item.title.substr(0, 48) + '...';
                        }
                        console.log('social title:', item.title);

                    });

                    ctrl.media = ctrl.media.concat(next);
                    ctrl.skipMediaCount += 30;
                    $('#lastMedia').remove();
                    $('#mediaList').append('<span id="lastMedia"></span>');

                });
            }
        }

        function mediaOpen(item) {
            console.log('ITEM LINK ', item.link);
            if (/streamable/.test(item.link)) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'partials/streamableModal.html',
                    controller: 'modalCtrl as ctrl',
                    resolve: {
                        item: function() {
                            return item;
                        }
                    }
                });

            } else if (/yout/.test(item.link)) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'partials/youtubeModal.html',
                    controller: 'modalCtrl as ctrl',
                    resolve: {
                        item: function() {
                            return item;
                        }
                    }
                });
            } else if (/instagram/.test(item.link)) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'partials/igModal.html',
                    controller: 'modalCtrl as ctrl',
                    resolve: {
                        item: function() {
                            return item;
                        }
                    }
                });

            } else {
                $window.open(item.link);
            }

        };


           $scope.$watch(function() {
            return ctrl.artSrv.media;
        }, function() {

            ctrl.media = ctrl.artSrv.media;

        });



    }



})();