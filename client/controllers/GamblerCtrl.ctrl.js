(function() {
    angular.module('gorilla')
        .controller('gamblerCtrl', GamblerCtrl)


    function GamblerCtrl($http, api, artSrv, media, $uibModal, $window, $scope, socket) {

        var ctrl = this;
        ctrl.http = $http;
        ctrl.api = api;
        ctrl.artSrv = artSrv;
        ctrl.articles = ctrl.artSrv.gamblerArticles;
        ctrl.media = ctrl.artSrv.media;
        ctrl.$uibModal = $uibModal;
        ctrl.mediaOpen = mediaOpen;
        ctrl.loadNextMedia = loadNextMedia;
        ctrl.socket = socket;
        ctrl.loadSource = loadSource;
        ctrl.loadNext = loadNext;


        ctrl.skipCount = [30, 30, 30];
        ctrl.artSrv.layoutSelect = 2;
        ctrl.slides = [];

        enableListeners(ctrl.artSrv.select1, ctrl.artSrv.select2, ctrl.artSrv.select3);


        function groupSlides(media) {
            var imgPerSlide = ctrl.artSrv.mediaSelect == 'REDDIT' ? 3 : 4;
            for (var i = 0; i < media.length; i += imgPerSlide) {
                var slide = [];
                for (var j = 0; j < imgPerSlide; j++) {
                    slide.push(media[j + i]);
                }
                ctrl.slides.push(slide);
            }
        }


        setTimeout(function() {
            document.getElementById('gamb1').onscroll = function() {
                if (ctrl.artSrv.isScrolledIntoView('#lastElement1')) {
                   $('#lastElement1').remove();
                    setTimeout(function() {
                        ctrl.loadNext(1);
                    }, 1000);
                }
            }
            document.getElementById('gamb2').onscroll = function() {
                if (ctrl.artSrv.isScrolledIntoView('#lastElement2')) {
                   $('#lastElement2').remove();
                    setTimeout(function() {
                        ctrl.loadNext(2);
                    }, 1000);
                }
            }
            document.getElementById('gamb3').onscroll = function() {
                if (ctrl.artSrv.isScrolledIntoView('#lastElement3')) {
                    $('#lastElement3').remove();
                    setTimeout(function() {
                        ctrl.loadNext(3);
                    }, 1000);
                }
            }

        });



        function enableListeners() {

            ctrl.socket.on('_articles', function(data) {

                if (ctrl.artSrv.select1 == data[0].source) {
                    ctrl.articles[0] = data.concat(ctrl.articles[0]);
                    ctrl.articles[0].splice(data.length - 1, data.length);
                }

            });

            ctrl.socket.on('_articles', function(data) {
                if (ctrl.artSrv.select2 == data[0].source) {

                    ctrl.articles[1] = data.concat(ctrl.articles[1]);
                    ctrl.articles[1].splice(data.length - 1, data.length);
                }
            });

            ctrl.socket.on('_articles', function(data) {
                if (ctrl.artSrv.select3 == data[0].source) {

                    ctrl.articles[2] = data.concat(ctrl.articles[2]);
                    ctrl.articles[2].splice(data.length - 1, data.length);
                }
            });

            // ctrl.socket.on('socket_media', function(data) {
            //     console.log('NEW MEDIA COMING!', data);
            //     if (ctrl.artSrv.mediaSelect == data.source) {
            //         var hasAdded = false;
            //         ctrl.media.forEach(function(item) {
            //             if (item.link == data.link) {
            //                 hasAdded = true;
            //             }
            //         });
            //         if (hasAdded == false) {
            //             ctrl.media.unshift(data);
            //         }
            //         var slidesToCut = ctrl.slides.length;
            //         groupSlides(ctrl.media);
            //         ctrl.slides.splice(0, slidesToCut);

            //     }
            // });
        }


        function loadNextMedia() {
            if (ctrl.artSrv.mediaSelect == 'REDDIT') {
                ctrl.api.request('/Media?filter[skip]=' + ctrl.artSrv.mediaSkipCount + '&filter[order]=createdAt%20DESC&filter[limit]=30', {}, 'GET').then(function(res) {
                    groupSlides(res.data);
                    ctrl.artSrv.mediaSkipCount += 30;

                });
            } else {
                ctrl.api.request('/socials?filter[skip]=' + ctrl.skipMediaCount + '&filter[order]=createdAt%20DESC&filter[limit]=30', {}, 'GET').then(function(res) {
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


                });
            }
        }



        function loadSource(listNum) {
            setTimeout(function() {
                listNum == 1 ? ctrl.artSrv.getArticles(ctrl.artSrv.select1).then(function(res) {
                    ctrl.articles[0] = res;
                    ctrl.skipCount[0] = 30;
                }) : listNum == 2 ? ctrl.artSrv.getArticles(ctrl.artSrv.select2).then(function(res) {
                    ctrl.articles[1] = res;
                    ctrl.skipCount[1] = 30;
                }) : ctrl.artSrv.getArticles(ctrl.artSrv.select3).then(function(res) {
                    ctrl.articles[2] = res;
                    ctrl.skipCount[2] = 30;
                });


            })

        }

        function loadNext(listNum) {
            ctrl.selected = [ctrl.artSrv.select1, ctrl.artSrv.select2, ctrl.artSrv.select3];
            var toLoad = ctrl.selected[listNum - 1];
            ctrl.api.request('/Articles?filter[where][source]=' + toLoad + '&filter[skip]=' + ctrl.skipCount[listNum - 1] + '&filter[order]=createdAt%20DESC&filter[limit]=30', {}, 'GET').then(function(res) {
                ctrl.articles[listNum - 1] = ctrl.articles[listNum - 1].concat(res.data);
                ctrl.skipCount[listNum - 1] += 30;
                if (listNum == 1) {
                    $('#gamb1').append('<span id="lastElement1"></span>');
                }

                if (listNum == 2) {
                    $('#gamb2').append('<span id="lastElement2"></span>');
                }
                if (listNum == 3) {
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

            } else {
                $window.open(item.link);
            }
        };

        $scope.$watch(function() {
            return ctrl.artSrv.media;
        }, function() {
            ctrl.media = ctrl.artSrv.media;
            ctrl.slides = [];
            groupSlides(ctrl.media);
            // ctrl.slides.splice(ctrl.media.length-1,slidesToCut);

        });



    }

})();