'use strict';

angular.module('app')
    .controller('rgiFlagEditDialogCtrl', function (
        $scope,
        $route,
        ngDialog,
        rgiNotifier,
        rgiAnswerMethodSrvc
    ) {
        $scope.current_user = $scope.$root.current_user;
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
                        $scope.closeThisDialog();
                        $route.reload();
                    }, function (reason) {
                        rgiNotifier.notify(reason);
                    });
            }
        };

        $scope.closeDialog = function () {
            ngDialog.close();
        };
    });