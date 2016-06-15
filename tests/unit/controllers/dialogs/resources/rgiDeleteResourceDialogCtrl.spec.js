'use strict';

describe('rgiDeleteResourceDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, $route, rgiNotifier, rgiResourcesMethodSrvc;

    beforeEach(inject(
        function ($rootScope, $controller, _$route_, _rgiNotifier_, _rgiResourcesMethodSrvc_) {
            $route = _$route_;
            rgiNotifier = _rgiNotifier_;
            rgiResourcesMethodSrvc = _rgiResourcesMethodSrvc_;

            $scope = $rootScope.$new();
            $controller('rgiDeleteResourceDialogCtrl', {$scope: $scope});
        }
    ));

    describe('#deleteResource', function() {
        var resourcesMethodDeleteResourceStub, mocks = {}, spies = {}, RESOURCE_ID = 'RESOURCE ID',
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
                mocks.notifier.expects('notify').withArgs('Resource has been deleted');

                $scope.closeThisDialog = sinon.spy();
                $scope.deleteResource();
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

            $scope.deleteResource();
            mocks.notifier.verify();
        });

        afterEach(function() {
            spies.resourcesMethodDeleteResource.withArgs(RESOURCE_ID).called.should.be.equal(true);
            resourcesMethodDeleteResourceStub.restore();

            Object.keys(mocks).forEach(function(mockName) {
                mocks[mockName].restore();
            });
        });
    });
});
