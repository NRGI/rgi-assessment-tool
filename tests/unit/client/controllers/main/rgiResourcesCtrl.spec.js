'use strict';

describe('rgiResourcesCtrl', function () {
    beforeEach(module('app'));

    var $scope, $location, actualErrorHandler, locationPathBackup, RESOURCES = 'RESOURCES', spies = {}, stubs = {},
        initializeController = function(resourceType) {
            beforeEach(inject(
                function ($rootScope, $controller, _$location_, rgiHttpResponseProcessorSrvc, rgiResourcesSrvc) {
                    $location = _$location_;
                    locationPathBackup = $location.$$path;
                    $location.$$path = '/' + resourceType;

                    spies.resourcesQuery = sinon.spy(function(criteria, callback, errorHandler) {
                        actualErrorHandler = errorHandler;
                        callback(RESOURCES);
                    });
                    stubs.resourcesQuery = sinon.stub(rgiResourcesSrvc, 'query', spies.resourcesQuery);

                    stubs.httpResponseProcessorGetDefaultHandler = sinon.stub(rgiHttpResponseProcessorSrvc, 'getDefaultHandler',
                        function(errorMessage) {return errorMessage;});

                    $scope = $rootScope.$new();
                    $controller('rgiResourcesCtrl', {$scope: $scope});
                }
            ));
        },
        checkTypeSpecificProperties = function(resourceType, title, errorHandler) {
            it('sets the resource type', function () {
                $scope.resource_type.should.be.equal(resourceType);
            });

            it('sets the title', function () {
                $scope.title.should.be.equal(title);
            });

            it('processes HTTP failures', function () {
                actualErrorHandler.should.be.equal(errorHandler);
            });

            it('requires resources', function () {
                spies.resourcesQuery.withArgs({type: resourceType}).called.should.be.equal(true);
            });
        };

    describe('FAQ', function() {
        initializeController('faq');
        checkTypeSpecificProperties('faq', 'Frequently Asked Questions', 'Load FAQ data failure');
    });

    describe('Resources', function() {
        initializeController('resource');
        checkTypeSpecificProperties('resource', 'Other Resources', 'Load resource data failure');

        it('sets the resources', function () {
            $scope.resources.should.be.equal(RESOURCES);
        });
    });

    afterEach(function () {
        Object.keys(stubs).forEach(function(stubName) {
            stubs[stubName].restore();
        });

        $location.$$path = locationPathBackup;
    });
});
