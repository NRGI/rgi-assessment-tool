'use strict';

describe('rgiResubmitAssessmentConfirmationDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, $location, ngDialog, rgiIdentitySrvc, rgiNotifier, rgiAssessmentMethodSrvc,
        identityCurrentUserBackup, CURRENT_USER = 'CURRENT USER', mocks = {};

    beforeEach(inject(
        function ($rootScope, $controller, _$location_, _ngDialog_, _rgiIdentitySrvc_, _rgiNotifier_, _rgiAssessmentMethodSrvc_) {
            $location = _$location_;
            ngDialog = _ngDialog_;
            rgiIdentitySrvc = _rgiIdentitySrvc_;
            rgiNotifier = _rgiNotifier_;
            rgiAssessmentMethodSrvc = _rgiAssessmentMethodSrvc_;

            identityCurrentUserBackup = _.clone(rgiIdentitySrvc.currentUser);
            rgiIdentitySrvc.currentUser = CURRENT_USER;

            $scope = $rootScope.$new();
            $controller('rgiResubmitAssessmentConfirmationDialogCtrl', {$scope: $scope});
        }
    ));

    it('sets current user data', function() {
        $scope.current_user.should.be.equal(CURRENT_USER);
    });

    describe('#assessmentResubmit', function() {
        var assessmentMethodUpdateAssessmentSpy, assessmentMethodUpdateAssessmentStub,
            setAssessmentMethodUpdateAssessmentStub = function(callback) {
                assessmentMethodUpdateAssessmentSpy = sinon.spy(function() {
                    return {then: callback};
                });

                assessmentMethodUpdateAssessmentStub = sinon.stub(rgiAssessmentMethodSrvc, 'updateAssessment',
                    assessmentMethodUpdateAssessmentSpy);
            };

        beforeEach(function() {
            mocks.notifier = sinon.mock(rgiNotifier);
            $scope.$parent = {assessment: {}};
        });

        describe('SUCCESS CASE', function() {
            beforeEach(function() {
                setAssessmentMethodUpdateAssessmentStub(function(callback) {
                    callback();
                });

                mocks.$location = sinon.mock($location);
                mocks.$location.expects('path').withArgs('/assessments');

                mocks.dialog = sinon.mock(ngDialog);
                mocks.dialog.expects('close');

                mocks.notifier.expects('notify').withArgs('Assessment submitted!');
                $scope.assessmentResubmit();
            });

            it('closes the dialog', function() {
                mocks.dialog.verify();
            });

            it('redirects to the assessments list page', function() {
                mocks.$location.verify();
            });

            it('shows a notification message', function() {
                mocks.notifier.verify();
            });

            afterEach(function() {
                $scope.$parent.assessment.status.should.be.equal('resubmitted');
                assessmentMethodUpdateAssessmentSpy.withArgs($scope.$parent.assessment).called.should.be.equal(true);
                $scope.$parent.assessment.mail.should.be.equal(true);
            });
        });

        it('shows the failure reason in case of a failure', function() {
            var FAILURE_REASON = 'FAILURE REASON';
            setAssessmentMethodUpdateAssessmentStub(function(callbackSuccess, callbackFailure) {
                callbackFailure(FAILURE_REASON);
            });

            mocks.notifier.expects('error').withArgs(FAILURE_REASON);
            $scope.assessmentResubmit();
            mocks.notifier.verify();
        });
    });

    describe('#closeDialog', function() {
        it('closes the dialog', function() {
            mocks.dialog = sinon.mock(ngDialog);
            mocks.dialog.expects('close');

            $scope.closeDialog();
            mocks.dialog.verify();
        });
    });

    afterEach(function() {
        rgiIdentitySrvc.currentUser = identityCurrentUserBackup;

        Object.keys(mocks).forEach(function(mockName) {
            mocks[mockName].restore();
        });
    });
});
