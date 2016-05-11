'use strict';

angular.module('app')
    .controller('rgiFlagEditDialogCtrl', function (
        $scope,
        $route,
        ngDialog,
        rgiNotifier,
        rgiIdentitySrvc,
        rgiAnswerMethodSrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.flag_content = $scope.$parent.flag.content;

        $scope.saveFlag = function () {
            var new_answer_data = $scope.$parent.answer,
                new_flag_data = $scope.$parent.flag,
                index = $scope.$parent.index;
            if (new_flag_data.content === $scope.flag_content) {
                rgiNotifier.error('Do you have edits to submit?');
            } else {
                new_answer_data.flags[index].content = $scope.flag_content;

                rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
                    .then(function () {
                        rgiNotifier.notify('Flag edited');
                        $route.reload();
                    }, function (reason) {
                        rgiNotifier.notify(reason);
                    }).finally($scope.closeThisDialog);
            }
        };

        $scope.closeDialog = function () {
            ngDialog.close();
        };
    });
