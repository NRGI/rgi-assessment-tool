'use strict';

describe('rgiDeleteResourceDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, $route, ngDialog, rgiNotifier, rgiResourcesMethodSrvc, mocks = {};

    beforeEach(inject(
        function ($rootScope, $controller, _$route_, _ngDialog_, _rgiNotifier_, _rgiResourcesMethodSrvc_) {
            $route = _$route_;
            ngDialog = _ngDialog_;
            rgiNotifier = _rgiNotifier_;
            rgiResourcesMethodSrvc = _rgiResourcesMethodSrvc_;

            $scope = $rootScope.$new();
            $controller('rgiDeleteResourceDialogCtrl', {$scope: $scope});
        }
    ));

    describe('#resourceDelete', function() {
        var resourcesMethodDeleteResourceStub, spies = {}, RESOURCE_ID = 'RESOURCE ID',
            setResourcesMethodDeleteResourceStub = function(callback) {
                spies.resourcesMethodDeleteResource = sinon.spy(function() {
                    return {then: callback};
                });
                resourcesMethodDeleteResourceStub = sinon.stub(rgiResourcesMethodSrvc, 'deleteResource',
                    spies.resourcesMethodDeleteResource);
            };

        beforeEach(function() {
            mocks.notifier = sinon.mock(rgiNotifier);
            $scope.$parent = {resource: {_id: RESOURCE_ID}};
        });

        describe('SUCCESS CASE', function() {
            beforeEach(function() {
                setResourcesMethodDeleteResourceStub(function(callback) {
                    callback();
                });

                mocks.$route = sinon.mock($route);
                mocks.$route.expects('reload');
                mocks.notifier.expects('notify').withArgs('Question has been deleted');

                $scope.closeThisDialog = sinon.spy();
                $scope.resourceDelete();
            });

            it('closes the dialog', function() {
                $scope.closeThisDialog.called.should.be.equal(true);
            });

            it('reloads the page', function() {
                mocks.$route.verify();
            });

            it('shows a confirmation message', function() {
                mocks.notifier.verify();
            });
        });

        it('shows an error message in case of a failure', function() {
            var FAILURE_REASON = 'FAILURE REASON';
            mocks.notifier.expects('error').withArgs(FAILURE_REASON);

            setResourcesMethodDeleteResourceStub(function(callbackSuccess, callbackFailure) {
                callbackFailure(FAILURE_REASON);
            });

            $scope.resourceDelete();
            mocks.notifier.verify();
        });

        afterEach(function() {
            spies.resourcesMethodDeleteResource.withArgs(RESOURCE_ID).called.should.be.equal(true);
            resourcesMethodDeleteResourceStub.restore();
        });
    });

    describe('#resourceDelete', function() {
        it('closes the current dialog', function() {
            mocks.ngDialog = sinon.mock(ngDialog);
            mocks.ngDialog.expects('close');
            $scope.closeDialog();
            mocks.ngDialog.verify();
        });
    });

    afterEach(function() {
        Object.keys(mocks).forEach(function(mockName) {
            mocks[mockName].restore();
        });
    });
});
