'use strict';

describe('rgiFinalChoiceDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, $location, $routeParams, ngDialog,
        rgiNotifier, rgiAnswerSrvc, rgiAnswerMethodSrvc, rgiIdentitySrvc, rgiQuestionSetSrvc, rgiUrlGuideSrvc,
        $parent, currenUserBackup, currentUer = {role: 'user-role', _id: 'user-id'},
        routeParamsAnswerIdBackup, answerId = 'answer2015', answerQueryStub, answerQuerySpy, ANSWERS = [1, 2];

    beforeEach(inject(
        function (
            $controller,
            $rootScope,
            _$routeParams_,
            _$location_,
            _ngDialog_,
            _rgiIdentitySrvc_,
            _rgiNotifier_,
            _rgiAnswerSrvc_,
            _rgiAnswerMethodSrvc_,
            _rgiQuestionSetSrvc_,
            _rgiUrlGuideSrvc_
        ) {
            $scope = $rootScope.$new();
            $parent = {
                question: {question_criteria: 'Question Criteria'},
                $parent: {
                    $parent: {'_': _},
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
            ngDialog = _ngDialog_;
            rgiIdentitySrvc = _rgiIdentitySrvc_;
            rgiNotifier = _rgiNotifier_;
            rgiAnswerSrvc = _rgiAnswerSrvc_;
            rgiAnswerMethodSrvc = _rgiAnswerMethodSrvc_;
            rgiQuestionSetSrvc = _rgiQuestionSetSrvc_;
            rgiUrlGuideSrvc = _rgiUrlGuideSrvc_;

            routeParamsAnswerIdBackup = $routeParams.answer_ID;
            $routeParams.answer_ID = answerId;

            answerQuerySpy = sinon.spy(function(assessment, callback) {
                callback(ANSWERS);
            });
            answerQueryStub = sinon.stub(rgiAnswerSrvc, 'query', answerQuerySpy);

            currenUserBackup = _.cloneDeep(rgiIdentitySrvc.currentUser);
            rgiIdentitySrvc.currentUser = currentUer;

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

    it('requires the answers data', function() {
        answerQuerySpy.withArgs({assessment_ID: 'answer'}).called.should.be.equal(true);
    });

    it('sets the request processing flag', function() {
        $scope.requestProcessing.should.be.equal(false);
    });


    describe('#submitFinalChoice', function() {
        var notifierMock;

        beforeEach(function() {
            notifierMock = sinon.mock(rgiNotifier);
        });

        describe('INCOMPLETE DATA CASE', function() {
            it('shows an error message is the final score data are not set', function() {
                $scope.final_choice = undefined;
                notifierMock.expects('error').withArgs('You must select an action!');
            });

            it('shows an error message is the final score is not set', function() {
                $scope.final_choice = {score: 0};
                notifierMock.expects('error').withArgs('You must select a score!');
            });

            it('shows an error message is the justification is not set', function() {
                $scope.final_choice = {score: 1, justification: ''};
                notifierMock.expects('error').withArgs('You must provide a justification!');
            });

            afterEach(function() {
                $scope.submitFinalChoice();
            });
        });

        describe('COMPLETE DATA CASE', function() {
            var answerMethodUpdateAnswerStub, answerMethodUpdateAnswerSpy, checkExtra = function() {};

            var final_choice = {
                score: 'VALUE',
                role: 'ROLE',
                justification: 'JUSTIFICATION'
            };

            beforeEach(function() {
                answerMethodUpdateAnswerSpy = sinon.spy(function() {
                    return {
                        then: function(callback) {
                            return callback;
                        }
                    };
                });
                $scope.final_choice = final_choice;
            });

            describe('SUCCESS CASE', function() {
                var $locationMock, dialogMock, urlGuideMock, stubs = {};

                beforeEach(function() {
                    $locationMock = sinon.mock($location);
                    $locationMock.expects('path');

                    urlGuideMock = sinon.mock(rgiUrlGuideSrvc);
                    notifierMock.expects('notify').withArgs('Answer finalized');

                    dialogMock = sinon.mock(ngDialog);
                    dialogMock.expects('close');

                    checkExtra = function() {
                        $locationMock.verify();
                        $locationMock.restore();
                        dialogMock.verify();
                        dialogMock.restore();
                        console.log('restore mocks');
                    };

                    answerMethodUpdateAnswerSpy = sinon.spy(function() {
                        return {
                            then: function(callback) {
                                callback();
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

                        urlGuideMock.expects('getAnswerUrl');
                    } else {
                        urlGuideMock.expects('getAssessmentUrl');
                    }
                };

                it('redirects to the assessment URL if there are no more questions', function() {
                    setCriteria();
                });

                it('redirects to the next question URL if there are questions available', function() {
                    setCriteria('next-question');
                });

                afterEach(function() {
                    var originalCheckExtra = checkExtra;

                    checkExtra = function() {
                        originalCheckExtra();
                        urlGuideMock.verify();
                        urlGuideMock.restore();

                        for(var stubIndex in stubs) {
                            if(stubs.hasOwnProperty(stubIndex)) {
                                stubs[stubIndex].restore();
                            }
                        }
                    };
                });
            });

            describe('FAILURE CASE', function() {
                it('shows failure reason', function() {
                    var REASON = 'REASON';

                    answerMethodUpdateAnswerSpy = sinon.spy(function() {
                        return {
                            then: function(uselessPositiveCallback, negativeCallback) {
                                negativeCallback(REASON);
                            }
                        };
                    });

                    notifierMock.expects('error').withArgs(REASON);
                });
            });

            afterEach(function() {
                answerMethodUpdateAnswerStub = sinon.stub(rgiAnswerMethodSrvc, 'updateAnswer', answerMethodUpdateAnswerSpy);
                $scope.submitFinalChoice();

                var args = angular.copy($parent.$parent.answer, {
                    status: 'final',
                    final_score: final_choice.score,
                    final_role: final_choice.role,
                    final_justification: final_choice.justification
                });

                answerMethodUpdateAnswerSpy.withArgs(args).called.should.be.equal(true);
                answerMethodUpdateAnswerStub.restore();
                checkExtra();
            });
        });

        afterEach(function() {
            notifierMock.verify();
            notifierMock.restore();
        });
    });

    afterEach(function() {
        $routeParams.answer_ID = routeParamsAnswerIdBackup;
        answerQueryStub.restore();
        rgiIdentitySrvc.currentUser = currenUserBackup;
    });
});
