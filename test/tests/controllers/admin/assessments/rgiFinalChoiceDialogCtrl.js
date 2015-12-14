'use strict';

describe('rgiFinalChoiceDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, $location, $routeParams, ngDialog,
        rgiNotifier, rgiAnswerSrvc, rgiAnswerMethodSrvc, rgiAssessmentMethodSrvc, rgiQuestionSetSrvc;
    var $parent, routeParamsAnswerIdBackup, answerId = 'answer2015', answerQueryStub, answerQuerySpy, ANSWERS = [1, 2];

    beforeEach(inject(
        function (
            $controller,
            $rootScope,
            _$routeParams_,
            _$location_,
            _ngDialog_,
            _rgiNotifier_,
            _rgiAnswerSrvc_,
            _rgiAnswerMethodSrvc_,
            _rgiQuestionSetSrvc_,
            _rgiAssessmentMethodSrvc_
        ) {
            $scope = $rootScope.$new();
            $parent = {
                answer: {
                    assessment_ID: 'assessment-id',
                    final_score: 3,
                    question_order: 1,
                    researcher_score: 'Researcher Score',
                    researcher_justification: 'Researcher Justification',
                    reviewer_score: 'Reviewer Score',
                    reviewer_justification: 'Reviewer Justification',
                    ROLE_justification: 'Role Justification',
                    'new role_justification': 'New Role Justification'
                },
                question: {question_criteria: 'Question Criteria'}
            };
            $scope.$parent = $parent;

            $location = _$location_;
            $routeParams = _$routeParams_;
            ngDialog = _ngDialog_;
            rgiNotifier = _rgiNotifier_;
            rgiAnswerSrvc = _rgiAnswerSrvc_;
            rgiAnswerMethodSrvc = _rgiAnswerMethodSrvc_;
            rgiQuestionSetSrvc = _rgiQuestionSetSrvc_;
            rgiAssessmentMethodSrvc = _rgiAssessmentMethodSrvc_;

            routeParamsAnswerIdBackup = $routeParams.answer_ID;
            $routeParams.answer_ID = answerId;

            answerQuerySpy = sinon.spy(function(assessment, callback) {
                callback(ANSWERS);
            });
            answerQueryStub = sinon.stub(rgiAnswerSrvc, 'query', answerQuerySpy);

            $controller('rgiFinalChoiceDialogCtrl', {$scope: $scope});
        }
    ));

    it('initializes the choice set', function() {
        $scope.final_choice_set.should.deep.equal([
            {
                text: 'Agree with researcher score',
                score: $parent.answer.researcher_score,
                justification: $parent.answer.researcher_justification,
                value: 'researcher',
                role: 'researcher'
            },
            {
                text: 'Agree with reviewer score',
                score: $parent.answer.reviewer_score,
                justification: $parent.answer.reviewer_justification,
                value: 'reviewer',
                role: 'reviewer'
            },
            {
                text: 'Other score',
                score: 0,
                justification: '',
                value: 'other',
                role: 'admin'
            }
        ]);
    });

    it('initializes the question choices', function() {
        $scope.question_criteria.should.be.equal($parent.question.question_criteria);
    });

    it('requires the answers data', function() {
        answerQuerySpy.withArgs({assessment_ID: 'answer'}).called.should.be.equal(true);
    });


    describe('#finalChoiceSubmit', function() {
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
                $scope.finalChoiceSubmit();
            });
        });

        describe('COMPLETE DATA CASE', function() {
            var stubsCreated, answerMethodUpdateAnswerStub, answerMethodUpdateAnswerSpy, checkExtra = function() {};
            var areQuestionsRemainingQuestionSetStub, getNextQuestionIdQuestionSetStub;

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
                var $locationMock, dialogMock;

                beforeEach(function() {
                    $locationMock = sinon.mock($location);
                    notifierMock.expects('notify').withArgs('Answer finalized');

                    dialogMock = sinon.mock(ngDialog);
                    dialogMock.expects('close');

                    checkExtra = function() {
                        $locationMock.verify();
                        $locationMock.restore();
                        dialogMock.verify();
                        dialogMock.restore();
                    };

                    answerMethodUpdateAnswerSpy = sinon.spy(function() {
                        return {
                            then: function(callback) {
                                callback();
                            }
                        };
                    });
                });

                var setCriteria = function(role, areQuestionsRemaining, questionOrder, uri) {
                    $scope.current_user = {role: role};
                    stubsCreated = true;
                    $locationMock.expects('path').withArgs(uri);

                    areQuestionsRemainingQuestionSetStub = sinon.stub(rgiQuestionSetSrvc, 'areQuestionsRemaining', function() {
                        return areQuestionsRemaining;
                    });
                    getNextQuestionIdQuestionSetStub = sinon.stub(rgiQuestionSetSrvc, 'getNextQuestionId', function() {
                        return '00' + questionOrder;
                    });
                };

                it('redirects the user to the default user URL if the question order is equal to the questions number', function() {
                    setCriteria('not supervisor', false, undefined, '/assessments/' + $parent.answer.assessment_ID);
                });

                it('redirects the user to the answer user URL if the question order is equal to the questions number', function() {
                    setCriteria('not supervisor', true, 1, '/assessments/answer/' + $parent.answer.assessment_ID + '-001');
                });

                it('redirects the supervisor to the default admin URL if the question order is equal to the questions number', function() {
                    setCriteria('supervisor', false, undefined, '/admin/assessments-admin/' + $parent.answer.assessment_ID);
                });

                it('redirects the user to the answer user URL if the question order is equal to the questions number', function() {
                    setCriteria('supervisor', true, 1, '/admin/assessments-admin/answer/' + $parent.answer.assessment_ID + '-001');
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
                $scope.finalChoiceSubmit();

                var args = angular.copy($parent.answer, {
                    status: 'final',
                    final_score: final_choice.score,
                    final_role: final_choice.role,
                    final_justification: final_choice.justification
                });

                answerMethodUpdateAnswerSpy.withArgs(args).called.should.be.equal(true);
                answerMethodUpdateAnswerStub.restore();
                checkExtra();

                if(stubsCreated) {
                    areQuestionsRemainingQuestionSetStub.restore();
                    getNextQuestionIdQuestionSetStub.restore();
                }
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
    });
});
