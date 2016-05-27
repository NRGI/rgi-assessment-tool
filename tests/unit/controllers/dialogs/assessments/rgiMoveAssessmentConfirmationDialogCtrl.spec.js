'use strict';

describe('rgiMoveAssessmentConfirmationDialogCtrl', function () {
    beforeEach(module('app'));
    var $scope, $location, $route,
        rgiAnswerSrvc, rgiAnswerMethodSrvc, rgiAssessmentMethodSrvc, rgiHttpResponseProcessorSrvc, rgiNotifier,
        RESEARCHER = 'RESEARCHER', REVIEWER = 'REVIEWER',
        initializeController = function(action) {
            beforeEach(inject(
                function (
                    $controller,
                    $rootScope,
                    _$location_,
                    _$route_,
                    _rgiAnswerSrvc_,
                    _rgiAnswerMethodSrvc_,
                    _rgiAssessmentMethodSrvc_,
                    _rgiHttpResponseProcessorSrvc_,
                    _rgiNotifier_
                ) {
                    $scope = $rootScope.$new();
                    $scope.$parent = {action: action, assessment: {researcher_ID: RESEARCHER, reviewer_ID: REVIEWER}};

                    $location = _$location_;
                    $route = _$route_;
                    rgiAnswerSrvc = _rgiAnswerSrvc_;
                    rgiAnswerMethodSrvc = _rgiAnswerMethodSrvc_;
                    rgiAssessmentMethodSrvc = _rgiAssessmentMethodSrvc_;
                    rgiHttpResponseProcessorSrvc = _rgiHttpResponseProcessorSrvc_;
                    rgiNotifier = _rgiNotifier_;

                    $controller('rgiMoveAssessmentConfirmationDialogCtrl', {$scope: $scope});
                }
            ));
        },
        checkActionText = function(action, text) {
            describe('`' + action + '` action', function () {
                initializeController(action);

                it('sets the action text', function () {
                    $scope.action.should.equal(action);
                });

                it('sets the action text', function () {
                    should.equal($scope.action_text, text);
                });
            });
        };

    checkActionText('researcher_started', 'send back to researcher to continue assessment');
    checkActionText('review_researcher', 'send to researcher for review');
    checkActionText('review_reviewer', 'send to reviewer for review');
    checkActionText('assigned_researcher', 'reassign to researcher');
    checkActionText('assigned_reviewer', 'reassign to reviewer');
    checkActionText('reviewer_trial', 'reassign to trial');
    checkActionText('approved', 'approve assessment');
    checkActionText('internal_review', 'internal review');
    checkActionText('external_review', 'external review');
    checkActionText('final_approval', 'final approval');
    checkActionText('NOT_SUPPORTED', undefined);

    it('sets current user data', inject(function ($controller, $rootScope, rgiIdentitySrvc) {
        var CURRENT_USER = {_id: 'CURRENT USER'};
        rgiIdentitySrvc.currentUser = CURRENT_USER;

        $scope = $rootScope.$new();
        $scope.$parent = {action: 'action'};

        $controller('rgiMoveAssessmentConfirmationDialogCtrl', {$scope: $scope});
        $scope.current_user.should.deep.equal(CURRENT_USER);
    }));

    describe('#moveAssessment', function() {
        var mocks = {},
            moveAssessment = function(action) {
                $scope.action = action;
                $scope.moveAssessment();
            };

        initializeController('');

        beforeEach(function() {
            mocks.notifier = sinon.mock(rgiNotifier);
        });

        describe('NOT PROCESSED ACTIONS', function() {
            var checkNotProcessedAction = function(description, message, action) {
                it(description, function() {
                    mocks.notifier.expects('error').withArgs(message);
                    moveAssessment(action);
                });
            };

            checkNotProcessedAction('shows an error message if a not supported action is applied',
                '$scope.action case does not have a route!', 'NOT SUPPORTED');

            checkNotProcessedAction('shows an error message if `' + 'internal_review' + '` action is applied',
                'Function "' + 'internal_review' + '" does not exist yet!', 'internal_review');

            checkNotProcessedAction('shows an error message if `' + 'external_review' + '` action is applied',
                'Function "' + 'internal_review' + '" does not exist yet!', 'external_review');

            checkNotProcessedAction('shows an error message if `' + 'final_approval' + '` action is applied',
                'Function "' + 'internal_review' + '" does not exist yet!', 'final_approval');
        });

        describe('SUPPORTED ACTIONS', function() {
            var spies = {}, stubs = {},
                setUpdateAssessmentCallback = function(callback) {
                    spies.assessmentMethodUpdateAssessment = sinon.spy(function() {
                        return {then: callback};
                    });

                    stubs.assessmentMethodUpdateAssessment = sinon.stub(rgiAssessmentMethodSrvc, 'updateAssessment',
                        spies.assessmentMethodUpdateAssessment);
                };

            describe('REJECTED CASE', function() {
                var checkRejected = function(status, reason, doExtra) {
                    it('shows an error message', function() {
                        setUpdateAssessmentCallback(function(callbackPositive, callbackNegative) {
                            callbackNegative(reason);
                        });

                        if(doExtra !== undefined) {
                            doExtra();
                        }

                        mocks.notifier.expects('error').withArgs(reason);
                        moveAssessment(status);
                    });
                };

                [
                    'researcher_trial',
                    'trial_continue',
                    'review_researcher',
                    'review_reviewer',
                    'assigned_researcher',
                    'assigned_reviewer'
                ].forEach(function(status) {
                    checkRejected(status, status + ' REASON');
                });

                checkRejected('approved', 'REJECT APPROVAL REASON', function() {
                    $scope.current_user = {_id: 'CURRENT_USER'};
                });

                it('shows an error message', function() {
                    var reason = 'REASON';

                    setUpdateAssessmentCallback(function() {
                        return {then: function(callbackPositive, callbackNegative) {
                            callbackNegative(reason);
                        }};
                    });

                    stubs.answerQuery = sinon.stub(rgiAnswerSrvc, 'query', function(criteria, callback) {
                        callback([]);
                    });

                    mocks.notifier.expects('error').withArgs(reason);
                    moveAssessment('reviewer_trial');
                });
            });

            describe('RESOLVED CASE', function() {
                var callbackPositive = function(callback) {
                        callback();
                    },
                    setUpCheck = function(uri, message, routeChanged) {
                        $scope.closeThisDialog = sinon.spy();
                        mocks.notifier.expects('notify').withArgs(message);

                        mocks.$location = sinon.mock($location);
                        mocks.$location.expects('path').withArgs(uri);

                        if(routeChanged) {
                            mocks.$route = sinon.mock($route);
                            mocks.$route.expects('reload');
                        }
                    },
                    checkPositive = function(status, message, routeChanged, extraFields) {
                        describe(status, function() {
                            beforeEach(function() {
                                setUpdateAssessmentCallback(callbackPositive);
                                setUpCheck('/admin/assessment-admin', message, routeChanged);
                                moveAssessment(status);
                            });

                            it('submits assessment data', function() {
                                var assessment = {
                                    mail: true,
                                    researcher_ID: RESEARCHER,
                                    reviewer_ID: REVIEWER,
                                    status: status
                                };

                                if(extraFields !== undefined) {
                                    angular.extend(assessment, extraFields);
                                }

                                spies.assessmentMethodUpdateAssessment.withArgs(assessment);
                            });

                            it('closes the dialog', function() {
                                $scope.closeThisDialog.called.should.be.equal(true);
                            });
                        });
                    };

                var MOVED_FORWARD_MESSAGE = 'Assessment moved forward!';
                // dfd reject for reviewer_trial
                checkPositive('researcher_trial', 'Assessment returned for review!', true);
                checkPositive('trial_continue', 'Assessment returned!', true);
                checkPositive('review_researcher', MOVED_FORWARD_MESSAGE, true);
                checkPositive('review_reviewer', MOVED_FORWARD_MESSAGE, true);
                checkPositive('assigned_researcher', MOVED_FORWARD_MESSAGE, true, {edit_control: RESEARCHER});
                checkPositive('assigned_reviewer', MOVED_FORWARD_MESSAGE, true, {edit_control: REVIEWER});

                describe('approved', function() {
                    var CURRENT_USER = 'CURRENT USER';

                    beforeEach(function() {
                        $scope.current_user = {_id: CURRENT_USER};
                    });

                    checkPositive('approved', 'Assessment approved!', false, {edit_control: CURRENT_USER});
                });

                describe('reviewer_trial', function() {
                    var errorProcessor, UPDATE_ANSWERS_RESULT = 'UPDATE ANSWERS RESULT', ANSWERS;

                    beforeEach(function() {
                        ANSWERS = [{status: 'unresolved'}, {status: 'resolved'}];

                        spies.answerQuery = sinon.spy(function(criteria, callbackSuccess, callbackError) {
                            callbackSuccess(ANSWERS);
                            errorProcessor = callbackError;
                        });

                        spies.answerMethodUpdateAnswerSet = sinon.spy(function() {
                            return UPDATE_ANSWERS_RESULT;
                        });

                        spies.getAnswerSet = function() {
                            return {then: function(callback) {
                                callback();
                            }};
                        };

                        stubs.httpResponseProcessorGetDefaultHandler = sinon.stub(rgiHttpResponseProcessorSrvc,
                            'getDefaultHandler', function(errorMessage) {return errorMessage;});

                        stubs.answerQuery = sinon.stub(rgiAnswerSrvc, 'query', spies.answerQuery);
                        stubs.answerMethodUpdateAnswerSet = sinon.stub(rgiAnswerMethodSrvc, 'updateAnswerSet',
                            spies.answerMethodUpdateAnswerSet);
                        setUpdateAssessmentCallback(spies.getAnswerSet);
                    });

                    describe('FIRST PASS', function() {
                        beforeEach(function() {
                            $scope.$parent.assessment.first_pass = true;
                            setUpCheck('/admin/assessment-admin', 'Assessment moved forward!', true, {first_pass: false});
                            moveAssessment('reviewer_trial');
                        });

                        it('changes `unresolved` answer status to `assigned`', function() {
                            spies.answerMethodUpdateAnswerSet.withArgs([{status: 'unresolved'}, {status: 'assigned'}])
                                .called.should.be.equal(true);
                        });
                    });

                    describe('NOT FIRST PASS', function() {
                        beforeEach(function() {
                            setUpCheck('/admin/assessment-admin', 'Assessment moved forward!', true);
                            moveAssessment('reviewer_trial');
                        });

                        it('does not change answer status', function() {
                            spies.answerMethodUpdateAnswerSet.withArgs(ANSWERS).called.should.be.equal(true);
                        });
                    });

                    afterEach(function() {
                        errorProcessor.should.be.equal('Load answer data failure');
                    });
                });

                afterEach(function() {
                    Object.keys(stubs).forEach(function(stubName) {
                        stubs[stubName].restore();
                    });
                });
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
