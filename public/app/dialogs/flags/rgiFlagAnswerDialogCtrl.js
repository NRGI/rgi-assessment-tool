'use strict';

angular
    .module('app')
    .controller('rgiFlagAnswerDialogCtrl', function (
        $scope,
        $route,
        $location,
        ngDialog,
        rgiNotifier,
        rgiAnswerMethodSrvc
    ) {
        $scope.saveFlag = function () {
            var new_answer_data = $scope.$parent.answer,
                current_user = $scope.$parent.identity.currentUser,
                new_flag_data = {
                    content: $scope.flag_content,
                    author_name: current_user.firstName + ' ' + current_user.lastName,
                    author: current_user._id,
                    role: current_user.role,
                    date: new Date().toISOString(),
                    addressed: false,
                    addressed_to: $scope.$parent.assessment.edit_control
                };

            new_answer_data.flags.push(new_flag_data);
            new_answer_data.status = 'flagged';

            rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
                .then(function () {
                    rgiNotifier.notify('Answer flagged');
                    $scope.closeThisDialog();
                    $route.reload();
                }, function (reason) {
                    rgiNotifier.notify(reason);
                });
        };

        $scope.closeDialog = function () {
            ngDialog.close();
        };
    });