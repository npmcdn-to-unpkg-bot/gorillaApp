(function() {
    'use strict'

    angular
        .module('gorilla')
        .directive("scrollRevealRepeat", ScrollRevealRepeat);

    function ScrollRevealRepeat() {

        return {
            restrict: 'EA',
            link: function(scope, element, attr) {

                var origin = ['top', 'bottom']
                var easing = ['ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out'];

                var config = {
                    duration: 500,
                    origin: origin[Math.round(Math.random())],
                    easing: easing[Math.round(Math.random() * 4)],
                    distance: (Math.random() * 100) + 'px',
                    delay: (Math.random() * 50),
                    viewFactor: 0.1,
                    opacity: 0.3,
                    container:'.media-list'

                }

                var el = element[0];

                sr.reveal(el,config);

            }

        }
    }

})();