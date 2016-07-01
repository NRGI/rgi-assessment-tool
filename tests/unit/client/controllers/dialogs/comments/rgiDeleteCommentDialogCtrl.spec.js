'use strict';

describe('rgiDeleteCommentDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, rgiNotifier, rgiAnswerMethodSrvc;

    beforeEach(inject(
        function ($rootScope, $controller, _rgiNotifier_, _rgiAnswerMethodSrvc_) {
            rgiNotifier = _rgiNotifier_;
            rgiAnswerMethodSrvc = _rgiAnswerMethodSrvc_;

            $scope = $rootScope.$new();
            $controller('rgiDeleteCommentDialogCtrl', {$scope: $scope});
        }
    ));

    describe('#deleteComment', function() {
        var answerMethodUpdateAnswerStub, notifierMock, spies = {}, ANSWER = 'ANSWER',
            setSaveStub = function(callback) {
                spies.answerMethodUpdateAnswer = sinon.spy(function() {
                    return {then: callback};
                });
                answerMethodUpdateAnswerStub = sinon.stub(rgiAnswerMethodSrvc, 'updateAnswer',
                    spies.answerMethodUpdateAnswer);
            };

        beforeEach(function() {
            notifierMock = sinon.mock(rgiNotifier);
            $scope.closeThisDialog = sinon.spy();
            $scope.comment = {};
            $scope.$parent = {update: ANSWER};
        });

        describe('SUCCESS CASE', function() {
            beforeEach(function() {
                setSaveStub(function(callback) {
                    callback();
                    return {finally: function(finalCallback) {
                        finalCallback();
                    }};
                });

                notifierMock.expects('notify').withArgs('The comment has been deleted');
                $scope.deleteComment();
            });

            it('hides the comment', function() {
                $scope.comment.hidden.should.be.equal(true);
            });

            it('shows a confirmation message', function() {
                notifierMock.verify();
            });
        });

        describe('SUCCESS CASE', function() {
            var ERROR_REASON = 'ERROR REASON';

            beforeEach(function() {
                setSaveStub(function(callbackSuccess, callbackFailure) {
                    callbackFailure(ERROR_REASON);
                    return {finally: function(finalCallback) {
                        finalCallback();
                    }};
                });

                notifierMock.expects('error').withArgs(ERROR_REASON);
                $scope.deleteComment();
            });

            it('does not hide the comment', function() {
                $scope.comment.hidden.should.be.equal(false);
            });

            it('shows an error message', function() {
                notifierMock.verify();
            });
        });

        afterEach(function() {
            spies.answerMethodUpdateAnswer.withArgs(ANSWER).called.should.be.equal(true);
            $scope.closeThisDialog.called.should.be.equal(true);
            answerMethodUpdateAnswerStub.restore();
            notifierMock.restore();
        });
    });
});
