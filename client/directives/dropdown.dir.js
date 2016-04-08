(function() {
    'use strict'

    angular.module('gorilla')
        .directive("optionsBox", OptionsBox);


    function OptionsBox($document) {


        var optionsCtrl = function($scope,$document,artSrv) {

            var ctrl = this;
            ctrl.selectSource = selectSource;
            ctrl.showSources = showSources;
            ctrl.sources = artSrv.sources;

            function selectSource(option) {
                ctrl.select = option;
                ctrl.showSources();
                ctrl.loadSource();
            }

            function showSources() {
                ctrl.optionsShow = !ctrl.optionsShow;
            }



        }

        var template = '<div class="selected" ng-click="ctrl.showSources()" > <p>{{ ctrl.select }} </p><div class="arrow-down"></div></div><ul class="options" ng-show="ctrl.optionsShow"><li ng-repeat="source in ctrl.sources" ng-click="ctrl.selectSource(source)">{{ source }}</li></ul>';

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
            
            link: function(scope, element, attr,ctrl) {

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

