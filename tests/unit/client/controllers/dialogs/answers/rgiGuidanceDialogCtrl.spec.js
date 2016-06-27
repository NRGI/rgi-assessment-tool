'use strict';

describe('rgiGuidanceDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, answerMethodUpdateSpy, notifierMock, GUIDANCE_TEXT = 'GUIDANCE TEXT', REASON = 'REASON';

    beforeEach(inject(
        function (
            $controller,
            $rootScope,
            rgiAnswerMethodSrvc,
            rgiNotifier
        ) {
            $scope = $rootScope.$new();
            $scope.closeThisDialog = sinon.spy();

            $scope.$parent = {
                answer: {},
                question: {question_guidance_text: GUIDANCE_TEXT}
            };

            answerMethodUpdateSpy = sinon.spy(function() {
                return {catch: function(callback) {
                    callback(REASON);
                }};
            });
            var answerMethodUpdateStub = sinon.stub(rgiAnswerMethodSrvc, 'updateAnswer', answerMethodUpdateSpy);

            notifierMock = sinon.mock(rgiNotifier);
            notifierMock.expects('notify').withArgs(REASON);

            $controller('rgiGuidanceDialogCtrl', {$scope: $scope});

            answerMethodUpdateStub.restore();
            notifierMock.restore();
        }
    ));

    it('resets show guidance flag', function() {
        $scope.$parent.answer.guidance_dialog.should.be.equal(false);
    });

    it('updates the answer data', function() {
        answerMethodUpdateSpy.withArgs($scope.$parent.answer).called.should.be.equal(true);
    });

    describe('FAILURE PROCESSING', function() {
        it('closes the dialog', function() {
            $scope.closeThisDialog.called.should.be.equal(true);
        });

        it('shows the error message', function() {
            notifierMock.verify();
        });
    });
});
