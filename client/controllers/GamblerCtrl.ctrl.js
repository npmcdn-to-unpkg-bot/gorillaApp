(function() {
    angular.module('gorilla')
        .controller('gamblerCtrl', GamblerCtrl)


    function GamblerCtrl($http, api, artSrv, media, $uibModal, $window, $scope,socket) {

        var ctrl = this;
        ctrl.http = $http;
        ctrl.api = api;
        ctrl.artSrv = artSrv;
        ctrl.articles = ctrl.artSrv.gamblerArticles;
        ctrl.media = ctrl.artSrv.media;
        ctrl.$uibModal = $uibModal;
        ctrl.mediaOpen = mediaOpen;
        ctrl.loadNextMedia = loadNextMedia;
        ctrl.select1 = 'THE GUARDIAN';
        ctrl.select2 = 'BBC';
        ctrl.select3 = 'FOOTBALL-ESPANA';
        ctrl.loadSource = loadSource;
        ctrl.loadNext = loadNext;
        ctrl.skipCount = [30, 30, 30];
        ctrl.socket=socket;

        ctrl.slides = [];


        groupSlides();

        function groupSlides() {
            var imgPerSlide = ctrl.artSrv.mediaSelect == 'REDDIT' ? 3 : 4;
            for (var i = 0; i < ctrl.media.length; i += imgPerSlide) {
                var slide = [];
                for (var j = 0; j < imgPerSlide; j++) {
                    slide.push(ctrl.media[j+i]);
                }
                ctrl.slides.push(slide);
            }
            console.log('slides grouped');
        }


        setTimeout(function() {
            document.getElementById('gamb1').onscroll = function() {
                console.log('scrolling');
                if (ctrl.artSrv.isScrolledIntoView('#lastElement1')) {
                    ctrl.loadNext(1);
                }
            }
            document.getElementById('gamb2').onscroll = function() {
                console.log('scrolling');
                if (ctrl.artSrv.isScrolledIntoView('#lastElement2')) {
                    ctrl.loadNext(2);
                }
            }
            document.getElementById('gamb3').onscroll = function() {
                console.log('scrolling');
                if (ctrl.artSrv.isScrolledIntoView('#lastElement3')) {
                    ctrl.loadNext(3);
                }
            }
            document.getElementById('gamb4').onscroll = function() {
                console.log('scrolling media');
                if (isScrolledIntoView('#lastElement4')) {
                    ctrl.loadNextMedia();
                }
            }


        });

      

          function enableListeners() {

            ctrl.socket.on('scrape_complete', function(data) {
                console.log('New Articles Added Live!');
                if (ctrl.select1 == data.source) {
                    var exists = false;
                    ctrl.articles[0].forEach(function(item) {
                        if (item.link == data.link) {
                            exists = true;
                        }
                    });
                    if (!exists) {
                        ctrl.articles[0].unshift(data);
                    }

                }

                 if (ctrl.select2 == data.source) {
                    var exists = false;
                    ctrl.articles[1].forEach(function(item) {
                        if (item.link == data.link) {
                            exists = true;
                        }
                    });
                    if (!exists) {
                        ctrl.articles[1].unshift(data);
                    }

                }

                 if (ctrl.select3 == data.source) {
                    var exists = false;
                    ctrl.articles[2].forEach(function(item) {
                        if (item.link == data.link) {
                            exists = true;
                        }
                    });
                    if (!exists) {
                        ctrl.articles[2].unshift(data);
                    }

                }
            });

            ctrl.socket.on('socket_media', function(data) {
                console.log('NEW MEDIA COMING!', data);
                if (ctrl.artSrv.mediaSelect == data.source) {
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
            console.log('LOAD NEXT MEDIA HIT');
            if (ctrl.artSrv.mediaSelect == 'REDDIT') {
                ctrl.api.request('/Media?filter[skip]=' + ctrl.artSrv.skipMediaCount + '&filter[order]=added%20DESC&filter[limit]=30', {}, 'GET').then(function(res) {
                    ctrl.media = ctrl.media.concat(res.data);
                    ctrl.artSrv.skipMediaCount += 30;
                    ctrl.slides=[];
                    groupSlides();
                $('#lastElement4').remove();
                $('#gamb4').append('<span id="lastElement4"></span>');

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



        function loadSource(listNum) {
            setTimeout(function() {
                listNum == 1 ? ctrl.artSrv.getArticles(ctrl.select1).then(function(res) {
                    ctrl.articles[0] = res;
                    ctrl.skipCount[0] = 30;
                }) : listNum == 2 ? ctrl.artSrv.getArticles(ctrl.select2).then(function(res) {
                    ctrl.articles[1] = res;
                    ctrl.skipCount[1] = 30;
                }) : ctrl.artSrv.getArticles(ctrl.select3).then(function(res) {
                    ctrl.articles[2] = res;
                    ctrl.skipCount[2] = 30;
                });
            })

        }

        function loadNext(listNum) {

            ctrl.selected = [ctrl.select1, ctrl.select2, ctrl.select3];
            var toLoad = ctrl.selected[listNum - 1];
            ctrl.api.request('/Articles?filter[where][source]=' + toLoad + '&filter[skip]=' + ctrl.skipCount[listNum - 1] + '&filter[order]=added%20DESC&filter[limit]=30', {}, 'GET').then(function(res) {
                ctrl.articles[listNum - 1] = ctrl.articles[listNum - 1].concat(res.data);
                ctrl.skipCount[listNum - 1] += 30;
                if (listNum == 1) {
                    $('#lastElement1').remove();
                    $('#gamb1').append('<span id="lastElement1"></span>');
                }

                if (listNum == 2) {
                    $('#lastElement2').remove();
                    $('#gamb2').append('<span id="lastElement2"></span>');
                }
                if (listNum == 3) {
                    $('#lastElement3').remove();
                    $('#gamb3').append('<span id="lastElement3"></span>');
                }

            });

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

            }
            else {
                $window.open(item.link);
            }
        };

        $scope.$watch(function() {
            return ctrl.artSrv.media;
        }, function() {
            console.log('watcher hit');

            ctrl.media = ctrl.artSrv.media;
            console.log(ctrl.media);
            ctrl.slides = [];
            groupSlides();


        });



    }

})();