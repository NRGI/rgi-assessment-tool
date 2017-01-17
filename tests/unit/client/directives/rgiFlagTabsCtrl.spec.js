'use strict';

describe('rgiFlagTabsCtrl', function () {
    beforeEach(module('app'));
    var $scope, dialogFactoryMock;

    beforeEach(inject(
        function ($rootScope, $controller, rgiDialogFactory) {
            $scope = $rootScope.$new();
            dialogFactoryMock = sinon.mock(rgiDialogFactory);
            $controller('rgiFlagTabsCtrl', {$scope: $scope});
        }
    ));

    describe('#flagEdit', function() {
        it('opens a dialog', function() {
            var FLAG = 'flag', INDEX = 'index';
            dialogFactoryMock.expects('flagEdit').withArgs($scope, FLAG, INDEX);
            $scope.flagEdit(FLAG, INDEX);
            dialogFactoryMock.verify();
        });
    });

    afterEach(function() {
        dialogFactoryMock.restore();
    });
});
