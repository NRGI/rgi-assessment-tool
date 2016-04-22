'use strict';

angular.module('app')
    .controller('rgiWysiwygCtrl', function ($scope) {
        $scope.editorContentMaxLength = 4000;
        // $scope.taToolbarOptions = [
        //     ['undo', 'redo', 'clear'],
        //     ['bold', 'italics', 'underline'],
        //     ['h1', 'h2', 'h3'],
        //     ['ul', 'ol'],
        //     ['quote', 'insertLink'],
        //     ['charcount']
        // ];
        $scope.taToolbarOptions = [
            ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript'],
            ['format-block'],
            ['font'],
            ['font-size'],
            ['font-color', 'hilite-color'],
            ['remove-format'],
            ['ordered-list', 'unordered-list', 'outdent', 'indent'],
            ['left-justify', 'center-justify', 'right-justify'],
            ['code', 'quote', 'paragraph'],
            ['link', 'image']
        ]
    });
