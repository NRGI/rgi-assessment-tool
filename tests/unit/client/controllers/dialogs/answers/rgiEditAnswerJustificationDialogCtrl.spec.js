'use strict';

describe('rgiEditAnswerJustificationDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, rgiAnswerMethodSrvc, rgiNotifier, ORIGINAL_JUSTIFICATION = 'Original Justification';

    beforeEach(inject(
        function (
            $controller,
            $rootScope,
            _rgiAnswerMethodSrvc_,
            _rgiNotifier_
        ) {
            $scope = $rootScope.$new();
            $scope.closeThisDialog = sinon.spy();
            $scope.field = 'justification';
            $scope.answer = {justification: ORIGINAL_JUSTIFICATION};

            rgiAnswerMethodSrvc = _rgiAnswerMethodSrvc_;
            rgiNotifier = _rgiNotifier_;
            $controller('rgiEditAnswerJustificationDialogCtrl', {$scope: $scope});
        }
    ));

    describe('#editJustification', function() {
        var answerMethodUpdateAnswerStub, answerMethodUpdateAnswerSpy, callbacks = {};

        beforeEach(function() {
            answerMethodUpdateAnswerSpy = sinon.spy(function() {
                return {then: function(callbackSuccess, callbackFailure) {
                    callbacks.success = callbackSuccess;
                    callbacks.failure = callbackFailure;

                    return {finally: function(callback) {
                        callback();
                    }};
                }};
            });

            answerMethodUpdateAnswerStub = sinon.stub(rgiAnswerMethodSrvc, 'updateAnswer', answerMethodUpdateAnswerSpy);
            $scope.editJustification();
        });

        it('submits a request to update the answer', function() {
            answerMethodUpdateAnswerSpy.called.should.be.equal(true);
        });

        it('closes the dialog', function() {
            $scope.closeThisDialog.called.should.be.equal(true);
        });

        describe('CALLBACKS', function() {
            var notifierMock;

            beforeEach(function() {
                notifierMock = sinon.mock(rgiNotifier);
            });

            it('shows a notification on success', function() {
                notifierMock.expects('notify').withArgs('Justification changed');
                callbacks.success();
            });

            it('shows an error message on failure', function() {
                var ERROR_MESSAGE = 'error message';
                notifierMock.expects('error').withArgs(ERROR_MESSAGE);
                callbacks.failure(ERROR_MESSAGE);
            });

            afterEach(function() {
                notifierMock.verify();
                notifierMock.restore();
            });
        });

        afterEach(function() {
            answerMethodUpdateAnswerStub.restore();
        });
    });

    describe('#closeDialog', function() {
        beforeEach(function() {
            $scope.answer.justification = 'modified justification';
            $scope.closeDialog();
        });

        it('closes the dialog', function() {
            $scope.closeThisDialog.called.should.be.equal(true);
        });

        it('restores the original justification', function() {
            $scope.answer.justification.should.be.equal(ORIGINAL_JUSTIFICATION);
        });
    });
});
