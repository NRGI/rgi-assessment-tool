'use strict';

angular.module('app')
    .controller('rgiDeleteRefDialogCtrl', function (
        $scope,
        $rootScope,
        ngDialog,
        rgiAnswerMethodSrvc,
        rgiNotifier
    ) {
        $scope.ref_index = $scope.$parent.$parent.ref_index;

        $scope.refDelete = function(ref_index) {
            var new_answer_data = $scope.$parent.$parent.answer;

            new_answer_data.references[ref_index].hidden = true;
            rgiAnswerMethodSrvc.updateAnswer(new_answer_data).then(function () {
                $scope.closeDialog();
                $rootScope.$broadcast('RESET_REFERENCE_ACTION');
                rgiNotifier.notify('The reference has been deleted');
            }, function (reason) {
                rgiNotifier.error(reason);
            });
        };
        $scope.closeDialog = function () {
            $rootScope.$broadcast('RESET_SELECTED_REFERENCE_ACTION');
            ngDialog.close();
        };
    });