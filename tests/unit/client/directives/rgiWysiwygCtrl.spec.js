'use strict';

describe('rgiWysiwygCtrl', function () {
    beforeEach(module('app'));
    var $scope,
        initialize = function(limit) {
            beforeEach(inject(
                function ($rootScope, $controller) {
                    $scope = $rootScope.$new();

                    if(limit) {
                        $scope.limit = limit;
                    }

                    $controller('rgiWysiwygCtrl', {$scope: $scope});
                }
            ));
        };

    describe('limit is not set', function() {
        initialize();

        it('sets the content max length to the default value', function() {
            $scope.editorContentMaxLength.should.be.equal(4000);
        });
    });

    describe('limit is set', function() {
        var LIMIT = 1000;
        initialize(LIMIT);

        it('sets the content max length to the specified limit value', function() {
            $scope.editorContentMaxLength.should.be.equal(LIMIT);
        });
    });

    afterEach(function() {
        $scope.taToolbarOptions.should.deep.equal([
            ['undo', 'redo', 'clear'],
            ['bold', 'italics', 'underline'],
            ['h1', 'h2', 'h3'],
            ['ul', 'ol'],
            ['quote', 'insertLink'],
            ['charcount']
        ]);
    });
});
