'use strict';

angular.module('app')
    .controller('rgiCalendarCtrl', function ($scope) {
        $scope.date_max_limit = new Date();
        $scope.date_options = {formatYear: 'yy', startingDay: 1};
        $scope.date_format = 'dd-MMMM-yyyy';
        $scope.status = {opened: false};

        $scope.openCalendar = function () {
            $scope.status.opened = true;
        };
    });