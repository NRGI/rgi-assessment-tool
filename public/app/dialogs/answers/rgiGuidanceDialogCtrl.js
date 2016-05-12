'use strict';

angular.module('app')
    .controller('rgiGuidanceDialogCtrl', function (
        $scope,
        rgiAnswerMethodSrvc,
        rgiNotifier
    ) {
        $scope.question_guidance_text = $scope.$parent.question.question_guidance_text;
        var answer = $scope.$parent.answer;
        answer.guidance_dialog = false;

        rgiAnswerMethodSrvc.updateAnswer(answer)
            .catch(function (reason) {
                rgiNotifier.notify(reason);
                $scope.closeThisDialog();
            });
    });
