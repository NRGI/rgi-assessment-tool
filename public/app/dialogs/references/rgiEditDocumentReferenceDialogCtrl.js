'use strict';

angular.module('app')
    .controller('rgiEditDocumentReferenceDialogCtrl', function (
        $scope,
        $rootScope,
        ngDialog,
        rgiAnswerMethodSrvc,
        rgiNotifier
    ) {
        var
            new_answer_data = $scope.$parent.$parent.answer,
            ref_index = $scope.$parent.$parent.ref_index;

        $scope.ref = new_answer_data.references[ref_index];

        var today = new Date();
        $scope.date_default = today;
        $scope.date_max_limit = today;
        $scope.date_options = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.date_formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.date_format = $scope.date_formats[0];
        $scope.status = {opened: false};

        $scope.openCalendar = function () {
            $scope.status.opened = true;
        };

        $scope.editReference = function(referenceIndex) {
            new_answer_data.references[referenceIndex] = $scope.ref;
            rgiAnswerMethodSrvc.updateAnswer(new_answer_data).then(function () {
                $scope.closeDialog();
                $rootScope.$broadcast('RESET_REFERENCE_ACTION');
                rgiNotifier.notify('The reference has been edited');
            }, function (reason) {
                rgiNotifier.error(reason);
            });
        };

        $scope.closeDialog = function () {
            ngDialog.close();
        };
    });
