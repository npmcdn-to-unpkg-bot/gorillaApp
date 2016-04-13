(function() {
    'use strict'
    angular
        .module('gorilla')
        .controller('feedbackCtrl', FeedbackCtrl)

    function FeedbackCtrl($http, $uibModalInstance) {
        var ctrl = this;
        ctrl.message = '';
        ctrl.email = '';
        ctrl.success = false;
        ctrl.submit = submit;

        function submit() {
        	console.log(ctrl.email, ctrl.message);
            var data = {
                "key": "4CRuxcf-pMo5duQS4KjAYg",
                "message": {
                    "text": ctrl.message,
                    "subject": "Gorilla Feedback",
                    "from_email": 'info@gogorilla.io',
                    "from_name": "Gorilla",
                    "to": [{
                        "email": "marko.barca10@gmail.com",
                        "name": "Marko",
                        "type": "to"
                    }],
                    "headers": {
                        "Reply-To": ctrl.email
                    },

                    "tracking_domain": null,
                    "signing_domain": null,
                    "return_path_domain": null,
                    "merge": true,
                    "merge_language": "mailchimp"
                },
                "async": false,
                "ip_pool": "Main Pool",
            }
            data = JSON.stringify(data);
            $http.post('https://mandrillapp.com/api/1.0/messages/send.json', data).then(function(res) {
                console.log(res);
                ctrl.success = !ctrl.success;
                setTimeout(function() {
                    $uibModalInstance.dismiss();
                }, 2000);
            })

        }
    }
})();