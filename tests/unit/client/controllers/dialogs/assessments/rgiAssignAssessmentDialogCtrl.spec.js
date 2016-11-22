'use strict';

describe('rgiAssignAssessmentDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, $q, $rootScope, rgiNotifier, rgiUserMethodSrvc,
        rgiAssessmentSrvc, rgiAssessmentMethodSrvc, rgiHttpResponseProcessorSrvc, rgiUserSrvc, rgiUserAssessmentsSrvc;
    var callbacks = {}, mocks = {}, spies = {}, stubs = {}, failureHandlers = {}, ASSESSMENT_ID = 'assessment id';

    beforeEach(inject(
        function (
            $controller,
            _$q_,
            _$rootScope_,
            _rgiAssessmentSrvc_,
            _rgiAssessmentMethodSrvc_,
            _rgiHttpResponseProcessorSrvc_,
            _rgiNotifier_,
            _rgiUserSrvc_,
            _rgiUserAssessmentsSrvc_,
            _rgiUserMethodSrvc_
        ) {
            $q = _$q_;
            $rootScope = _$rootScope_;
            rgiAssessmentSrvc = _rgiAssessmentSrvc_;
            rgiAssessmentMethodSrvc = _rgiAssessmentMethodSrvc_;
            rgiHttpResponseProcessorSrvc = _rgiHttpResponseProcessorSrvc_;
            rgiNotifier = _rgiNotifier_;
            rgiUserSrvc = _rgiUserSrvc_;
            rgiUserAssessmentsSrvc = _rgiUserAssessmentsSrvc_;
            rgiUserMethodSrvc = _rgiUserMethodSrvc_;

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

    var getCallbackCheckInitialization = function(reassignAssessment) {
        return function() {
            spies.assessmentMethodUpdateAssessment = sinon.spy(function() {
                return {then: function(callbackSuccess, callbackFailure) {
                    callbacks.assessmentMethodUpdateAssessmentSuccess = callbackSuccess;
                    callbacks.assessmentMethodUpdateAssessmentFailure = callbackFailure;

                    return {finally: function(callback) {
                        callback();
                    }};
                }};
            });

            stubs.assessmentMethodUpdateAssessment = sinon.stub(rgiAssessmentMethodSrvc, 'updateAssessment',
                spies.assessmentMethodUpdateAssessment);

            $scope.closeThisDialog = sinon.spy();

            if(reassignAssessment) {
                $scope.reassignAssessment();
            }

            callbacks.$qAll();
        };
    };

    var checkCallback = function(message) {
        it('submits a request to update the assessment data', function() {
            spies.assessmentMethodUpdateAssessment.withArgs($scope.assessment).called.should.be.equal(true);
        });

        it('closes the dialog', function() {
            $scope.closeThisDialog.called.should.be.equal(true);
        });

        describe('RESPONSES', function() {
            describe('FAILURE RESPONSE', function() {
                it('shows an error message', function() {
                    var ERROR_REASON = 'error reason';
                    mocks.notifier.expects('error').withArgs(ERROR_REASON);
                    callbacks.assessmentMethodUpdateAssessmentFailure(ERROR_REASON);
                });
            });

            describe('SUCCESS CASE', function() {
                it('shows a notification message', function() {
                    mocks.notifier.expects('notify').withArgs(message);
                });

                it('sends a root scope message', function() {
                    mocks.rootScope = sinon.mock($rootScope);
                    mocks.rootScope.expects('$broadcast').withArgs('REFRESH_ASSESSMENT_LIST');
                });

                afterEach(function() {
                    callbacks.assessmentMethodUpdateAssessmentSuccess();
                });
            });
        });
    };

    describe('#assignAssessment', function() {
        beforeEach(function() {
            mocks.notifier = sinon.mock(rgiNotifier);
        });

        it('shows an error message if no researcher assigned', function() {
            mocks.notifier.expects('error').withArgs('You must select a researcher!');
            $scope.assessment = {researcher_ID: false};
            $scope.assignAssessment();
        });

        describe('RESEARCHER SELECTED CASE', function() {
            var RESEARCHER_ID = 'researcher id', COUNTRY = 'KGZ', YEAR = 2016, VERSION = 'MI';

            beforeEach(function() {
                $scope.assessment = {
                    researcher_ID: RESEARCHER_ID,
                    country: COUNTRY,
                    year: YEAR,
                    version: VERSION
                };

                $scope.availableUsers.researcher = [
                    {
                        role: 'researcher',
                        _id: RESEARCHER_ID,
                        assessments: []
                    }
                ];

                spies.$qAll = sinon.spy(function() {
                    return {then: function(callback, failureHandler) {
                        callbacks.$qAll = callback;
                        failureHandlers.assignAssessment = failureHandler;
                    }};
                });

                spies.userMethodUpdateUser = sinon.spy(function(user) {
                    return {$promise: {action: 'update', user: user._id, assessments: user.assessments}};
                });

                stubs.$qAll = sinon.stub($q, 'all', spies.$qAll);
                stubs.userMethodUpdateUser = sinon.stub(rgiUserMethodSrvc, 'updateUser', spies.userMethodUpdateUser);
            });

            describe('RESEARCHER & REVIEWER SELECTED CASE', function() {
                var REVIEWER_ID = 'reviewer id';

                beforeEach(function() {
                    $scope.availableUsers.reviewer = [
                        {
                            role: 'reviewer',
                            _id: REVIEWER_ID,
                            assessments: []
                        }
                    ];

                    $scope.assessment.reviewer_ID = REVIEWER_ID;
                    $scope.assignAssessment();
                });

                it('sends a request to update the assessment data', function() {
                    var assessment = {assessment_ID: ASSESSMENT_ID, country_name: COUNTRY, year: YEAR, version: VERSION};

                    spies.$qAll.withArgs([
                        {action: 'update', user: RESEARCHER_ID, assessments: [assessment]},
                        {action: 'update', user: REVIEWER_ID, assessments: [assessment]}
                    ]).called.should.be.equal(true);
                });
            });

            describe('ONLY RESEARCHER SELECTED CASE', function() {
                beforeEach(function() {
                    $scope.assignAssessment();
                });

                it('sets the assessment `mail` flag', function() {
                    $scope.assessment.mail.should.be.equal(true);
                });

                it('sets the assessment status to `researcher_trial`', function() {
                    $scope.assessment.status.should.be.equal('researcher_trial');
                });

                it('assign the assessment edit control to the researcher', function() {
                    $scope.assessment.edit_control.should.be.equal(RESEARCHER_ID);
                });

                it('sends a request to update the assessment data', function() {
                    spies.$qAll.withArgs([
                        {
                            action: 'update',
                            user: RESEARCHER_ID,
                            assessments: [
                                {assessment_ID: ASSESSMENT_ID, country_name: COUNTRY, year: YEAR, version: VERSION}
                            ]
                        }
                    ]).called.should.be.equal(true);
                });

                it('process HTTP failures on assessment data saving', function() {
                    failureHandlers.assignAssessment.should.be.equal('Save user data failure');
                });

                describe('CALLBACK', function() {
                    beforeEach(getCallbackCheckInitialization(false));
                    checkCallback('Assessment assigned!');
                });
            });
        });
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
        beforeEach(function() {
            mocks.notifier = sinon.mock(rgiNotifier);
        });

        it('shows an error message if no researcher assigned', function() {
            mocks.notifier.expects('error').withArgs('You must select a researcher!');
            $scope.assessment = {researcher_ID: false};
            $scope.reassignAssessment();
        });

        describe('RESEARCHER SELECTED CASE', function() {
            beforeEach(function() {
                spies.$qAll = sinon.spy(function() {
                    return {then: function(callback) {
                        callbacks.$qAll = callback;
                    }};
                });

                stubs.$qAll = sinon.stub($q, 'all', spies.$qAll);

                spies.userAssessmentsAdd = sinon.spy(function(assignee, assessment) {
                    return {action: 'add', user: assignee._id, assessment: assessment._id};
                });

                stubs.userAssessmentsAdd = sinon.stub(rgiUserAssessmentsSrvc, 'add', spies.userAssessmentsAdd);

                spies.userAssessmentsRemove = sinon.spy(function(assignee, assessment) {
                    return {action: 'remove', user: assignee._id, assessment: assessment._id};
                });

                stubs.userAssessmentsRemove = sinon.stub(rgiUserAssessmentsSrvc, 'remove', spies.userAssessmentsRemove);
            });

            describe('REVIEWER CHANGED CASE', function() {
                var RESEARCHER_ID = 'researcher id', REVIEWER_ID = 'reviewer id',
                    ANOTHER_REVIEWER_ID = 'another reviewer', ASSESSMENT_ID = 'assessment id';

                beforeEach(function() {
                    callbacks.assessmentGet({researcher_ID: RESEARCHER_ID, reviewer_ID: REVIEWER_ID, _id: ASSESSMENT_ID});
                    $scope.assessment.reviewer_ID = ANOTHER_REVIEWER_ID;
                    $scope.availableUsers.reviewer = [
                        {
                            role: 'reviewer',
                            _id: REVIEWER_ID
                        },
                        {
                            role: 'reviewer',
                            _id: ANOTHER_REVIEWER_ID,
                            assessments: []
                        }
                    ];
                });

                it('assigns the assessment to the new reviewer', function() {
                    $scope.reassignAssessment();

                    spies.$qAll.withArgs([
                        {action: 'add', user: ANOTHER_REVIEWER_ID, assessment: $scope.assessment._id}
                    ]).called.should.be.equal(true);
                });

                it('unlinks the assessment from the old reviewer', function() {
                    $scope.availableUsers.reviewer[0].assessments = [ASSESSMENT_ID];
                    $scope.reassignAssessment();

                    spies.$qAll.withArgs([
                        {action: 'remove', user: REVIEWER_ID, assessment: $scope.assessment._id},
                        {action: 'add', user: ANOTHER_REVIEWER_ID, assessment: $scope.assessment._id}
                    ]).called.should.be.equal(true);
                });

                it('assigns `edit control` flag to the new assignee if it was assigned to the old one', function() {
                    $scope.assessment.edit_control = REVIEWER_ID;
                    $scope.reassignAssessment();
                    $scope.assessment.edit_control.should.be.equal(ANOTHER_REVIEWER_ID);
                });

                describe('CALLBACK', function() {
                    beforeEach(getCallbackCheckInitialization(true));
                    checkCallback('Assessment reassigned!');
                });
            });
        });
    });

    afterEach(function() {
        Object.keys(stubs).forEach(function(stubName) {
            stubs[stubName].restore();
        });

        Object.keys(mocks).forEach(function(mockName) {
            mocks[mockName].verify();
            mocks[mockName].restore();
        });
    });
});
