'use strict';

describe('rgiEditIntervieweeDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, $route, ngDialog, rgiIdentitySrvc, rgiNotifier, rgiIntervieweeMethodSrvc,
        identitySrvcCurrentUserBackup, CURRENT_USER = 'CURRENT USER', INTERVIEWEE = 'INTERVIEWEE', mocks = {};

    beforeEach(inject(
        function ($rootScope, $controller, _$route_, _ngDialog_, _rgiIdentitySrvc_, _rgiNotifier_, _rgiIntervieweeMethodSrvc_) {
            $route = _$route_;
            ngDialog = _ngDialog_;
            rgiIdentitySrvc = _rgiIdentitySrvc_;
            rgiNotifier = _rgiNotifier_;
            rgiIntervieweeMethodSrvc = _rgiIntervieweeMethodSrvc_;

            identitySrvcCurrentUserBackup = _.clone(rgiIdentitySrvc.currentUser);
            rgiIdentitySrvc.currentUser = CURRENT_USER;

            $scope = $rootScope.$new();
            $scope.$parent = {interviewee: INTERVIEWEE};

            $controller('rgiEditIntervieweeDialogCtrl', {$scope: $scope});
        }
    ));

    it('sets the current user data', function() {
        $scope.current_user.should.be.equal(CURRENT_USER);
    });

    it('sets the interviewee data', function() {
        $scope.new_interviewee_data.should.be.equal(INTERVIEWEE);
    });

    it('sets the available interviewee type list', function() {
        $scope.roles.should.deep.equal(['government', 'cso', 'industry', 'expert', 'other']);
    });

    describe('#closeDialog', function() {
        it('closes the dialog', function() {
            mocks.dialog = sinon.mock(ngDialog);
            mocks.dialog.expects('close');
            $scope.closeDialog();
            mocks.dialog.verify();
        });
    });

    describe('#intervieweeSave', function() {
        var intervieweeMethodUpdateIntervieweeStub, spies = {}, INTERVIEWEE = 'INTERVIEWEE',
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

                mocks.dialog = sinon.mock(ngDialog);
                mocks.dialog.expects('close');

                mocks.notifier.expects('notify').withArgs('Interviewee has been updated');
                $scope.intervieweeSave(INTERVIEWEE);
            });

            it('closes the dialog', function() {
                mocks.dialog.verify();
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

            $scope.intervieweeSave(INTERVIEWEE);
            mocks.notifier.verify();
        });
    });

    afterEach(function() {
        rgiIdentitySrvc.currentUser = identitySrvcCurrentUserBackup;

        Object.keys(mocks).forEach(function(mockName) {
            mocks[mockName].restore();
        });
    });
});
