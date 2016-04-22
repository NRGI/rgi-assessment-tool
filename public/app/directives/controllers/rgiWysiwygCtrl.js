'use strict';

angular.module('app')
    .controller('rgiWysiwygCtrl', function ($scope) {
        console.log($scope);
        $scope.editorContentMaxLength = 4000;
        $scope.taToolbarOptions = [
            ['undo', 'redo', 'clear'],
            ['bold', 'italics', 'underline'],
            ['h1', 'h2', 'h3'],
            ['ul', 'ol'],
            ['quote', 'insertLink'],
            ['charcount']
        ];
        $scope.editorConfig = {
            sanitize: false,
            toolbar: [
                // { name: 'basicStyling', items: ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', '-', 'leftAlign', 'centerAlign', 'rightAlign', 'blockJustify', '-'] },
                { name: 'paragraph', items: ['orderedList', 'unorderedList', '-'] },
                { name: 'doers', items: ['undo', 'redo', '-'] },
                // { name: 'colors', items: ['fontColor', 'backgroundColor', '-'] },
                // { name: 'links', items: ['image', 'hr', 'symbols', 'link', 'unlink', '-'] },
                // { name: 'tools', items: ['print', '-'] },
                { name: 'styling', items: [ 'format'] },
            ]
        };
    });
