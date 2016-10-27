'use strict';

angular.module('app')
    .controller('rgiDeleteAssessmentDialogCtrl', [
        '$scope',
        '$location',
        'rgiAssessmentMethodSrvc',
        'rgiNotifier',
        function (
            $scope,
            $location,
            rgiAssessmentMethodSrvc,
            rgiNotifier
        ) {
            $scope.remove = function() {
                $scope.assessment.deleted = true;

                rgiAssessmentMethodSrvc.updateAssessment($scope.assessment).then(function() {
                    rgiNotifier.notify('The assessment has been deleted');
                    $location.path('/admin/assessment-admin');
                }, function(reason) {
                    $scope.assessment.deleted = false;
                    rgiNotifier.error(reason);
                }).finally($scope.closeThisDialog);
            };
        }]);
