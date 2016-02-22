'use strict';

angular.module('app')
    .controller('rgiDeleteQuestionDialogCtrl', function (
        $scope,
        $location,
        ngDialog,
        rgiQuestionMethodSrvc,
        rgiNotifier
    ) {
        $scope.current_user = $scope.$root.current_user;
        $scope.questionDelete = function () {
            var question_deletion = $scope.$parent.question._id;

            rgiQuestionMethodSrvc.deleteQuestion(question_deletion).then(function () {
                $scope.closeThisDialog();
                $location.path('/admin/question-admin');
                rgiNotifier.notify('Question has been deleted');
            }, function (reason) {
                rgiNotifier.error(reason);
            });
        };

        $scope.closeDialog = function () {
            ngDialog.close();
        };
    });