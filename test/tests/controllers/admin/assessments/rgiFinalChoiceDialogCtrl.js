'use strict';
/*jshint -W079 */

var _, describe, beforeEach, afterEach, it, inject, expect, sinon;

describe('rgiAssessmentAdminCtrl', function () {
    beforeEach(module('app'));

    var $scope, $location, ngDialog, rgiNotifier, rgiAnswerMethodSrvc, rgiAssessmentMethodSrvc;
    var $parent;

    beforeEach(inject(
        function ($controller, $rootScope, _$location_, _ngDialog_, _rgiNotifier_, _rgiAnswerMethodSrvc_, _rgiAssessmentMethodSrvc_) {
            $scope = $rootScope.$new();
            $parent = {
                answer: {
                    assessment_ID: 'assessment-id',
                    final_score: 3,
                    question_order: 1,
                    researcher_score: 'Researcher Score',
                    reviewer_score: 'Reviewer Score',
                    ROLE_justification: 'Role Justification',
                    'new role_justification': 'New Role Justification'
                },
                assessment: {questions_unfinalized: 2},
                question: {question_choices: 'Question Choices'}
            };
            $scope.$parent = $parent;

            $location = _$location_;
            ngDialog = _ngDialog_;
            rgiNotifier = _rgiNotifier_;
            rgiAnswerMethodSrvc = _rgiAnswerMethodSrvc_;
            rgiAssessmentMethodSrvc = _rgiAssessmentMethodSrvc_;

            $controller('rgiFinalChoiceDialogCtrl', {$scope: $scope});
        }
    ));

    it('initializes the choice set', function() {
        _.isEqual($scope.final_choice_set, [
            {
                text: 'Agree with researcher score',
                value: $parent.answer.researcher_score,
                role: 'researcher'
            },
            {
                text: 'Agree with reviewer score',
                value: $parent.answer.reviewer_score,
                role: 'researcher'
            },
            {
                text: 'Other score',
                value: 'other',
                role: 'admin'
            }
        ]).should.be.equal(true);
    });

    it('initializes the question choices', function() {
        _.isEqual($scope.question_choices, $parent.question.question_choices).should.be.equal(true);
    });

    describe('#closeDialog', function() {
        it('initializes the question choices', function() {
            var ngDialogMock = sinon.mock(ngDialog);
            ngDialogMock.expects('close');

            $scope.closeDialog();

            ngDialogMock.restore();
            ngDialogMock.verify();
        });
    });

    describe('#finalChoiceSubmit', function() {
        var answerMethodUpdateAnswerStub, answerMethodUpdateAnswerSpy;
        var assessmentMethodUpdateAssessmentStub, assessmentMethodUpdateAssessmentSpy;
        var notifierMock;

        var final_choice = {
            value: 'VALUE',
            role: 'ROLE'
        };

        beforeEach(function() {
            notifierMock = sinon.mock(rgiNotifier);
            answerMethodUpdateAnswerSpy = sinon.spy(function() {
                return {
                    then: function(callback) {
                        return callback;
                    }
                };
            });
            answerMethodUpdateAnswerStub = sinon.stub(rgiAnswerMethodSrvc, 'updateAnswer', answerMethodUpdateAnswerSpy);
            $scope.final_choice = final_choice;
        });

        describe('SUCCESS CASE', function() {
            var $locationMock;

            beforeEach(function() {
                assessmentMethodUpdateAssessmentSpy = sinon.spy(function() {
                    return {
                        then: function(callback) {
                            callback();
                        }
                    };
                });

                assessmentMethodUpdateAssessmentStub = sinon.stub(rgiAssessmentMethodSrvc, 'updateAssessment', assessmentMethodUpdateAssessmentSpy);
                $locationMock = sinon.mock($location);
                notifierMock.expects('notify').withArgs('Answer finalized');
            });

            describe('answer data submission', function() {
                var args;

                beforeEach(function() {
                    $scope.final_choice = {
                        value: 2,
                        role: 'new role'
                    };

                    args = _.clone($parent.answer);
                    args.status = 'final';
                    args.final_score = 2;
                });

                it('submits data with custom justification', function() {
                    $scope.final_choice.final_justification = 'Final Justification';
                    args.final_justification = 'admin: Final Justification';
                });

                it('submits data with default justification', function() {
                    args.final_justification = $scope.final_choice.role + ': ' + $scope.$parent.answer[$scope.final_choice.role + '_justification'];
                });

                afterEach(function() {
                    args.final_role = $scope.final_choice.role;
                    $scope.finalChoiceSubmit();
                    answerMethodUpdateAnswerSpy.withArgs(args).called.should.be.equal(true);
                });
            });

            it('submits assessment data', function() {
                $scope.finalChoiceSubmit();
                assessmentMethodUpdateAssessmentSpy.withArgs({questions_unfinalized: 1}).called.should.be.equal(true);
            });

            it('redirects to the default URL by default', function() {
                $locationMock.expects('path').withArgs('/admin/assessment-review/' + $parent.answer.assessment_ID);
                $scope.finalChoiceSubmit();
            });

            it('redirects to the special URL if the questions are not finalized', function() {
                $scope.$parent.answer.questions_unfinalized = 0;
                $locationMock.expects('path').withArgs('/admin/assessment-review/answer-review-edit/' + $parent.answer.assessment_ID + '-002');
                $scope.finalChoiceSubmit();
            });

            afterEach(function() {
                $locationMock.verify();
                $locationMock.restore();
            });
        });

        describe('FAILURE CASE', function() {
            it('shows failure reason', function() {
                var REASON = 'REASON';

                assessmentMethodUpdateAssessmentSpy = sinon.spy(function() {
                    return {
                        then: function(uselessPositiveCallback, negativeCallback) {
                            negativeCallback(REASON);
                        }
                    };
                });

                assessmentMethodUpdateAssessmentStub = sinon.stub(rgiAssessmentMethodSrvc, 'updateAssessment', assessmentMethodUpdateAssessmentSpy);
                notifierMock.expects('notify').withArgs(REASON);
                $scope.finalChoiceSubmit();
            });
        });

        afterEach(function() {
            answerMethodUpdateAnswerStub.restore();
            assessmentMethodUpdateAssessmentStub.restore();
            notifierMock.verify();
            notifierMock.restore();
        });
    });
});
