'use strict';

describe('rgiAssignAssessmentDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, rgiAssessmentSrvc, rgiHttpResponseProcessorSrvc, rgiUserSrvc, rgiNotifier;
    var callbacks = {}, spies = {}, stubs = {}, failureHandlers = {}, ASSESSMENT_ID = 'assessment id';

    beforeEach(inject(
        function (
            $rootScope,
            $controller,
            _rgiAssessmentSrvc_,
            _rgiHttpResponseProcessorSrvc_,
            _rgiUserSrvc_,
            _rgiNotifier_
        ) {
            rgiAssessmentSrvc = _rgiAssessmentSrvc_;
            rgiHttpResponseProcessorSrvc = _rgiHttpResponseProcessorSrvc_;
            rgiUserSrvc = _rgiUserSrvc_;
            rgiNotifier = _rgiNotifier_;

            stubs.httpResponseProcessorGetDefaultHandler = sinon.stub(rgiHttpResponseProcessorSrvc, 'getDefaultHandler',
                function(failureMessage) {return failureMessage;});

            spies.userQuery = sinon.spy(function(callback, failureHandler) {
                callbacks.userQuery = callback;
                failureHandlers.userQuery = failureHandler;
            });

            stubs.userQuery = sinon.stub(rgiUserSrvc, 'query', spies.userQuery);

            spies.assessmentGet = sinon.spy(function(criteria, callback, failureHandler) {
                failureHandlers.assessmentGet = failureHandler;
                callbacks.assessmentGet = callback;
            });

            stubs.assessmentGet = sinon.stub(rgiAssessmentSrvc, 'get', spies.assessmentGet);

            $scope = $rootScope.$new();
            $scope.$parent = {assessment_update_ID: ASSESSMENT_ID};
            $controller('rgiAssignAssessmentDialogCtrl', {$scope: $scope});
        }
    ));

    it('sets available user roles', function() {
        $scope.assessmentRoles.should.deep.equal(['researcher', 'reviewer']);
    });

    it('initializes the assessment assigned users structure', function() {
        $scope.availableUsers.should.deep.equal({researcher: [], reviewer:[]});
    });

    it('loads user data', function() {
        spies.userQuery.called.should.be.equal(true);
    });

    it('sets the assigned users', function() {
        callbacks.userQuery([{role: 'researcher'}, {role: 'reviewer'}, {role: 'supervisor'}, {role: 'researcher'}]);
        $scope.availableUsers.researcher.length.should.be.equal(2);
        $scope.availableUsers.reviewer.length.should.be.equal(1);
        should.not.exist($scope.availableUsers.supervisor);
    });

    it('processes HTTP failures on getting user data', function() {
        failureHandlers.userQuery.should.be.equal('Load user data failure');
    });

    it('loads assessment data', function() {
        spies.assessmentGet.withArgs({assessment_ID: ASSESSMENT_ID}).called.should.be.equal(true);
    });

    it('assigns assessment users', function() {
        callbacks.assessmentGet({researcher_ID: 'researcher', reviewer_ID: {_id: 'reviewer'}});
        $scope.assessment.should.deep.equal({researcher_ID: 'researcher', reviewer_ID: 'reviewer'});
    });

    it('processes HTTP failures on getting assessment data', function() {
        failureHandlers.assessmentGet.should.be.equal('Load assessment data failure');
    });

    describe('#isAnyAssessmentRoleChanged', function () {
        var researcher_id = 'researcher', reviewer_id = 'reviewer';

        beforeEach(function() {
            callbacks.assessmentGet({researcher_ID: researcher_id, reviewer_ID: reviewer_id});
        });

        it('returns `false` if the assessment assignees are not changed', function() {
            $scope.assessment = {researcher_ID: researcher_id, reviewer_ID: reviewer_id};
            $scope.isAnyAssessmentRoleChanged().should.be.equal(false);
        });

        it('returns `true` if the assessment researcher is changed', function() {
            $scope.assessment = {researcher_ID: 'another researcher', reviewer_ID: reviewer_id};
            $scope.isAnyAssessmentRoleChanged().should.be.equal(true);
        });

        it('returns `true` if the assessment reviewer is changed', function() {
            $scope.assessment = {researcher_ID: researcher_id, reviewer_ID: 'another reviewer'};
            $scope.isAnyAssessmentRoleChanged().should.be.equal(true);
        });
    });

    describe('#reassignAssessment', function() {
        var notifierMock;

        beforeEach(function() {
            notifierMock = sinon.mock(rgiNotifier);
        });

        it('shows an error message if no researcher assigned', function() {
            notifierMock.expects('error').withArgs('No researcher data!');
            $scope.assessment = {researcher_ID: false};
            $scope.reassignAssessment();
        });

        afterEach(function() {
            notifierMock.verify();
            notifierMock.restore();
        });
    });

    afterEach(function() {
        Object.keys(stubs).forEach(function(stubName) {
            stubs[stubName].restore();
        });
    });
});
