'use strict';

describe('rgiResubmitAssessmentConfirmationDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, $location, rgiNotifier, rgiAssessmentMethodSrvc;

    beforeEach(inject(
        function ($rootScope, $controller, _$location_, _rgiNotifier_, _rgiAssessmentMethodSrvc_) {
            $location = _$location_;
            rgiNotifier = _rgiNotifier_;
            rgiAssessmentMethodSrvc = _rgiAssessmentMethodSrvc_;

            $scope = $rootScope.$new();
            $controller('rgiResubmitAssessmentConfirmationDialogCtrl', {$scope: $scope});
        }
    ));

    describe('#resubmitAssessment', function() {
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
        });

        describe('SUCCESS CASE', function() {
            beforeEach(function() {
                setAssessmentMethodUpdateAssessmentStub(function(callback) {
                    callback();
                });

                mocks.$location = sinon.mock($location);
                mocks.$location.expects('path').withArgs('/assessments');

                $scope.closeThisDialog = sinon.spy();
                mocks.notifier.expects('notify').withArgs('Assessment submitted!');
                $scope.resubmitAssessment();
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
            $scope.resubmitAssessment();
            mocks.notifier.verify();
        });

        afterEach(function() {
            Object.keys(mocks).forEach(function(mockName) {
                mocks[mockName].restore();
            });
        });
    });
});
