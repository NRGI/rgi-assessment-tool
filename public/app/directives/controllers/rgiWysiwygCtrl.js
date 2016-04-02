'use strict';

angular.module('app')
    .controller('rgiWysiwygCtrl', function ($scope) {
        $scope.editorContentMaxLength = 4000;
        $scope.taToolbarOptions = [
            ['undo', 'redo', 'clear'],
            ['bold', 'italics', 'underline'],
            ['h1', 'h2', 'h3'],
            ['ul', 'ol'],
            ['quote', 'insertLink'],
            ['charcount']
        ];
    });
