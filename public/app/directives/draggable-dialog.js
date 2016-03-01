'use strict';

angular
    .module('app')
    .directive('draggableDialog', function () {
        return function (scope, element) {
            $(element).closest('.ngdialog-content').draggable();
        };
    });