'use strict';

describe('rgiSubmitAssessmentConfirmationDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, $location, rgiNotifier, rgiAssessmentMethodSrvc;

    beforeEach(inject(
        function ($rootScope, $controller, _$location_, _rgiNotifier_, _rgiAssessmentMethodSrvc_) {
            $location = _$location_;
            rgiNotifier = _rgiNotifier_;
            rgiAssessmentMethodSrvc = _rgiAssessmentMethodSrvc_;

            $scope = $rootScope.$new();
            $controller('rgiSubmitAssessmentConfirmationDialogCtrl', {$scope: $scope});
        }
    ));

    describe('#submitAssessment', function() {
        var assessmentMethodUpdateAssessmentSpy, assessmentMethodUpdateAssessmentStub, mocks = {},
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
            $scope.closeThisDialog = sinon.spy();
        });

        describe('SUCCESS CASE', function() {
            beforeEach(function() {
                setAssessmentMethodUpdateAssessmentStub(function(callback) {
                    callback();
                });

                mocks.$location = sinon.mock($location);
                mocks.$location.expects('path').withArgs('/assessments');

                mocks.notifier.expects('notify').withArgs('Assessment submitted!');
            });

            describe('TRIAL ASSESSMENT', function() {
                beforeEach(function() {
                    $scope.$parent.assessment.status = 'trial_started';
                    $scope.submitAssessment();
                });

                it('closes the dialog', function() {
                    $scope.closeThisDialog.called.should.be.equal(true);
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
                $scope.submitAssessment();
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
            $scope.submitAssessment();
            mocks.notifier.verify();
        });

        afterEach(function() {
            Object.keys(mocks).forEach(function(mockName) {
                mocks[mockName].restore();
            });
        });
    });
});
