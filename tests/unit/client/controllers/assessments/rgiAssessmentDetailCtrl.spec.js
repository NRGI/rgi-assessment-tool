'use strict';

describe('rgiAssessmentDetailCtrl', function () {
    beforeEach(module('app'));

    var $scope, $routeParams,
        rgiAnswerSrvc, rgiAnswerFilterSrvc, rgiAssessmentSrvc, rgiAssessmentStatisticsGuideSrvc, rgiDialogFactory,
        rgiHttpResponseProcessorSrvc, rgiIdentitySrvc, rgiNotifier, rgiPreceptGuideSrvc, rgiQuestionSetSrvc,
        ROLE = 'RESEARCHER', IS_SUPERVISOR = 'is supervisor', ASSESSMENT_ID = 'assessment id', NOT_FOUND = 'not found',
        backups = {}, spies = {}, stubs = {}, actualErrorHandlers = {}, dummyData,
        isFilteredAnswer = function(answer) {
            return answer.type === ROLE;
        },
        initialize = function($controller, $rootScope, assessmentStatus, assessmentNotFound) {
            dummyData = {
                answers: [
                    {question_ID: {precept: 1}, status: 'approved', type: ROLE},
                    {question_ID: {precept: 2}, status: 'flagged', type: ROLE},
                    {question_ID: {precept: 2}, status: 'unresolved', type: 'REVIEWER'}
                ],
                answerTemplates: [
                    {approved: 0, flagged: 0, unresolved: 0, data: []},
                    {approved: 0, flagged: 0, unresolved: 0, data: []}
                ],
                assessment: {
                    assessment_ID: ASSESSMENT_ID
                },
                counters: {length: 0},
                filteredAnswers: 'FILTERED ANSWERS',
                user: {
                    isSupervisor: function() {
                        return IS_SUPERVISOR;
                    },
                    role: ROLE
                }
            };

            if(assessmentNotFound) {
                dummyData.assessment = {reason: NOT_FOUND};
            } else {
                dummyData.assessment.status = assessmentStatus;
            }

            backups.currenUser = _.cloneDeep(rgiIdentitySrvc.currentUser);
            rgiIdentitySrvc.currentUser = dummyData.user;
            backups.assessmentId = $routeParams.assessment_ID;
            $routeParams.assessment_ID = ASSESSMENT_ID;

            spies.questionSetLoadQuestions = sinon.spy(function(callback) {
                callback();
            });
            stubs.questionSetLoadQuestions = sinon.stub(rgiQuestionSetSrvc, 'loadQuestions',
                spies.questionSetLoadQuestions);

            spies.assessmentGet = sinon.spy(function(criteria, callback, errorHandler) {
                callback(dummyData.assessment);
                actualErrorHandlers.assessment = errorHandler;
            });
            stubs.assessmentGet = sinon.stub(rgiAssessmentSrvc, 'get', spies.assessmentGet);

            stubs.httpResponseProcessorGetDefaultHandler = sinon.stub(rgiHttpResponseProcessorSrvc, 'getDefaultHandler',
                function(errorMessage) {return errorMessage;});

            spies.answerQuery = sinon.spy(function(criteria, callback, errorHandler) {
                callback(dummyData.answers);
                actualErrorHandlers.answer = errorHandler;
            });
            stubs.answerQuery = sinon.stub(rgiAnswerSrvc, 'query', spies.answerQuery);

            spies.assessmentStatisticsGuideGetCounterSetTemplate = sinon.spy(function(callback) {
                callback(dummyData.counters);
            });
            stubs.assessmentStatisticsGuideGetCounterSetTemplate = sinon.stub(rgiAssessmentStatisticsGuideSrvc,
                'getCounterSetTemplate', spies.assessmentStatisticsGuideGetCounterSetTemplate);

            spies.answerFilterGetAnswers = sinon.spy(function() {
                return dummyData.filteredAnswers;
            });
            stubs.answerFilterGetAnswers = sinon.stub(rgiAnswerFilterSrvc, 'getAnswers', spies.answerFilterGetAnswers);

            spies.questionSetSetAnswers = sinon.spy();
            stubs.questionSetSetAnswers = sinon.stub(rgiQuestionSetSrvc, 'setAnswers', spies.questionSetSetAnswers);

            spies.preceptGuideGetAnswerTemplates = sinon.spy(function() {
                return dummyData.answerTemplates;
            });
            stubs.preceptGuideGetAnswerTemplates = sinon.stub(rgiPreceptGuideSrvc, 'getAnswerTemplates',
                spies.preceptGuideGetAnswerTemplates);

            spies.questionSetIsAvailable = sinon.spy(function(userType, answer) {
                return isFilteredAnswer(answer);
            });
            stubs.questionSetIsAvailable = sinon.stub(rgiQuestionSetSrvc, 'isAvailable', spies.questionSetIsAvailable);

            spies.assessmentStatisticsGuideUpdateCounters = sinon.spy();
            stubs.assessmentStatisticsGuideUpdateCounters = sinon.stub(rgiAssessmentStatisticsGuideSrvc,
                'updateCounters', spies.assessmentStatisticsGuideUpdateCounters);

            $scope = $rootScope.$new();
            $controller('rgiAssessmentDetailCtrl', {$scope: $scope});
        };

    beforeEach(inject(
        function (
            _$routeParams_,
            _rgiAnswerSrvc_,
            _rgiAnswerFilterSrvc_,
            _rgiAssessmentSrvc_,
            _rgiAssessmentStatisticsGuideSrvc_,
            _rgiDialogFactory_,
            _rgiHttpResponseProcessorSrvc_,
            _rgiIdentitySrvc_,
            _rgiNotifier_,
            _rgiPreceptGuideSrvc_,
            _rgiQuestionSetSrvc_
        ) {
            $routeParams = _$routeParams_;
            rgiAnswerSrvc = _rgiAnswerSrvc_;
            rgiAnswerFilterSrvc = _rgiAnswerFilterSrvc_;
            rgiAssessmentSrvc = _rgiAssessmentSrvc_;
            rgiAssessmentStatisticsGuideSrvc = _rgiAssessmentStatisticsGuideSrvc_;
            rgiDialogFactory = _rgiDialogFactory_;
            rgiHttpResponseProcessorSrvc = _rgiHttpResponseProcessorSrvc_;
            rgiIdentitySrvc = _rgiIdentitySrvc_;
            rgiNotifier = _rgiNotifier_;
            rgiPreceptGuideSrvc = _rgiPreceptGuideSrvc_;
            rgiQuestionSetSrvc = _rgiQuestionSetSrvc_;
        }
    ));

    describe('ASSESSMENT NOT FOUND CASE', function() {
        var mock;

        beforeEach(inject(function($rootScope, $controller) {
            mock = sinon.mock(rgiNotifier);
            mock.expects('error').withArgs(NOT_FOUND);
            initialize($controller, $rootScope, 'approved', true);
        }));

        it('shows an error message if fetching the assessment data fails', function() {
            mock.verify();
        });

        afterEach(function() {
            mock.restore();
        });
    });

    describe('FULL ASSESSMENT CASE', function() {
        beforeEach(inject(function($rootScope, $controller) {
            initialize($controller, $rootScope, 'approved');
        }));

        it('sets the reverse order flag', function() {
            $scope.order_reverse.should.be.equal(IS_SUPERVISOR);
        });

        it('sets the initial sorting order', function() {
            $scope.sortOrder.should.be.equal('question_order');
        });

        it('initialize the sorting options', function() {
            $scope.sortOptions.should.deep.equal([
                {value: 'question_order', text: 'Sort by Question Number'},
                {value: 'component_id', text: 'Sort by Component'},
                {value: 'status', text: 'Sort by Status'}
            ]);
        });

        it('loads the assessment counters data', function() {
            spies.assessmentStatisticsGuideGetCounterSetTemplate.called.should.be.equal(true);
        });

        it('initialize the assessment counters', function() {
            $scope.assessment_counters.should.deep.equal(dummyData.counters);
        });

        it('loads questions list', function() {
            spies.questionSetLoadQuestions.called.should.be.equal(true);
        });

        it('sends a request to get the assessment data', function() {
            spies.assessmentGet.withArgs({assessment_ID: ASSESSMENT_ID}).called.should.be.equal(true);
        });

        it('sends a request to get the answers', function() {
            spies.answerQuery.withArgs({assessment_ID: ASSESSMENT_ID}).called.should.be.equal(true);
        });

        it('requires filtered answers', function() {
            spies.answerFilterGetAnswers.withArgs(dummyData.answers, dummyData.assessment).called.should.be.equal(true);
        });

        it('sets the answers to the question set', function() {
            spies.questionSetSetAnswers.withArgs(dummyData.filteredAnswers).called.should.be.equal(true);
        });

        it('sets the assessment data', function() {
            $scope.assessment.should.deep.equal(dummyData.assessment);
        });

        it('processes `get assessment` HTTP errors', function() {
            actualErrorHandlers.assessment.should.be.equal('Load assessment data failure');
        });

        it('processes `query answers` HTTP errors', function() {
            actualErrorHandlers.answer.should.be.equal('Load answer data failure');
        });

        it('updates statistics counters', function() {
            dummyData.answers.forEach(function(answer) {
                if(isFilteredAnswer(answer)) {
                    spies.assessmentStatisticsGuideUpdateCounters.withArgs(answer, dummyData.counters,
                        dummyData.assessment).called.should.be.equal(true);
                }
            });
        });

        it('sets the answer data', function() {
            $scope.answers.should.deep.equal([
                {
                    approved: 1,
                    flagged: 0,
                    unresolved: 0,
                    data: [
                        {question_ID: {precept: 1}, status: 'approved', type: ROLE}
                    ]
                },
                {
                    approved: 0,
                    flagged: 1,
                    unresolved: 0,
                    data: [
                        {question_ID: {precept: 2}, status: 'flagged', type: ROLE}
                    ]
                }
            ]);
        });

        describe('ACTIONS', function() {
            var mock,
                setCounters = function(approved, number, length, field) {
                    var counters = {
                        approved: approved,
                        length: length
                    };

                    counters[field] = number;
                    $scope.assessment_counters = counters;

                    if($scope.assessment_counters.submitted === undefined) {
                        $scope.assessment_counters.submitted = 0;
                    }
                };

            describe('#moveAssessmentDialog', function() {
                it('opens a dialog', function() {
                    mock = sinon.mock(rgiDialogFactory);
                    mock.expects('assessmentMove').withArgs($scope);
                    $scope.moveAssessmentDialog();
                });
            });

            describe('#submitTrialAssessmentDialog', function() {
                it('shows an error message if there is at least one flagged answer', function() {
                    setCounters(1, 1, 2, 'flagged');
                    mock = sinon.mock(rgiNotifier);
                    mock.expects('error').withArgs('You must address all flags!');
                    $scope.submitTrialAssessmentDialog();
                });
            });

            [
                {scopeMethod: 'resubmitAssessmentDialog', dialogMethod: 'assessmentResubmit', field: 'resubmitted'},
                {scopeMethod: 'submitAssessmentDialog', dialogMethod: 'assessmentSubmit', field: 'submitted'},
                {scopeMethod: 'submitTrialAssessmentDialog', dialogMethod: 'assessmentTrialSubmit', field: 'submitted'}
            ].forEach(function(testAttributes) {
                describe('#' + testAttributes.scopeMethod, function() {
                    it('opens a dialog if all answers are approved or ' + testAttributes.field, function() {
                        setCounters(1, 1, 2, testAttributes.field);
                        mock = sinon.mock(rgiDialogFactory);
                        mock.expects(testAttributes.dialogMethod).withArgs($scope);
                    });

                    it('shows an error message if not all answers are approved or ' + testAttributes.field, function() {
                        setCounters(1, 1, 3, testAttributes.field);
                        mock = sinon.mock(rgiNotifier);
                        mock.expects('error').withArgs('Some answers have not been marked complete or approved!');
                    });

                    afterEach(function() {
                        $scope[testAttributes.scopeMethod]();
                    });
                });
            });

            afterEach(function() {
                mock.verify();
                mock.restore();
            });
        });
    });

    ['researcher_trial', 'reviewer_trial', 'trial_started', 'trial_submitted'].forEach(function(status) {
        describe('FULL ASSESSMENT CASE (`' + status + '` status)', function() {
            beforeEach(inject(function($rootScope, $controller) {
                initialize($controller, $rootScope, status);
            }));

            it('sends a request to get the answers', function() {
                spies.answerQuery.withArgs({
                    assessment_ID: ASSESSMENT_ID,
                    question_trial: true
                }).called.should.be.equal(true);
            });
        });
    });

    afterEach(function() {
        rgiIdentitySrvc.currentUser = backups.currenUser;
        $routeParams.assessment_ID = backups.assessmentId;

        Object.keys(stubs).forEach(function(stubName) {
            stubs[stubName].restore();
        });
    });
});
