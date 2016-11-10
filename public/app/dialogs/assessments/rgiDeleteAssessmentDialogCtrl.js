'use strict';

angular.module('app')
    .controller('rgiDeleteAssessmentDialogCtrl', [
        '$scope',
        '$location',
        '$q',
        'rgiAssessmentMethodSrvc',
        'rgiLogger',
        'rgiNotifier',
        function (
            $scope,
            $location,
            $q,
            rgiAssessmentMethodSrvc,
            rgiLogger,
            rgiNotifier
        ) {
            $scope.remove = function() {
                var promises = [];

                $scope.assessment.deleted = true;
                promises.push(rgiAssessmentMethodSrvc.updateAssessment($scope.assessment).$promise);
                promises.push(rgiAssessmentMethodSrvc.deleteAssessment($scope.assessment.assessment_ID).$promise);

                $q.all(promises).then(function() {
                    rgiNotifier.notify('The assessment has been deleted');
                    $location.path('/admin/assessment-admin');
                }, function(reason) {
                    $scope.assessment.deleted = false;
                    rgiNotifier.error('The assessment removal has been failed');
                    rgiLogger.log(reason);
                }).finally($scope.closeThisDialog);
            };
        }]);
