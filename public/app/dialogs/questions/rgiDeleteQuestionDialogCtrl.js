'use strict';

angular.module('app')
    .controller('rgiDeleteQuestionDialogCtrl', ['$scope', '$location', 'rgiQuestionMethodSrvc', 'rgiNotifier', function (
        $scope,
        $location,
        rgiQuestionMethodSrvc,
        rgiNotifier
    ) {
        $scope.deleteQuestion = function () {
            rgiQuestionMethodSrvc.deleteQuestion($scope.$parent.question._id).then(function () {
                $scope.closeThisDialog();
                $location.path('/admin/question-admin');
                rgiNotifier.notify('Question has been deleted');
            }, function (reason) {
                rgiNotifier.error(reason);
            });
        };
    }]);
