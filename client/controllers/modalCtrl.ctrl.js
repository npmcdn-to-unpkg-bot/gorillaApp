(function() {
        angular.module('gorilla')
            .controller('modalCtrl', ModalCtrl);

        function ModalCtrl(item, $uibModalInstance, $sce, $http) {
            var ctrl = this;
            ctrl.close = close;
            ctrl.youtubeUrl = /[^=]*$/.exec(item.link)[0];
            ctrl.itemlink = $sce.trustAsResourceUrl(item.link);
            ctrl.item = item;
            ctrl.link = item.link;

            ctrl.url = /[^/]*$/.exec(item.link)[0];
            console.log('item to modal:', item);
            console.log('modal link', ctrl.link);
            if (/youtu\.be/.test(item.link)) {
                ctrl.youtubeUrl = /[^/]*$/.exec(item.link)[0];
            }
            setTimeout(function(){
                window.instgrm.Embeds.process();
            });

            ctrl.$uibModalInstance = $uibModalInstance;

            function close() {
                ctrl.$uibModalInstance.dismiss();
            }

        }


    }



)();