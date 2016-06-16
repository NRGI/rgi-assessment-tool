'use strict';

describe('rgiIntervieweeAdminCtrl', function () {
    beforeEach(module('app'));

    var $scope, actualErrorHandler, INTERVIEWEES = 'INTERVIEWEES', spies = {}, stubs = {};

    beforeEach(inject(
        function ($rootScope, $controller, rgiIntervieweeSrvc, rgiHttpResponseProcessorSrvc) {
            stubs.httpResponseProcessorGetDefaultHandler = sinon.stub(rgiHttpResponseProcessorSrvc, 'getDefaultHandler',
                function(errorMessage) {return errorMessage;});

            spies.intervieweeQuery = sinon.spy(function(criteria, callback, errorHandler) {
                callback(INTERVIEWEES);
                actualErrorHandler = errorHandler;
            });

            stubs.intervieweeQuery = sinon.stub(rgiIntervieweeSrvc, 'query', spies.intervieweeQuery);
            $scope = $rootScope.$new();
            $controller('rgiIntervieweeAdminCtrl', {$scope: $scope});
        }
    ));

    it('sets the sorting options', function() {
        $scope.sort_options.should.deep.equal([
            {value: 'lastName', text: 'Sort by last name'},
            {value: 'firstName', text: 'Sort by first name'},
            {value: 'role', text: 'Sort by interviewee role'},
            {value: 'title', text: 'Sort by interviewee title'},
            {value: 'organization', text: 'Sort by interviewee organization'},
            {value: 'assessments', text: 'Sort by attached assessments'}
        ]);
    });

    it('sets the sorting order', function() {
        $scope.sort_order.should.be.equal('lastName');
    });

    it('requires interviewee list', function() {
        spies.intervieweeQuery.withArgs({}).called.should.be.equal(true);
    });

    it('sets the interviewee list', function() {
        $scope.interviewees.should.be.equal(INTERVIEWEES);
    });

    it('processes HTTP failures', function() {
        actualErrorHandler.should.be.equal('Load interviewee data failure');
    });
});
