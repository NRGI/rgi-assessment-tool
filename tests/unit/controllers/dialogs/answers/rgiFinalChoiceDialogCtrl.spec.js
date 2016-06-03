'use strict';

describe('rgiFinalChoiceDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, $location, $routeParams,
        rgiNotifier, rgiAnswerMethodSrvc, rgiIdentitySrvc, rgiQuestionSetSrvc, rgiUrlGuideSrvc,
        $parent, currenUserBackup, routeParamsAnswerIdBackup, actualErrorHandler, answerId = 'answer2015', spies = {},
        stubs = {}, ANSWERS = [1, 2], currentUer = {role: 'user-role', _id: 'user-id'}, ERROR_HANDLER = 'ERROR HANDLER';

    beforeEach(inject(
        function (
            $controller,
            $rootScope,
            _$routeParams_,
            _$location_,
            rgiAnswerSrvc,
            _rgiAnswerMethodSrvc_,
            rgiHttpResponseProcessorSrvc,
            _rgiIdentitySrvc_,
            _rgiNotifier_,
            _rgiQuestionSetSrvc_,
            _rgiUrlGuideSrvc_
        ) {
            $scope = $rootScope.$new();
            $parent = {
                question: {question_criteria: 'Question Criteria'},
                $parent: {
                    answer: {
                        references: [],
                        assessment_ID: 'assessment-id',
                        researcher_score: 'Researcher Score',
                        researcher_justification: 'Researcher Justification',
                        reviewer_score: 'Reviewer Score',
                        reviewer_justification: 'Reviewer Justification'
                    }
                }
            };
            $scope.$parent = $parent;

            $location = _$location_;
            $routeParams = _$routeParams_;
            rgiIdentitySrvc = _rgiIdentitySrvc_;
            rgiNotifier = _rgiNotifier_;
            rgiAnswerMethodSrvc = _rgiAnswerMethodSrvc_;
            rgiQuestionSetSrvc = _rgiQuestionSetSrvc_;
            rgiUrlGuideSrvc = _rgiUrlGuideSrvc_;

            routeParamsAnswerIdBackup = $routeParams.answer_ID;
            $routeParams.answer_ID = answerId;

            spies.httpResponseProcessorGetDefaultHandler = sinon.spy(function() {
                return ERROR_HANDLER;
            });
            stubs.httpResponseProcessorGetDefaultHandler = sinon.stub(rgiHttpResponseProcessorSrvc, 'getDefaultHandler',
                spies.httpResponseProcessorGetDefaultHandler);

            spies.questionSetLoadQuestions = sinon.spy(function(callback) {
                callback();
            });
            stubs.questionSetLoadQuestions = sinon.stub(rgiQuestionSetSrvc, 'loadQuestions',
                spies.questionSetLoadQuestions);

            spies.answerQuery = sinon.spy(function(assessment, callback, errorHandler) {
                callback(ANSWERS);
                actualErrorHandler = errorHandler;
            });
            stubs.answerQuery = sinon.stub(rgiAnswerSrvc, 'query', spies.answerQuery);

            currenUserBackup = _.cloneDeep(rgiIdentitySrvc.currentUser);
            rgiIdentitySrvc.currentUser = currentUer;
            $scope.closeThisDialog = sinon.spy();

            $controller('rgiFinalChoiceDialogCtrl', {$scope: $scope});
        }
    ));

    it('initializes the choice set', function() {
        $scope.answerOptions.should.deep.equal([
            {
                text: 'Agree with researcher score',
                score: $parent.$parent.answer.researcher_score,
                justification: $parent.$parent.answer.researcher_justification,
                comment: '',
                value: 'researcher',
                role: 'researcher'
            },
            {
                text: 'Agree with reviewer score',
                score: $parent.$parent.answer.reviewer_score,
                justification: $parent.$parent.answer.reviewer_justification,
                comment: '',
                value: 'reviewer',
                role: 'reviewer'
            },
            {
                text: 'Other score',
                score: 0,
                justification: '',
                comment: '',
                value: 'other',
                role: currentUer.role
            }
        ]);
    });

    it('initializes the question choices', function() {
        $scope.question_criteria.should.be.equal($parent.question.question_criteria);
    });

    it('gets an error handler', function() {
        actualErrorHandler.should.be.equal(ERROR_HANDLER);
        spies.httpResponseProcessorGetDefaultHandler.withArgs('Load answer data failure').called.should.be.equal(true);
    });

    it('loads questions data', function() {
        spies.questionSetLoadQuestions.called.should.be.equal(true);
    });

    it('requires the answers data', function() {
        spies.answerQuery.withArgs({assessment_ID: 'answer'}).called.should.be.equal(true);
    });

    it('sets the request processing flag', function() {
        $scope.requestProcessing.should.be.equal(false);
    });


    describe('#submitFinalChoice', function() {
        var mocks = {};

        beforeEach(function() {
            mocks.notifier = sinon.mock(rgiNotifier);
        });

        describe('INCOMPLETE DATA CASE', function() {
            it('shows an error message is the final score data are not set', function() {
                $scope.final_choice = undefined;
                mocks.notifier.expects('error').withArgs('You must select an action!');
            });

            it('shows an error message is the final score is not set', function() {
                $scope.final_choice = {score: 0};
                mocks.notifier.expects('error').withArgs('You must select a score!');
            });

            it('shows an error message is the justification is not set', function() {
                $scope.final_choice = {score: 1, justification: ''};
                mocks.notifier.expects('error').withArgs('You must provide a justification!');
            });

            afterEach(function() {
                $scope.submitFinalChoice();
            });
        });

        describe('COMPLETE DATA CASE', function() {
            var checkExtra = function() {};

            var final_choice = {
                score: 'VALUE',
                role: 'ROLE',
                justification: 'JUSTIFICATION'
            };

            beforeEach(function() {
                spies.answerMethodUpdateAnswer = sinon.spy(function() {
                    return {
                        then: function(callback) {
                            callback();
                            return {finally: function(finallyCallback) {
                                finallyCallback();
                            }};
                        }
                    };
                });
                $scope.final_choice = final_choice;
            });

            describe('SUCCESS CASE', function() {
                beforeEach(function() {
                    mocks.$location = sinon.mock($location);
                    mocks.$location.expects('path');

                    mocks.urlGuide = sinon.mock(rgiUrlGuideSrvc);
                    mocks.notifier.expects('notify').withArgs('Answer finalized');

                    checkExtra = function() {
                        mocks.$location.verify();
                        mocks.$location.restore();
                        $scope.closeThisDialog.called.should.be.equal(true);
                    };

                    spies.answerMethodUpdateAnswer = sinon.spy(function() {
                        return {
                            then: function(callback) {
                                callback();
                                return {finally: function(finallyCallback) {
                                    finallyCallback();
                                }};
                            }
                        };
                    });
                });

                var setCriteria = function(nextQuestionId) {
                    stubs.isAnyQuestionRemaining = sinon.stub(rgiQuestionSetSrvc, 'isAnyQuestionRemaining', function() {
                        return nextQuestionId !== undefined;
                    });

                    if(nextQuestionId !== undefined) {
                        stubs.getNextQuestionId = sinon.stub(rgiQuestionSetSrvc, 'getNextQuestionId', function() {
                            return nextQuestionId;
                        });

                        mocks.urlGuide.expects('getAnswerUrl');
                    } else {
                        mocks.urlGuide.expects('getAssessmentUrl');
                    }
                };

                it('redirects to the assessment URL if there are no more questions', function() {
                    setCriteria();
                });

                it('redirects to the next question URL if there are questions available', function() {
                    setCriteria('next-question');
                });
            });

            describe('FAILURE CASE', function() {
                beforeEach(function() {
                    checkExtra = function() {
                        $scope.closeThisDialog.called.should.be.equal(true);
                    };
                });

                it('shows failure reason', function() {
                    var REASON = 'REASON';

                    spies.answerMethodUpdateAnswer = sinon.spy(function() {
                        return {
                            then: function(uselessPositiveCallback, negativeCallback) {
                                negativeCallback(REASON);
                                return {finally: function(finallyCallback) {
                                    finallyCallback();
                                }};
                            }
                        };
                    });

                    mocks.notifier.expects('error').withArgs(REASON);
                });
            });

            afterEach(function() {
                stubs.answerMethodUpdateAnswer = sinon.stub(rgiAnswerMethodSrvc, 'updateAnswer',
                    spies.answerMethodUpdateAnswer);
                $scope.submitFinalChoice();

                var args = angular.copy($parent.$parent.answer, {
                    status: 'final',
                    final_score: final_choice.score,
                    final_role: final_choice.role,
                    final_justification: final_choice.justification
                });

                spies.answerMethodUpdateAnswer.withArgs(args).called.should.be.equal(true);
                checkExtra();
            });
        });

        afterEach(function() {
            Object.keys(mocks).forEach(function(mockName) {
                mocks[mockName].verify();
                mocks[mockName].restore();
            });
        });
    });

    afterEach(function() {
        $routeParams.answer_ID = routeParamsAnswerIdBackup;
        rgiIdentitySrvc.currentUser = currenUserBackup;


        for(var stubIndex in stubs) {
            if(stubs.hasOwnProperty(stubIndex)) {
                stubs[stubIndex].restore();
            }
        }
    });
});
