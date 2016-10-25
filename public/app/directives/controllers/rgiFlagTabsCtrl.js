'use strict';

angular.module('app')
    .controller('rgiFlagTabsCtrl', ['$scope', 'rgiDialogFactory', function ($scope, rgiDialogFactory) {
        $scope.flagEdit = function (flag, index) {
            rgiDialogFactory.flagEdit($scope, flag, index);
        };
    }]);
