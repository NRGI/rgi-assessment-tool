'use strict';

angular
    .module('app')
    .directive('rgiDraggableDialog', function () {
        return function (scope, element) {
            $(element).closest('.ngdialog-content').draggable();
        };
    });