'use strict';

describe('rgiEditCommentDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, rgiIdentitySrvc, rgiNotifier, rgiAnswerMethodSrvc,
        identityCurrentUserBackup, CURRENT_USER = 'CURRENT USER', COMMENT_CONTENT = 'COMMENT CONTENT';

    beforeEach(inject(
        function ($rootScope, $controller, _rgiIdentitySrvc_, _rgiNotifier_, _rgiAnswerMethodSrvc_) {
            rgiIdentitySrvc = _rgiIdentitySrvc_;
            rgiNotifier = _rgiNotifier_;
            rgiAnswerMethodSrvc = _rgiAnswerMethodSrvc_;

            identityCurrentUserBackup = _.clone(rgiIdentitySrvc.currentUser);
            rgiIdentitySrvc.currentUser = CURRENT_USER;

            $scope = $rootScope.$new();
            $scope.ngDialogData = {comment: {content: COMMENT_CONTENT}};
            $controller('rgiEditCommentDialogCtrl', {$scope: $scope});
        }
    ));

    it('sets the current user data', function() {
        $scope.current_user.should.be.equal(CURRENT_USER);
    });

    it('sets the comment content', function() {
        $scope.commentContent.should.be.equal(COMMENT_CONTENT);
    });

    describe('#isCommentModificationValid', function() {
        var setCommentData = function(comment, originalComment) {
            $scope.commentContent = comment;
            $scope.ngDialogData.comment.content = originalComment;
        };

        it('returns `false` if the comment is empty', function() {
            setCommentData('');
            $scope.isCommentModificationValid().should.be.equal(false);
        });

        it('returns `false` if the comment is not modified', function() {
            setCommentData('the same', 'the same');
            $scope.isCommentModificationValid().should.be.equal(false);
        });

        it('returns `true` if the comment is modified and is not empty', function() {
            setCommentData('modified', 'original');
            $scope.isCommentModificationValid().should.be.equal(true);
        });
    });

    describe('#saveComment', function() {
        var answerMethodUpdateAnswerSpy, answerMethodUpdateAnswerStub, notifierMock,
            setAnswerMethodUpdateAnswerStub = function(callback) {
                answerMethodUpdateAnswerSpy = sinon.spy(function() {
                    return {then: callback};
                });
                answerMethodUpdateAnswerStub = sinon.stub(rgiAnswerMethodSrvc, 'updateAnswer',
                    answerMethodUpdateAnswerSpy);
            };

        beforeEach(function() {
            $scope.ngDialogData.answer = 'ANSWER';
            $scope.closeThisDialog = sinon.spy();
            notifierMock = sinon.mock(rgiNotifier);
        });

        it('shows a notification message if the request succeeds', function() {
            notifierMock.expects('notify').withArgs('Comment edited');
            setAnswerMethodUpdateAnswerStub(function(callback) {
                callback();
                return {finally: function(finalCallback) {finalCallback();}};
            });
        });

        it('shows the failure reason if the request fails', function() {
            var FAILURE_REASON = 'FAILURE REASON';
            notifierMock.expects('error').withArgs(FAILURE_REASON);

            setAnswerMethodUpdateAnswerStub(function(callbackSuccess, callbackFailure) {
                callbackFailure(FAILURE_REASON);
                return {finally: function(finalCallback) {finalCallback();}};
            });
        });

        afterEach(function() {
            $scope.saveComment();

            $scope.ngDialogData.comment.content.should.be.equal($scope.commentContent);
            $scope.closeThisDialog.called.should.be.equal(true);
            answerMethodUpdateAnswerSpy.withArgs($scope.ngDialogData.answer).called.should.be.equal(true);

            answerMethodUpdateAnswerStub.restore();
            notifierMock.verify();
            notifierMock.restore();
        });
    });

    afterEach(function() {
        rgiIdentitySrvc.currentUser = identityCurrentUserBackup;
    });
});
