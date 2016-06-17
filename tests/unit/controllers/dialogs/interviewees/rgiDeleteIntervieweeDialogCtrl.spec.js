'use strict';

describe('rgiDeleteIntervieweeDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, rgiNotifier, rgiIntervieweeMethodSrvc;

    beforeEach(inject(
        function ($rootScope, $controller, _rgiNotifier_, _rgiIntervieweeMethodSrvc_) {
            rgiNotifier = _rgiNotifier_;
            rgiIntervieweeMethodSrvc = _rgiIntervieweeMethodSrvc_;

            $scope = $rootScope.$new();
            $controller('rgiDeleteIntervieweeDialogCtrl', {$scope: $scope});
        }
    ));

    describe('#deleteInterviewee', function() {
        var intervieweeMethodDeleteIntervieweeStub, mocks = {}, spies = {}, INTERVIEWEE_ID = 'INTERVIEWEE ID',
            setIntervieweeMethodDeleteIntervieweeStub = function(callback) {
                spies.intervieweeMethodDeleteInterviewee = sinon.spy(function() {
                    return {then: callback};
                });
                intervieweeMethodDeleteIntervieweeStub = sinon.stub(rgiIntervieweeMethodSrvc, 'deleteInterviewee',
                    spies.intervieweeMethodDeleteInterviewee);
            };

        beforeEach(function() {
            mocks.notifier = sinon.mock(rgiNotifier);
            $scope.interviewee = {_id: INTERVIEWEE_ID};
            $scope.interviewees = [{_id: 'FIRST INTERVIEWEE ID'}, {_id: INTERVIEWEE_ID}, {_id: 'LAST INTERVIEWEE ID'}];
        });

        describe('SUCCESS CASE', function() {
            beforeEach(function() {
                setIntervieweeMethodDeleteIntervieweeStub(function(callback) {
                    callback();
                });

                mocks.notifier.expects('notify').withArgs('The interviewee has been deleted');
                $scope.closeThisDialog = sinon.spy();
                $scope.deleteInterviewee();
            });

            it('closes the dialog', function() {
                $scope.closeThisDialog.called.should.be.equal(true);
            });

            it('removes the interviewee from the list', function() {
                $scope.interviewees.should.deep.equal([{_id: 'FIRST INTERVIEWEE ID'}, {_id: 'LAST INTERVIEWEE ID'}]);
            });

            it('shows a confirmation message', function() {
                mocks.notifier.verify();
            });
        });

        it('shows an error message in case of a failure', function() {
            var FAILURE_REASON = 'FAILURE REASON';
            mocks.notifier.expects('error').withArgs(FAILURE_REASON);

            setIntervieweeMethodDeleteIntervieweeStub(function(callbackSuccess, callbackFailure) {
                callbackFailure(FAILURE_REASON);
            });

            $scope.deleteInterviewee();
            mocks.notifier.verify();
        });

        afterEach(function() {
            spies.intervieweeMethodDeleteInterviewee.withArgs(INTERVIEWEE_ID).called.should.be.equal(true);
            intervieweeMethodDeleteIntervieweeStub.restore();

            Object.keys(mocks).forEach(function(mockName) {
                mocks[mockName].restore();
            });
        });
    });
});
