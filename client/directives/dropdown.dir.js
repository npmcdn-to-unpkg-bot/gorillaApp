(function() {
    'use strict'

    angular.module('gorilla')
        .directive("optionsBox", OptionsBox);


    function OptionsBox($document) {


        var optionsCtrl = function($scope, $document, artSrv, api) {

            var ctrl = this;
            ctrl.selectSource = selectSource;
            ctrl.showSources = showSources;
            ctrl.sources = artSrv.sources;
            ctrl.doSearch = doSearch;
            ctrl.clearSearch=clearSearch;

            function clearSearch(){
                ctrl.byAuthor='';
                doSearch();
            }
            function doSearch() {
                if (ctrl.byAuthor.length > 2) {

                    api.request('/Articles?filter[where][author][like]=' + ctrl.byAuthor + '&filter[where][author][options]=i&filter[order]=createdAt%20DESC&filter[limit]=30', {}, 'GET')
                        .then(function(res) {
                            console.log('result of search: ',res.data);
                            ctrl.articles=res.data;

                        });
                }
                else {
                    ctrl.articles=artSrv.articles;
                }

            }

            function selectSource(option) {
                ctrl.select = option;
                ctrl.showSources();
                ctrl.loadSource();
            }

            function showSources() {
                ctrl.optionsShow = !ctrl.optionsShow;
            }




        }

        var template = '<div class="selected v-align" ng-click="ctrl.showSources()"><img ng-if="ctrl.select!=\'REDDIT\'" ng-src="assets/img/{{ ctrl.select }}.png"><h3 ng-if="ctrl.select==\'REDDIT\'">{{ctrl.select}}</h3><div class="arrow-down"></div></div><div class="search" ng-show="ctrl.optionsShow"><form ng-submit="ctrl.showSources()"><input type="text" placeholder="Search author" onfocus="this.placeholder = \'\'" onblur="this.placeholder = \'Search author\'"   ng-model="ctrl.byAuthor" ng-change="ctrl.doSearch()"> <span ng-click="ctrl.clearSearch()" ng-show="ctrl.byAuthor.length>0" class="glyphicon glyphicon-remove"></span> </form></div><ul class="options" ng-show="ctrl.optionsShow"><li ng-repeat="source in ctrl.sources" ng-if="source!=ctrl.select" ng-click="ctrl.selectSource(source)">{{ source }}</li></ul>';

        return {
            restrict: 'EA',
            scope: true,
            bindToController: {
                articles: '=',
                select: '=',
                loadSource: '&'
            },

            template: template,

            controller: optionsCtrl,
            controllerAs: 'ctrl',

            link: function(scope, element, attr, ctrl) {

                scope.isPopupVisible = ctrl.optionsShow;
                scope.toggleSelect = ctrl.showSources;

                $document.bind('click', function(event) {
                    var isClickedElementChildOfPopup = element
                        .find(event.target)
                        .length > 0;

                    if (isClickedElementChildOfPopup)
                        return;

                    ctrl.optionsShow = false;
                    scope.$apply();
                });
            }

        }
    }



})();