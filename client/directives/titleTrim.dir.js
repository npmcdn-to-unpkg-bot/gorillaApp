(function() {
    angular.module('gorilla')
        .directive("titleTrim", TitleTrim);

    function TitleTrim() {

        var trimCtrl = function() {
            var ctrl = this;
            ctrl.fitStringToSize=fitStringToSize;
            function fitStringToSize(str, len) {
                var tmp = str,
                result = str; 
                var span = document.createElement("span");
                span.style.visibility = 'hidden';
                span.style.padding = '0px';
                document.body.appendChild(span);


                span.innerHTML = str;
                if (span.offsetWidth > len) {

                    while (span.offsetWidth > len) {
                        tmp = tmp.substring(0, tmp.length - 1);
                        span.innerHTML = tmp + '...';
                    }
                }
                result = span.innerHTML.replace('&amp;', '&');
                document.body.removeChild(span);
                return result;
            }
        }

        var template = '{{ctrl.fitStringToSize(ctrl.article.title,390)}}';

        return {
            restrict: 'EA',
            scope: true,
            bindToController: {
                article: '='
            },

            template: template,

            controller: trimCtrl,
            controllerAs: 'ctrl'

        }

    }


})();