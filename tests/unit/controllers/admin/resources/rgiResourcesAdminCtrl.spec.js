'use strict';

describe('rgiResourcesAdminCtrl', function () {
    beforeEach(module('app'));

    var $scope, $route, $location, rgiDialogFactory, rgiNotifier, rgiResourcesMethodSrvc,
        locationPathBackup, actualErrorHandler, RESOURCES = 'RESOURCES', spies = {}, stubs = {},
        setResourceType = function(resourceType) {
            locationPathBackup = $location.$$path;
            $location.$$path = '/admin/' + resourceType + '-admin';
        };

    beforeEach(inject(
        function (
            $rootScope,
            $controller,
            _$route_,
            _$location_,
            _rgiDialogFactory_,
            rgiHttpResponseProcessorSrvc,
            _rgiNotifier_,
            rgiResourcesSrvc,
            _rgiResourcesMethodSrvc_
        ) {
            $scope = $rootScope.$new();
            $route = _$route_;
            $location = _$location_;
            rgiDialogFactory = _rgiDialogFactory_;
            rgiNotifier = _rgiNotifier_;
            rgiResourcesMethodSrvc = _rgiResourcesMethodSrvc_;

            spies.resourcesQuery = sinon.spy(function(criteria, callback, errorHandler) {
                callback(RESOURCES);
                actualErrorHandler = errorHandler;
            });
            stubs.resourcesQuery = sinon.stub(rgiResourcesSrvc, 'query', spies.resourcesQuery);

            spies.httpResponseProcessorGetDefaultHandler = sinon.spy(function(errorMessage) {
                return errorMessage;
            });
            stubs.httpResponseProcessorGetDefaultHandler = sinon.stub(rgiHttpResponseProcessorSrvc, 'getDefaultHandler',
                spies.httpResponseProcessorGetDefaultHandler);
        }
    ));

    describe('FAQ', function() {
        beforeEach(inject(function ($controller) {
            setResourceType('faq');
            $controller('rgiResourcesAdminCtrl', {$scope: $scope});
        }));

        it('sets the resource type', function () {
            $scope.resource_type.should.be.equal('faq');
        });

        it('sets the title', function () {
            $scope.title.should.be.equal('Frequently Asked Questions');
        });

        it('process HTTP failures', function () {
            actualErrorHandler.should.be.equal('Load FAQ data failure');
        });
    });

    describe('Resource', function() {
        beforeEach(inject(function ($controller) {
            setResourceType('resource');
            $controller('rgiResourcesAdminCtrl', {$scope: $scope});
        }));

        it('sets the resource type', function () {
            $scope.resource_type.should.be.equal('resource');
        });

        it('sets the title', function () {
            $scope.title.should.be.equal('Other Resources');
        });

        it('process HTTP failures', function () {
            actualErrorHandler.should.be.equal('Load resource data failure');
        });

        it('gets the resources', function () {
            $scope.resources.should.be.equal(RESOURCES);
        });

        describe('ACTIONS', function() {
            var mocks = {};

            describe('#updateResource', function() {
                var FAILURE_REASON = 'FAILURE REASON', setUpdateResourceStub = function(callback) {
                    spies.resourcesMethodUpdateResource = sinon.spy(function() {
                        return {then: callback};
                    });
                    stubs.resourcesMethodUpdateResource = sinon.stub(rgiResourcesMethodSrvc, 'updateResource',
                        spies.resourcesMethodUpdateResource);
                };

                beforeEach(function() {
                    mocks.notifier = sinon.mock(rgiNotifier);
                });

                it('shows an error message if the resource head is not set', function() {
                    mocks.notifier.expects('error').withArgs('You must supply a title');
                    $scope.updateResource({});
                });

                it('shows an error message if the resource body is not set', function() {
                    mocks.notifier.expects('error').withArgs('You must supply content');
                    $scope.updateResource({head: 'head'});
                });

                it('shows an error message if the resource order is not set', function() {
                    mocks.notifier.expects('error').withArgs('You must supply the order you want this to appear');
                    $scope.updateResource({head: 'head', body: 'body'});
                });

                describe('request submission', function() {
                    describe('SUCCESS', function() {
                        beforeEach(function() {
                            setUpdateResourceStub(function(callback) {
                                callback();
                            });
                        });

                        it('shows a success notification', function() {
                            mocks.notifier.expects('notify').withArgs('Resource has been updated');
                        });

                        it('reloads the page', function() {
                            mocks.route = sinon.mock($route);
                            mocks.route.expects('reload');
                        });
                    });

                    it('shows the error reason if the request is failed', function() {
                        setUpdateResourceStub(function(callbackPositive, callbackNegative) {
                            callbackNegative(FAILURE_REASON);
                        });

                        mocks.notifier.expects('error').withArgs(FAILURE_REASON);
                    });

                    afterEach(function() {
                        var resource = {head: 'head', body: 'body', order: 'order'};
                        $scope.updateResource(resource);
                        spies.resourcesMethodUpdateResource.withArgs(resource).called.should.be.equal(true);
                    });
                });
            });

            describe('#showCreateResourceDialog', function() {
                it('opens a dialog', function() {
                    mocks.dialogFactory = sinon.mock(rgiDialogFactory);
                    mocks.dialogFactory.expects('createResource').withArgs($scope);
                    $scope.showCreateResourceDialog();
                });
            });

            describe('#showConfirmResourceDeletionDialog', function() {
                it('opens a dialog', function() {
                    mocks.dialogFactory = sinon.mock(rgiDialogFactory);
                    var resource = 'RESOURCE';
                    mocks.dialogFactory.expects('deleteResource').withArgs($scope, resource);
                    $scope.showConfirmResourceDeletionDialog(resource);
                });
            });

            afterEach(function() {
                Object.keys(mocks).forEach(function(mockName) {
                    mocks[mockName].restore();
                });
            });
        });
    });

    afterEach(function () {
        $location.$$path = locationPathBackup;

        Object.keys(stubs).forEach(function(stubName) {
           stubs[stubName].restore();
        });
    });
});
