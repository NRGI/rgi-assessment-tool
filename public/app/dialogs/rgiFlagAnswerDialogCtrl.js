'use strict';
/*jslint unparam: true nomen: true*/
//var angular;

angular.module('app').controller('rgiFlagAnswerDialogCtrl', function ($scope, $route, $location, ngDialog, rgiNotifier, rgiAnswerMethodSrvc, rgiAssessmentMethodSrvc) {

    $scope.flagAnswer = function () {
        var new_answer_data = $scope.$parent.answer,
            current_user = $scope.$parent.identity.currentUser,
            new_assessment_data = $scope.$parent.assessment,
            new_flag_data = {
                content: $scope.flag_content,
                author_name: current_user.firstName + ' ' + current_user.lastName,
                author: current_user._id,
                role: current_user.role,
                date: new Date().toISOString(),
                addressed: false
            };
        console.log(new_flag_data);

        new_answer_data.flags.push(new_flag_data);

        if (new_answer_data.status === 'approved') {
            new_answer_data.status = 'flagged';
            new_assessment_data.questions_complete -= 1;
            new_assessment_data.questions_flagged += 1;
        } else if (new_answer_data.status !== 'flagged') {
            new_answer_data.status = 'flagged';
            new_assessment_data.questions_flagged += 1;
        }

        rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
            .then(rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data))
            .then(function () {
                rgiNotifier.notify('Answer flagged');
                $scope.closeThisDialog();
            }, function (reason) {
                rgiNotifier.notify(reason);
            });
    };

    $scope.closeDialog = function () {
        ngDialog.close();
    };
});
