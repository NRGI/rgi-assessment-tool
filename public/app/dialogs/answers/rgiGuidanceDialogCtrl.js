'use strict';

angular.module('app')
    .controller('rgiGuidanceDialogCtrl', function (
        $scope,
        ngDialog,
        rgiAnswerMethodSrvc,
        rgiNotifier
    ) {
        $scope.question_guidance_text = $scope.$parent.question.question_guidance_text;
        $scope.current_user = $scope.$root.current_user;

        var new_answer_data = $scope.$parent.answer;
        new_answer_data.guidance_dialog = false;
        rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
            .then(function () {

            }, function (reason) {
                rgiNotifier.notify(reason);
                ngDialog.close();
            });

        $scope.closeDialog = function () {
            ngDialog.close();
        };
    });