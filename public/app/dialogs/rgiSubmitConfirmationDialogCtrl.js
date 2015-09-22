function isURLReal(fullyQualifiedURL) {
    'use strict';
    var URL = encodeURIComponent(fullyQualifiedURL),
        dfd = $.Deferred(),
        checkURLPromise = $.getJSON('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22' + URL + '%22&format=json');

    checkURLPromise
        .done(function(res) {
            // results should be null if the page 404s or the domain doesn't work
            if (res.query.results) {
                dfd.resolve(true);
            } else {
                dfd.reject(false);
            }
        })
        .fail(function () {
            dfd.reject('failed');
        });
    return dfd.promise();
}
angular
    .module('app')
    .controller('rgiSubmitConfirmationDialogCtrl', function (
        $scope,
        $location,
        $route,
        ngDialog,
        rgiNotifier,
        rgiAssessmentMethodSrvc
    ) {
        'use strict';
        $scope.assessmentSubmit = function () {
            var new_assessment_data = $scope.$parent.assessment;

            new_assessment_data.status = 'submitted';
            new_assessment_data.questions_complete = 0;
            //MAIL NOTIFICATION
            new_assessment_data.mail = true;

            rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data)
                .then(function () {
                    ngDialog.close();
                    $location.path('/assessments');
                    //$route.reload();
                    rgiNotifier.notify('Assessment submitted!');
                }, function (reason) {
                    rgiNotifier.error(reason);
                });
        };

        $scope.closeDialog = function () {
            ngDialog.close();
        };
    });