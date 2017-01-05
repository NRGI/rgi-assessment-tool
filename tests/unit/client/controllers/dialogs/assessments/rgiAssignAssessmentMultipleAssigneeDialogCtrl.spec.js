'use strict';

describe('rgiAssignAssessmentMultipleAssigneeDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, $rootScope, $route, $q, rgiAssessmentSrvc, rgiAssessmentMethodSrvc, rgiHttpResponseProcessorSrvc,
        rgiNotifier, rgiUserSrvc, rgiUserAssessmentsSrvc;
    var callbacks = {}, spies = {}, stubs = {}, failureHandlers = {}, ASSESSMENT_ID = 'assessment id';
    var USER_TYPE = 'supervisor';
    var setAssessment = function(supervisorList) {
        $scope.assessment = {};
        $scope.assessment[USER_TYPE + '_ID'] = supervisorList;
    };

    beforeEach(inject(
        function (
            $controller,
            _$q_,
            _$rootScope_,
            _$route_,
            _rgiAssessmentSrvc_,
            _rgiAssessmentMethodSrvc_,
            _rgiHttpResponseProcessorSrvc_,
            _rgiNotifier_,
            _rgiUserSrvc_,
            _rgiUserAssessmentsSrvc_
        ) {
            $q = _$q_;
            $rootScope = _$rootScope_;
            $route = _$route_;
            rgiAssessmentSrvc = _rgiAssessmentSrvc_;
            rgiAssessmentMethodSrvc = _rgiAssessmentMethodSrvc_;
            rgiHttpResponseProcessorSrvc = _rgiHttpResponseProcessorSrvc_;
            rgiNotifier = _rgiNotifier_;
            rgiUserSrvc = _rgiUserSrvc_;
            rgiUserAssessmentsSrvc = _rgiUserAssessmentsSrvc_;

            stubs.httpResponseProcessorGetDefaultHandler = sinon.stub(rgiHttpResponseProcessorSrvc, 'getDefaultHandler',
                function(failureMessage) {return failureMessage;});

            spies.assessmentGet = sinon.spy(function(criteria, callback, failureHandler) {
                failureHandlers.assessmentGet = failureHandler;
                callbacks.assessmentGet = callback;
            });

            stubs.assessmentGet = sinon.stub(rgiAssessmentSrvc, 'get', spies.assessmentGet);

            $scope = $rootScope.$new();
            $scope.userType = USER_TYPE;
            $scope.$parent = {assessment_update_ID: ASSESSMENT_ID};
            $controller('rgiAssignAssessmentMultipleAssigneeDialogCtrl', {$scope: $scope});
        }
    ));

    it('loads assessment data', function() {
        spies.assessmentGet.withArgs({assessment_ID: ASSESSMENT_ID}).called.should.be.equal(true);
    });

    it('processes HTTP failures on getting assessment data', function() {
        failureHandlers.assessmentGet.should.be.equal('Load assessment data failure');
    });

    describe('GET ASSESSMENT CALLBACK', function() {
        var loadAssessment = function(supervisorList) {
            var assessment = {};
            assessment[USER_TYPE + '_ID'] = supervisorList;
            callbacks.assessmentGet(assessment);
        };

        beforeEach(function() {
            spies.userQuery = sinon.spy(function(criteria, callback, failureHandler) {
                failureHandlers.userQuery = failureHandler;
                callbacks.userQuery = callback;
            });

            stubs.userQuery = sinon.stub(rgiUserSrvc, 'query', spies.userQuery);
        });

        it('creates a user list with a dummy item if the assessment user list is empty', function() {
            loadAssessment([]);
            $scope.assessment[USER_TYPE + '_ID'].should.deep.equal([undefined]);
        });

        it('replaces user objects with user id in the user list if the assessment user list is not empty', function() {
            loadAssessment(['supervisor A', {_id: 'supervisor B'}]);
            $scope.assessment[USER_TYPE + '_ID'].should.deep.equal(['supervisor A', 'supervisor B']);
        });

        describe('#getFilteredAvailableUsers', function() {
            var USER = 'user';

            it('filters available users only', function() {
                loadAssessment(['not available user A', USER, 'not available user C']);
                callbacks.userQuery([{_id: 'available user 1'}, {_id: 'available user 2'}, {_id: USER}]);
                $scope.getFilteredAvailableUsers().should.deep.equal([
                    {_id: 'available user 1'},
                    {_id: 'available user 2'}
                ]);
            });

            it('filters available users and the passed user', function() {
                loadAssessment(['not available user A', USER, 'not available user C']);
                callbacks.userQuery([{_id: 'available user 1'}, {_id: 'available user 2'}, {_id: USER}]);
                $scope.getFilteredAvailableUsers(USER).should.deep.equal([
                    {_id: 'available user 1'},
                    {_id: 'available user 2'},
                    {_id: USER}
                ]);
            });
        });

        describe('#isNewAssigneeAvailable', function() {
            it('returns `true` if the available users list is bigger than the assigned users list', function() {
                loadAssessment(['user A']);
                callbacks.userQuery(['user 1', 'user 2']);
                $scope.isNewAssigneeAvailable().should.be.equal(true);
            });

            it('returns `false` if the available users list is smaller than the assigned users list', function() {
                loadAssessment(['user A', 'user B']);
                callbacks.userQuery(['user 1']);
                $scope.isNewAssigneeAvailable().should.be.equal(false);
            });
        });

        describe('#isAssigneeListEmpty', function() {
            it('returns `true` if the assigned users collection is empty', function() {
                loadAssessment([]);
                $scope.isAssigneeListEmpty().should.be.equal(true);
            });

            it('returns `false` if the assigned users collection is not empty', function() {
                loadAssessment(['user']);
                $scope.isAssigneeListEmpty().should.be.equal(false);
            });
        });

        describe('#isAssigneeListModified', function() {
            it('returns `true` if a user is removed from the assigned user list', function() {
                loadAssessment(['user 1', 'user 2']);
                setAssessment(['user 1']);
                $scope.isAssigneeListModified().should.be.equal(true);
            });

            it('returns `true` if a user is added to the assigned user list', function() {
                loadAssessment(['user 1', 'user 2']);
                setAssessment(['user 1', 'user 2', 'user 3']);
                $scope.isAssigneeListModified().should.be.equal(true);
            });

            it('returns `false` if the assigned user list is not modified', function() {
                loadAssessment(['user 1', 'user 2']);
                $scope.isAssigneeListModified().should.be.equal(false);
            });
        });

        describe('#saveAssigneeList', function() {
            var ASSESSMENT_METHOD_UPDATE_ASSESSMENT_PROMISE = 'assessment method update assessment promise';

            beforeEach(function() {
                spies.assessmentMethodUpdateAssessment = sinon.spy(function() {
                    return ASSESSMENT_METHOD_UPDATE_ASSESSMENT_PROMISE;
                });

                stubs.assessmentMethodUpdateAssessment = sinon.stub(rgiAssessmentMethodSrvc, 'updateAssessment',
                    spies.assessmentMethodUpdateAssessment);

                spies.userAssessmentsRemove = sinon.spy(function(userData, assessmentData) {
                    return 'remove ' + userData._id + ' from ' + assessmentData.assessment_ID;
                });

                stubs.assessmentMethodUpdateAssessment = sinon.stub(rgiUserAssessmentsSrvc, 'remove',
                    spies.userAssessmentsRemove);

                spies.$qAll = sinon.spy(function() {
                    return {
                        then: function(callbackSuccess, callbackFailure) {
                            callbacks.$qAllSuccess = callbackSuccess;
                            callbacks.$qAllFailure = callbackFailure;
                        }
                    }
                });

                stubs.$qAll = sinon.stub($q, 'all', spies.$qAll);

                loadAssessment([
                    {_id: 'kept user', assessments: true},
                    {_id: 'removed user', assessments: true},
                    {_id: 'not available user', assessments: true}
                ]);

                callbacks.userQuery([{_id: 'kept user', assessments: true}, {_id: 'removed user', assessments: true}]);
                setAssessment(['kept user']);
                $scope.assessment.assessment_ID = ASSESSMENT_ID;
                $scope.saveAssigneeList();
            });

            it('submits requests to unassign users from the assessment andupdate the assessment data', function() {
                spies.$qAll.withArgs([
                    'assessment method update assessment promise',
                    'remove removed user from ' + ASSESSMENT_ID
                ]).called.should.be.equal(true);
            });

            describe('CALLBACKS', function() {
                var mocks = {};

                beforeEach(function() {
                    mocks.notifier = sinon.mock(rgiNotifier);
                });

                it('shows the failure reason in case of a failure if the reason is provided', function() {
                    var REASON = 'reason';
                    mocks.notifier.expects('error').withArgs(REASON);
                    callbacks.$qAllFailure(REASON);
                });

                describe('RELOAD STATE', function() {
                    beforeEach(function() {
                        $scope.closeThisDialog = sinon.spy();
                        mocks.$route = sinon.mock($route);
                        mocks.$route.expects('reload');
                    });

                    it('shows the default failure message in case of a failure if the no failure is provided', function() {
                        mocks.notifier.expects('error').withArgs('Validation error');
                        callbacks.$qAllFailure();
                    });

                    it('shows a success message in a success case', function() {
                        mocks.notifier.expects('notify').withArgs('Assessment assigned!');
                        callbacks.$qAllSuccess();
                    });

                    afterEach(function() {
                        $scope.closeThisDialog.called.should.be.equal(true);
                    });
                });

                afterEach(function() {
                    Object.keys(mocks).forEach(function(mockName) {
                        mocks[mockName].verify();
                        mocks[mockName].restore();
                    });
                });
            });
        });

        afterEach(function() {
            spies.userQuery.withArgs({role: USER_TYPE}).called.should.be.equal(true);
            failureHandlers.userQuery.should.be.equal('Load user data failure');
        });
    });

    describe('METHODS', function() {
        describe('#addAssignee', function() {
            it('adds a dummy item to the user list', function() {
                setAssessment(['supervisor A']);
                $scope.addAssignee();
                $scope.assessment[USER_TYPE + '_ID'].should.deep.equal(['supervisor A', undefined]);
            });
        });

        describe('#removeAssignee', function() {
            it('remove an item by index from the user list', function() {
                setAssessment(['supervisor A', 'supervisor B', 'supervisor C']);
                $scope.removeAssignee(1);
                $scope.assessment[USER_TYPE + '_ID'].should.deep.equal(['supervisor A', 'supervisor C']);
            });
        });
    });

    afterEach(function() {
        Object.keys(stubs).forEach(function(stubName) {
            stubs[stubName].restore();
        });
    });
});
