'use strict';

angular.module('app')
    .controller('rgiEditRefDialogCtrl', function (
        $scope,
        $rootScope,
        ngDialog,
        rgiAnswerMethodSrvc,
        rgiNotifier
    ) {
        var new_answer_data = $scope.$parent.$parent.answer,
            ref_index = $scope.$parent.$parent.ref_index;
        $scope.ref = new_answer_data.references[ref_index]
        //console.log(new_answer_data);
        //console.log(ref_index);
        //console.log(new_answer_data.references[ref_index]);

        $scope.refEdit = function(ref_index) {
            console.log(ref_index)

            //
            //new_answer_data.references[ref_index].hidden = true;
            //rgiAnswerMethodSrvc.updateAnswer(new_answer_data).then(function () {
            //    $scope.closeDialog();
            //    $rootScope.$broadcast('RESET_REFERENCE_ACTION');
            //    rgiNotifier.notify('The reference has been deleted');
            //}, function (reason) {
            //    rgiNotifier.error(reason);
            //});
        };
        $scope.closeDialog = function () {
            ngDialog.close();
        };
    });