'use strict';

describe('rgiEditIntervieweeDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, $route, rgiNotifier, rgiIntervieweeMethodSrvc, INTERVIEWEE = 'INTERVIEWEE';

    beforeEach(inject(
        function ($rootScope, $controller, _$route_, _rgiNotifier_, _rgiIntervieweeMethodSrvc_) {
            $route = _$route_;
            rgiNotifier = _rgiNotifier_;
            rgiIntervieweeMethodSrvc = _rgiIntervieweeMethodSrvc_;

            $scope = $rootScope.$new();
            $scope.$parent = {interviewee: INTERVIEWEE};
            $controller('rgiEditIntervieweeDialogCtrl', {$scope: $scope});
        }
    ));

    it('sets the interviewee data', function() {
        $scope.new_interviewee_data.should.be.equal(INTERVIEWEE);
    });

    it('sets the available interviewee type list', function() {
        $scope.roles.should.deep.equal(['government', 'cso', 'industry', 'expert', 'other']);
    });

    describe('#saveInterviewee', function() {
        var intervieweeMethodUpdateIntervieweeStub, mocks = {}, spies = {}, INTERVIEWEE = 'INTERVIEWEE',
            setUpStub = function(callback) {
                spies.intervieweeMethodUpdateInterviewee = sinon.spy(function() {
                    return {then: callback};
                });
                intervieweeMethodUpdateIntervieweeStub = sinon.stub(rgiIntervieweeMethodSrvc, 'updateInterviewee',
                    spies.intervieweeMethodUpdateInterviewee);
            };

        beforeEach(function() {
            mocks.notifier = sinon.mock(rgiNotifier);
        });

        describe('SUCCESS CASE', function() {
            beforeEach(function() {
                setUpStub(function(callback) {
                    callback();
                });

                $scope.closeThisDialog = sinon.spy();
                mocks.notifier.expects('notify').withArgs('Interviewee has been updated');
                $scope.saveInterviewee(INTERVIEWEE);
            });

            it('closes the dialog', function() {
                $scope.closeThisDialog.called.should.be.equal(true);
            });

            it('shows a confirmation message', function() {
                mocks.notifier.verify();
            });
        });

        it('shows the failure reason in case of a failure', function() {
            var FAILURE_REASON = 'FAILURE REASON';
            mocks.notifier.expects('error').withArgs(FAILURE_REASON);

            setUpStub(function(callbackSuccess, callbackFailure) {
                callbackFailure(FAILURE_REASON);
            });

            $scope.saveInterviewee(INTERVIEWEE);
            mocks.notifier.verify();
        });

        afterEach(function() {
            Object.keys(mocks).forEach(function(mockName) {
                mocks[mockName].restore();
            });
        });
    });
});
