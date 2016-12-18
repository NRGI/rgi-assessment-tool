'use strict';

describe('rgiDeleteAssessmentDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, $location, $q, rgiNotifier, rgiAssessmentMethodSrvc;

    beforeEach(inject(
        function ($rootScope, $controller, _$location_, _$q_, _rgiNotifier_, _rgiAssessmentMethodSrvc_) {
            $location = _$location_;
            $q = _$q_;
            rgiNotifier = _rgiNotifier_;
            rgiAssessmentMethodSrvc = _rgiAssessmentMethodSrvc_;

            $scope = $rootScope.$new();
            $controller('rgiDeleteAssessmentDialogCtrl', {$scope: $scope});
        }
    ));

    describe('#remove', function() {
        var callbacks = {}, spies = {}, stubs = {},
            ASSESSMENT_ID = 'assessment id';

        beforeEach(function() {
            spies.$qAll = sinon.spy(function() {
                return {then: function(callbackSuccess, callbackFailure) {
                    callbacks.$qAllSuccess = callbackSuccess;
                    callbacks.$qAllFailure = callbackFailure;

                    return {finally: function(finalCallback) {
                        finalCallback();
                    }};
                }};
            });

            stubs.$qAll = sinon.stub($q, 'all', spies.$qAll);

            spies.assessmentMethodUpdateAssessment = sinon.spy(function(assessment) {
                return {$promise: {action: 'update', assessment: assessment.assessment_ID}};
            });

            stubs.assessmentMethodUpdateAssessment = sinon.stub(rgiAssessmentMethodSrvc, 'updateAssessment',
                spies.assessmentMethodUpdateAssessment);

            spies.assessmentMethodDeleteAssessment = sinon.spy(function(assessmentId) {
                return {$promise: {action: 'delete', assessment: assessmentId}};
            });

            stubs.assessmentMethodDeleteAssessment = sinon.stub(rgiAssessmentMethodSrvc, 'deleteAssessment',
                spies.assessmentMethodDeleteAssessment);

            $scope.closeThisDialog = sinon.spy();
            $scope.assessment = {assessment_ID: ASSESSMENT_ID};
            $scope.remove();
        });

        it('closes the dialog', function() {
            $scope.closeThisDialog.called.should.be.equal(true);
        });

        it('marks the assessment as deleted', function() {
            $scope.assessment.deleted.should.be.equal(true);
        });

        it('submits requests to modify the assessment data', function() {
            spies.$qAll.withArgs([
                {action: 'update', assessment: ASSESSMENT_ID},
                {action: 'delete', assessment: ASSESSMENT_ID}
            ]).called.should.be.equal(true);
        });

        describe('CALLBACKS', function() {
            var mocks = {};

            beforeEach(function() {
                mocks.notifier = sinon.mock(rgiNotifier);
            });

            it('shows a notification and redirects to the assessment list on success', function() {
                mocks.$location = sinon.mock($location);
                mocks.$location.expects('path').withArgs('/admin/assessment-admin');
                mocks.notifier.expects('notify').withArgs('The assessment has been deleted');
                callbacks.$qAllSuccess();
            });

            it('shows an error message and restores to the assessment data on failure', function() {
                mocks.notifier.expects('error').withArgs('The assessment removal has been failed');
                callbacks.$qAllFailure();
                $scope.assessment.deleted.should.be.equal(false);
            });

            afterEach(function() {
                Object.keys(mocks).forEach(function(mockName) {
                    mocks[mockName].verify();
                    mocks[mockName].restore();
                });
            });
        });

        afterEach(function() {
            Object.keys(stubs).forEach(function(stubName) {
                stubs[stubName].restore();
            });
        });
    });
});
