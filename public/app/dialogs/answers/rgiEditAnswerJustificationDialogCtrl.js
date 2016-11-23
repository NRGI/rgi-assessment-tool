'use strict';

angular.module('app')
    .controller('rgiEditAnswerJustificationDialogCtrl', ['$scope', 'rgiAnswerMethodSrvc', 'rgiNotifier', function (
        $scope,
        rgiAnswerMethodSrvc,
        rgiNotifier
    ) {
        var originalJustification = $scope.answer[$scope.field];

        $scope.editJustification = function() {
            rgiAnswerMethodSrvc.updateAnswer($scope.answer)
                .then(function () {
                    rgiNotifier.notify('Justification changed');
                }, function (reason) {
                    rgiNotifier.error(reason);
                }).finally(function() {
                    $scope.closeThisDialog();
                    $scope.answer[$scope.field] = originalJustification;
                });
        };
    }]);
