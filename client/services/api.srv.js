(function() {
        'use strict'

        angular
            .module('gorilla')
            .service('api', ApiService);

        function ApiService($http) {
            this.http = $http;
            this.BASE_URL = 'http://localhost:3000/api';
            this.request = ApiRequest;
            this.formatGetData = formatGetData;
            this.serialize = serializeData;
     
            this.mediaOpen = mediaOpen;
            // this.getReddit = getReddit;
            

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
                }
            };

            function ApiRequest(endpoint, data, method) {

                //build request
                if (method == 'POST') {
                    data = JSON.stringify(data);
                    return this.http.post(this.BASE_URL + endpoint, data)
                } else if (method == 'GET') {
                    data = this.formatGetData(data);
                    return this.http.get(this.BASE_URL + endpoint + data);
                } else if (method == 'PUT') {
                    data = JSON.stringify(data);
                    return this.http.put(this.BASE_URL + endpoint, data);
                } else if (method == 'DEL') {
                    return this.http.delete(this.BASE_URL + endpoint);
                }

            };

            // function getReddit() {
            //     return this.http.get('https://www.reddit.com/r/soccer/hot/.json?limit=30').then(function(res) {
            //             console.log(res);
            //             var list = res.data.data.children;
            //             var redditArticles = [];
            //             list.forEach(function(item) {
            //                 if (!(/gfycat/.test(item.data.domain)) && !(/streamable/.test(item.data.domain)) && !(/youtu/.test(item.data.domain)) && !(/abload/.test(item.data.domain))) {
            //                     var post = {
            //                         title: item.data.title,
            //                         link: item.data.url,
            //                         author: 'n/a',
            //                         count: 0,
            //                         source: 'reddit',
            //                         comments: 'http://www.reddit.com' + item.data.permalink,


            //                     };

            //                     redditArticles.push(post);

            //                 }

            //             });
            //             return redditArticles;
            //         })
            //     }

               

            
                function formatGetData(data) {
                    var data_string = '?';
                    for (item in data) {
                        if (data_string == '?') {
                            data_string += item + '=' + encodeURIComponent(data[item]);
                        } else {
                            data_string += '&' + item + '=' + encodeURIComponent(data[item]);
                        }
                    }
                    if (data_string == '?') {
                        return '';
                    }
                    return data_string;
                }
                //helper function for serializing data for the api
                function serializeData(data) {
                    // If this is not an object, defer to native stringification.
                    if (!angular.isObject(data)) {
                        return ((data == null) ? "" : data.toString());
                    }
                    var buffer = [];
                    // Serialize each key in the object.
                    for (var name in data) {
                        if (!data.hasOwnProperty(name)) {
                            continue;
                        }
                        var value = data[name];
                        buffer.push(
                            encodeURIComponent(name) + "=" + encodeURIComponent((value == null) ? "" : value)
                        );
                    }
                    // Serialize the buffer and clean it up for transportation.
                    var source = buffer.join("&").replace(/%20/g, "+");
                    return (source);
                }

            }
        })();