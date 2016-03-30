'use strict';

angular.module('app')
    .controller('rgiFlagAnswerDialogCtrl', function (
        $scope,
        $route,
        $location,
        ngDialog,
        rgiNotifier,
        rgiIdentitySrvc,
        rgiAnswerMethodSrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.editorContentMaxLength = $scope.$root.editorContentMaxLength;
        $scope.taToolbarOptions = $scope.$root.taToolbarOptions;

        $scope.saveFlag = function () {
            var new_answer_data = $scope.$parent.answer,
                new_flag_data = {
                    content: $scope.flag_content,
                    author_name: $scope.current_user.firstName + ' ' + $scope.current_user.lastName,
                    author: $scope.current_user._id,
                    role: $scope.current_user.role,
                    date: new Date().toISOString(),
                    addressed: false,
                    addressed_to: $scope.$parent.assessment.edit_control
                };

            new_answer_data.flags.push(new_flag_data);
            new_answer_data.status = 'flagged';
            new_answer_data.researcher_resolve_flag_required = true;

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