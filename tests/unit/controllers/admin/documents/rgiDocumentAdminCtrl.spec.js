'use strict';

describe('rgiDocumentAdminCtrl', function () {
    beforeEach(module('app'));

    var $scope;

    beforeEach(inject(
        function ($rootScope, $controller) {
            $scope = $rootScope.$new();
            $controller('rgiDocumentAdminCtrl', {$scope: $scope});
        }
    ));

    it('loads the sorting options', function () {
        _.isEqual([
            {value: 'title', text: 'Sort by document title'},
            {value: 'type', text: 'Sort by document type'},
            {value: 'assessments', text: 'Sort by attached assessments'}
        ], $scope.sort_options).should.be.equal(true);
    });

    it('sets the sorting order', function () {
        $scope.sort_order.should.be.equal('title');
    });
});
