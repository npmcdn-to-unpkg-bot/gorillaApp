(function() {
    'use strict'
    angular.module('gorilla')
        .controller('balancedCtrl', BalancedCtrl)


    function BalancedCtrl($http, api, artSrv, articles, media, $uibModal, socket, $window, $scope) {

        var ctrl = this;
        ctrl.http = $http;
        ctrl.api = api;
        ctrl.artSrv = artSrv;
        ctrl.articles = articles;
        ctrl.media = ctrl.artSrv.media;
        ctrl.loadSource = loadSource;
        ctrl.loadNextMedia = loadNextMedia;
        ctrl.skipCount = 30;
        ctrl.skipMediaCount = 18;
        ctrl.$uibModal = $uibModal;
        ctrl.mediaOpen = mediaOpen;
        ctrl.loadNext = loadNext;
        ctrl.socket = socket;
        ctrl.doSearch = doSearch;
        ctrl.clearSearch = clearSearch;
        ctrl.select = 'ESPNFC';
        ctrl.search = '';

        enableListeners();

        setTimeout(initScrollTrack,1000);

       function initScrollTrack() {
            console.log('initing scroll');
            console.log(document.getElementById('scrollWindow'));
            document.getElementById('scrollWindow').onscroll = function() {
                if (ctrl.artSrv.isScrolledIntoView('#lastElement')) {
                    $('#lastElement').remove();
                    setTimeout(function() {
                        ctrl.loadNext();
                    }, 1000);
                }
            }
            document.getElementById('mediaScroll').onscroll = function() {
                console.log('scrolling');
                if (ctrl.artSrv.isScrolledIntoView('#lastMedia')) {
                    $('#lastMedia').remove();
                    setTimeout(function() {
                    ctrl.loadNextMedia();
                    }, 1000);
                }
            }

        };

        function doSearch() {
            if (ctrl.search.length > 2) {

                api.request('/Media?filter[where][title][like]=' + ctrl.search + '&filter[where][title][options]=i&filter[order]=createdAt%20DESC&filter[limit]=50', {}, 'GET')
                    .then(function(res) {
                        ctrl.media = res.data;
                    });

            } else {
                ctrl.media = artSrv.media;
                ctrl.skipMediaCount=18;
            }

        }

        function clearSearch() {
            ctrl.search = '';
            doSearch();
        }

        function loadNext() {
            ctrl.api.request('/Articles?filter[where][source]=' + ctrl.select + '&filter[skip]=' + ctrl.skipCount + '&filter[order]=createdAt%20DESC&filter[limit]=30', {}, 'GET').then(function(res) {

                ctrl.articles = ctrl.articles.concat(res.data);
                ctrl.skipCount += 30;
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

            ctrl.socket.on('_articles', function(data) {
                data.splice(30);
                if (ctrl.select == data[0].source) {
                    ctrl.articles = data.concat(ctrl.articles);
                    ctrl.articles.splice(data.length - 1, data.length);

                }
            });

            ctrl.socket.on('socket_media', function(data) {
                if (ctrl.artSrv.mediaSelect == data.source) {
                    var hasAdded = false;
                    ctrl.media.forEach(function(item) {
                        if (item.link == data.link) {
                            hasAdded = true;
                        }
                    });
                    if (hasAdded == false) {
                        data.title = data.title.toUpperCase();
                        ctrl.media.unshift(data);
                    }

                }
            });
        }


        function loadNextMedia() {
            console.log('load next media');
            if (ctrl.search.length == 0) {

                if (ctrl.artSrv.mediaSelect == 'REDDIT') {
                    ctrl.api.request('/Media?filter[skip]=' + ctrl.skipMediaCount + '&filter[order]=createdAt%20DESC&filter[limit]=36', {}, 'GET').then(function(res) {
                        res.data.forEach(function(item){
                            item.title=item.title.toUpperCase();
                        });
                        ctrl.media = ctrl.media.concat(res.data);
                        ctrl.skipMediaCount += 36;
                        // $('#lastMedia').remove();
                        $('#mediaList').append('<span id="lastMedia"></span>');
                        initScrollTrack();

                    });
                } else if (ctrl.artSrv.mediaSelect == 'IG') {
                    ctrl.api.request('/socials?filter[skip]=' + ctrl.skipMediaCount + '&filter[order]=createdAt%20DESC&filter[limit]=20', {}, 'GET').then(function(res) {
                        var next = [];
                        next = res.data.map(function(item) {
                            if (!item.thumbnail) {
                                var thumb = "/assets/img/media_thumb_logo.png";
                            } else if (typeof item.thumbnail == 'string') {
                                var thumb = item.thumbnail;
                            } else {
                                var thumb = item.thumbnail.url;
                            }
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

                        });

                        ctrl.media = ctrl.media.concat(next);
                        ctrl.skipMediaCount += 30;
                        $('#lastMedia').remove();
                        $('#mediaList').append('<span id="lastMedia"></span>');

                    });
                }

            }

        }
       

        function mediaOpen(item) {
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