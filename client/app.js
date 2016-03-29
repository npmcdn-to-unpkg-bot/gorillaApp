(function() {
    angular.module('gorilla', ['ui.router', 'ui.bootstrap', 'ngAnimate']);

    angular.module('gorilla')
        .factory('socket', ['$rootScope',
            function($rootScope) {
                var socket = io.connect('http://0.0.0.0:3002');
                console.log("socket connection established");
                return {
                    on: function(eventName, callback) {
                        function wrapper() {
                            var args = arguments;
                            $rootScope.$apply(function() {
                                callback.apply(socket, args);
                            });
                        }

                        socket.on(eventName, wrapper);

                        return function() {
                            socket.removeListener(eventName, wrapper);
                        };
                    },

                    emit: function(eventName, data, callback) {
                        socket.emit(eventName, data, function() {
                            var args = arguments;
                            $rootScope.$apply(function() {
                                if (callback) {
                                    callback.apply(socket, args);
                                }
                            });
                        });
                    }
                };
            }
        ]);



    angular.module('gorilla')
        .config(function($stateProvider, $httpProvider, $urlRouterProvider, $sceDelegateProvider) {

            $urlRouterProvider.otherwise('/home/balanced');

            $stateProvider


            .state('home', {
                url: '/home',
                templateUrl: 'partials/main.html',
                controller: 'navCtrl as ctrl',
                resolve: {
                    articles: function(artSrv) {
                        return artSrv.getArticles('ESPNFC');
                    },

                    media: function(artSrv) {
                        return artSrv.getMedia();
                    }
                    
                  

                }

            })

            .state('home.balanced', {
                url: '/balanced',
                templateUrl: 'partials/layout_balanced.html',
                controller: 'balancedCtrl as ctrl',


            })

            .state('home.gambler', {
                url: '/gambler',
                templateUrl: 'partials/layout_gambler.html',
                controller: 'gamblerCtrl as ctrl',
                resolve: {
                    articles: function(artSrv) {
                        return artSrv.getArticles('ESPNFC');
                    },

                    media: function(artSrv) {
                        return artSrv.getMedia();
                    },
                    gamblerArticles: function(artSrv) {
                        return artSrv.getGamblerArticles('THE GUARDIAN', 'BBC', 'FOOTBALL-ESPANA');
                    }

                }

            });

            $sceDelegateProvider.resourceUrlWhitelist([
                // Allow same origin resource loads. https://streamable.com/ryxq
                'self',
                // Allow loading from our assets domain.  Notice the difference between * and **.
                'http://streamable.com/e/**',
                'https://www.youtube.com/embed/**'
            ]);


        });






})();