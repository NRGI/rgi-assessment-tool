'use strict';

angular.module('app')
    .controller('rgiWysiwygCtrl', function ($scope) {
        $scope.editorContentMaxLength = $scope.limit || 4000;
        $scope.taToolbarOptions = [
            ['undo', 'redo', 'clear'],
            ['bold', 'italics', 'underline'],
            ['h1', 'h2', 'h3'],
            ['ul', 'ol'],
            ['quote', 'insertLink'],
            ['charcount']
        ];
    });
