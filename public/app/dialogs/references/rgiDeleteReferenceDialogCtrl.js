'use strict';

angular.module('app')
    .controller('rgiDeleteReferenceDialogCtrl', function (
        $scope,
        $rootScope,
        rgiAnswerMethodSrvc,
        rgiNotifier
    ) {
        $scope.ref_index = $scope.$parent.$parent.ref_index;

        $scope.refDelete = function(ref_index) {
            var new_answer_data = $scope.$parent.$parent.answer;
            new_answer_data.references[ref_index].hidden = true;

            rgiAnswerMethodSrvc.updateAnswer(new_answer_data).then(function () {
                $scope.closeThisDialog();
                $rootScope.$broadcast('RESET_REFERENCE_ACTION');
                rgiNotifier.notify('The reference has been deleted');
            }, function (reason) {
                rgiNotifier.error(reason);
            });
        };
    });
