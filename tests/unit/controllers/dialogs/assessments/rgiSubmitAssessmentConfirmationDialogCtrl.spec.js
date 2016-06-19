'use strict';

describe('rgiSubmitAssessmentConfirmationDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, $location, ngDialog, rgiNotifier, rgiAssessmentMethodSrvc, mocks = {};

    beforeEach(inject(
        function ($rootScope, $controller, _$location_, _ngDialog_, _rgiNotifier_, _rgiAssessmentMethodSrvc_) {
            $location = _$location_;
            ngDialog = _ngDialog_;
            rgiNotifier = _rgiNotifier_;
            rgiAssessmentMethodSrvc = _rgiAssessmentMethodSrvc_;

            $scope = $rootScope.$new();
            $controller('rgiSubmitAssessmentConfirmationDialogCtrl', {$scope: $scope});
        }
    ));

    describe('#assessmentSubmit', function() {
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
            });

            describe('TRIAL ASSESSMENT', function() {
                beforeEach(function() {
                    $scope.$parent.assessment.status = 'trial_started';
                    $scope.assessmentSubmit();
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
                    $scope.$parent.assessment.status.should.be.equal('trial_submitted');
                });
            });

            it('sets the assessment status to `submitted` for a non-trial assessment', function() {
                $scope.$parent.assessment.status = 'NOT trial_started';
                $scope.assessmentSubmit();
                $scope.$parent.assessment.status.should.be.equal('submitted');
            });

            afterEach(function() {
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
            $scope.assessmentSubmit();
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
        Object.keys(mocks).forEach(function(mockName) {
            mocks[mockName].restore();
        });
    });
});
