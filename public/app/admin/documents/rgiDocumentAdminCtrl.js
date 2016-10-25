'use strict';

angular.module('app')
    .controller('rgiDocumentAdminCtrl', ['$scope', function ($scope) {
        // filtering options
        $scope.sort_options = [
            {value: 'title', text: 'Sort by document title'},
            {value: 'type', text: 'Sort by document type'},
            {value: 'assessments', text: 'Sort by attached assessments'}
        ];

        $scope.sort_order = $scope.sort_options[0].value;
    }]);
