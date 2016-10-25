'use strict';

angular.module('app')
    .controller('rgiExternalAnswerTabsCtrl', ['$scope', 'rgiDialogFactory', 'rgiIdentitySrvc', function (
        $scope,
        rgiDialogFactory,
        rgiIdentitySrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;

        $scope.isAlternativeScore = function(score) {
            return ($scope.answer.researcher_score.value !== score.value) &&
                ($scope.answer.reviewer_score.value !== score.value);
        };
    }]);