'use strict';

describe('rgiNewResourceDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, $route, rgiNotifier, rgiResourcesMethodSrvc,
        RESOURCE_TYPE = 'faq';

    beforeEach(inject(
        function ($rootScope, $controller, _$route_, _rgiNotifier_, _rgiResourcesMethodSrvc_) {
            $route = _$route_;
            rgiNotifier = _rgiNotifier_;
            rgiResourcesMethodSrvc = _rgiResourcesMethodSrvc_;

            $scope = $rootScope.$new();

            $scope.$parent = {
                resources: [],
                resource_type: RESOURCE_TYPE
            };

            $controller('rgiNewResourceDialogCtrl', {$scope: $scope});
        }
    ));

    it('sets bew resource template data', function() {
        $scope.new_resource.should.deep.equal({order: 1, type: RESOURCE_TYPE});
    });

    describe('#createResource', function() {
        var mocks = {};

        beforeEach(function() {
            mocks.notifier = sinon.mock(rgiNotifier);
        });

        describe('INCOMPLETE DATA CASE', function() {
            it('shows an error message if the resource title is not set', function() {
                $scope.new_resource.head = undefined;
                mocks.notifier.expects('error').withArgs('You must supply a title!');
            });

            it('shows an error message if the resource content is not set', function() {
                $scope.new_resource.head = 'head';
                $scope.new_resource.body = undefined;
                mocks.notifier.expects('error').withArgs('You must supply content!');
            });

            afterEach(function() {
                $scope.createResource();
                mocks.notifier.verify();
            });
        });

        describe('COMPLETE DATA CASE', function() {
            var resourcesMethodCreateResourceStub, TITLE = 'TITLE', CONTENT = 'CONTENT', spies = {},
                setStub = function(callback) {
                    spies.resourcesMethodCreateResource = sinon.spy(function() {
                        return {then: callback};
                    });

                    resourcesMethodCreateResourceStub = sinon.stub(rgiResourcesMethodSrvc, 'createResource',
                        spies.resourcesMethodCreateResource);
                };

            beforeEach(function() {
                $scope.new_resource.head = TITLE;
                $scope.new_resource.body = CONTENT;
            });

            describe('SUCCESS CASE', function() {
                beforeEach(function() {
                    setStub(function(callback) {
                        callback();
                    });

                    mocks.$route = sinon.mock($route);
                    mocks.$route.expects('reload');

                    mocks.notifier.expects('notify').withArgs('New resource created!');
                    $scope.closeThisDialog = sinon.spy();
                    $scope.createResource();
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

                setStub(function(callbackPositive, callbackNegative) {
                    callbackNegative(FAILURE_REASON);
                });

                mocks.notifier.expects('error').withArgs(FAILURE_REASON);
                $scope.createResource();
                mocks.notifier.verify();
            });

            afterEach(function() {
                resourcesMethodCreateResourceStub.restore();
            });
        });

        afterEach(function() {
            Object.keys(mocks).forEach(function(mockName) {
                mocks[mockName].restore();
            });
        });
    });
});
