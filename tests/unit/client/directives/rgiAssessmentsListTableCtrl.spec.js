'use strict';

describe('rgiAssessmentsListTableCtrl', function () {
    beforeEach(module('app'));

    var $scope, $rootScope, $location, rgiAssessmentSrvc, rgiAssessmentMethodSrvc, rgiDialogFactory,
        rgiHttpResponseProcessorSrvc, rgiIdentitySrvc, rgiNotifier,
        backups = {}, mocks = {}, spies = {}, stubs = {}, callbacks = {}, values = {},
        CURRENT_USER = 'current user',
        ASSESSMENT_STATISTICS = 'assessment statistics', EXTERNAL_THRESHOLD = 'external threshold';

    beforeEach(inject(
        function (_$rootScope_, $controller, _$location_, _rgiAssessmentSrvc_, _rgiAssessmentMethodSrvc_,
                  _rgiDialogFactory_, _rgiHttpResponseProcessorSrvc_, _rgiIdentitySrvc_, _rgiNotifier_) {
            $rootScope = _$rootScope_;
            $location = _$location_;
            rgiAssessmentSrvc = _rgiAssessmentSrvc_;
            rgiAssessmentMethodSrvc = _rgiAssessmentMethodSrvc_;
            rgiDialogFactory = _rgiDialogFactory_;
            rgiHttpResponseProcessorSrvc = _rgiHttpResponseProcessorSrvc_;
            rgiIdentitySrvc = _rgiIdentitySrvc_;
            rgiNotifier = _rgiNotifier_;

            $scope = $rootScope.$new();
            backups.currentUser = rgiIdentitySrvc.currentUser;
            backups.externalThreshold = $rootScope.externalThreshold;

            $rootScope.externalThreshold = EXTERNAL_THRESHOLD;
            rgiIdentitySrvc.currentUser = CURRENT_USER;
            $scope.$parent = {assessmentsStatistics: ASSESSMENT_STATISTICS};

            $controller('rgiAssessmentsListTableCtrl', {$scope: $scope});
        }
    ));

    it('sets the current user', function () {
        $scope.current_user.should.be.equal(CURRENT_USER);
    });

    it('sets the external threshold', function () {
        $scope.externalThreshold.should.be.equal(EXTERNAL_THRESHOLD);
    });

    it('sets the assessments statistics', function () {
        $scope.assessmentsStatistics.should.be.equal(ASSESSMENT_STATISTICS);
    });

    describe('#assessmentStartReview', function () {
        var ASSESSMENT_ID = 'assessment id';

        beforeEach(function () {
            spies.httpResponseProcessorGetDefaultHandler = sinon.spy(function (errorMessage) {
                return errorMessage;
            });

            stubs.assessmentGet = sinon.stub(rgiHttpResponseProcessorSrvc, 'getDefaultHandler',
                spies.httpResponseProcessorGetDefaultHandler);

            spies.assessmentGet = sinon.spy(function (criteria, callback, errorHandler) {
                callbacks.assessmentGet = callback;
                values.assessmentGetErrorHandler = errorHandler;
            });

            stubs.assessmentGet = sinon.stub(rgiAssessmentSrvc, 'get', spies.assessmentGet);
            $scope.assessmentStartReview(ASSESSMENT_ID);
        });

        it('submits a request to get assessment by id', function () {
            spies.assessmentGet.withArgs({assessment_ID: ASSESSMENT_ID}).called.should.be.equal(true);
        });

        it('processes HTTP failures', function () {
            spies.assessmentGet.withArgs({assessment_ID: ASSESSMENT_ID}).called.should.be.equal(true);
        });

        describe('CALLBACK', function() {
            beforeEach(function() {
                spies.assessmentMethodUpdateAssessment = sinon.spy(function() {
                    return {
                        then: function(callbackSuccess, callbackFailure) {
                            callbacks.assessmentMethodUpdateAssessmentSuccess = callbackSuccess;
                            callbacks.assessmentMethodUpdateAssessmentFailure = callbackFailure;
                        }
                    }
                });

                stubs.assessmentMethodUpdateAssessment = sinon.stub(rgiAssessmentMethodSrvc, 'updateAssessment',
                    spies.assessmentMethodUpdateAssessment);
                callbacks.assessmentGet({});
            });

            it('submits a request to update the assessment data', function() {
                spies.assessmentMethodUpdateAssessment.withArgs({status: 'under_review'}).called.should.be.equal(true);
            });

            describe('CALLBACKS', function() {
                beforeEach(function() {
                    mocks.notifier = sinon.mock(rgiNotifier);
                });

                it('shows an error message in case of a failure', function() {
                    var ERROR = 'error';
                    mocks.notifier.expects('error').withArgs(ERROR);
                    callbacks.assessmentMethodUpdateAssessmentFailure(ERROR);
                });

                describe('SUCCESS', function() {
                    it('shows a successful notification', function() {
                        mocks.notifier.expects('notify').withArgs('Assessment review started!');
                    });

                    it('redirects to the first answer page', function() {
                        mocks.$location = sinon.mock($location);
                        mocks.$location.expects('path').withArgs('/admin/assessments-admin/answer/' + ASSESSMENT_ID +
                            '-001');
                    });

                    afterEach(function() {
                        callbacks.assessmentMethodUpdateAssessmentSuccess();
                    });
                });
            });
        });
    });

    describe('#assessmentTrial', function() {
        var ASSESSMENT_ID = 'assessment id';

        beforeEach(function() {
            spies.assessmentMethodUpdateAssessment = sinon.spy(function() {
                return {
                    then: function(callbackSuccess, callbackFailure) {
                        callbacks.assessmentMethodUpdateAssessmentSuccess = callbackSuccess;
                        callbacks.assessmentMethodUpdateAssessmentFailure = callbackFailure;
                    }
                };
            });

            stubs.assessmentMethodUpdateAssessment = sinon.stub(rgiAssessmentMethodSrvc, 'updateAssessment',
                spies.assessmentMethodUpdateAssessment);
            $scope.assessmentTrial({assessment_ID: ASSESSMENT_ID});
        });

        it('submits a request to update the assessment data', function() {
            spies.assessmentMethodUpdateAssessment.withArgs({
                status: 'trial_started',
                assessment_ID: ASSESSMENT_ID
            }).called.should.be.equal(true);
        });

        describe('CALLBACKS', function() {
            beforeEach(function() {
                mocks.notifier = sinon.mock(rgiNotifier);
            });

            it('shows an error message in case of a failure', function() {
                var ERROR = 'error';
                mocks.notifier.expects('error').withArgs(ERROR);
                callbacks.assessmentMethodUpdateAssessmentFailure(ERROR);
            });

            describe('SUCCESS', function() {
                it('shows a successful notification', function() {
                    mocks.notifier.expects('notify').withArgs('Assessment trial started!');
                });

                it('redirects to the assessment details page', function() {
                    mocks.$location = sinon.mock($location);
                    mocks.$location.expects('path').withArgs('/assessments/' + ASSESSMENT_ID);
                });

                afterEach(function() {
                    callbacks.assessmentMethodUpdateAssessmentSuccess();
                });
            });
        });
    });

    describe('#assessmentStart', function() {
        var ASSESSMENT_ID = 'assessment id',
            setCurrentUser = function(isResearcher, isReviewer) {
                $scope.current_user = {
                    isResearcher: function() {
                        return isResearcher;
                    },
                    isReviewer: function() {
                        return isReviewer;
                    }
                };
            };

        beforeEach(function() {
            spies.assessmentMethodUpdateAssessment = sinon.spy(function() {
                return {
                    then: function(callbackSuccess, callbackFailure) {
                        callbacks.assessmentMethodUpdateAssessmentSuccess = callbackSuccess;
                        callbacks.assessmentMethodUpdateAssessmentFailure = callbackFailure;
                    }
                };
            });

            stubs.assessmentMethodUpdateAssessment = sinon.stub(rgiAssessmentMethodSrvc, 'updateAssessment',
                spies.assessmentMethodUpdateAssessment);
        });

        it('sets the status to `researcher_started` for researchers', function() {
            setCurrentUser(true, false);
            $scope.assessmentStart({assessment_ID: ASSESSMENT_ID});
            spies.assessmentMethodUpdateAssessment.withArgs({
                assessment_ID: ASSESSMENT_ID,
                status: 'researcher_started'
            }).called.should.be.equal(true);
        });

        it('sets the status to `reviewer_started` for reviewers', function() {
            setCurrentUser(false, true);
            $scope.assessmentStart({assessment_ID: ASSESSMENT_ID});
            spies.assessmentMethodUpdateAssessment.withArgs({
                assessment_ID: ASSESSMENT_ID,
                status: 'reviewer_started'
            }).called.should.be.equal(true);
        });

        describe('CALLBACKS', function() {
            beforeEach(function() {
                setCurrentUser(false, false);
                mocks.notifier = sinon.mock(rgiNotifier);
                $scope.assessmentStart({assessment_ID: ASSESSMENT_ID});
            });

            it('does not change the status if the user role is not researcher eithernot reviewer', function() {
                spies.assessmentMethodUpdateAssessment.withArgs({assessment_ID: ASSESSMENT_ID}).called.should.be.equal(true);
            });

            it('shows the error reason in case of a failure', function() {
                var ERROR = 'error';
                mocks.notifier.expects('error').withArgs(ERROR);
                callbacks.assessmentMethodUpdateAssessmentFailure(ERROR);
            });

            describe('SUCCESS', function() {
                it('shows a successful notification', function() {
                    mocks.notifier.expects('notify').withArgs('Assessment started!');
                });

                it('redirects to the first answer page', function() {
                    mocks.$location = sinon.mock($location);
                    mocks.$location.expects('path').withArgs('/assessments/answer/' + ASSESSMENT_ID + '-001');
                });

                afterEach(function() {
                    callbacks.assessmentMethodUpdateAssessmentSuccess();
                });
            });
        });
    });

    describe('#isAnyMilestoneStarted', function() {
        var
            setCurrentUser = function(isResearcher, isReviewer, isSupervisor) {
                $scope.current_user = {
                    isResearcher: function() {
                        return isResearcher;
                    },
                    isReviewer: function() {
                        return isReviewer;
                    },
                    isSupervisor: function() {
                        return isSupervisor;
                    }
                };
            },
            check = function(fields, extraCondition, isResearcher, isReviewer, isSupervisor, expectedResult) {
                fields.forEach(function(field) {
                    it('returns `' + expectedResult +'` if the `' + field + '` field is set' + extraCondition, function() {
                        setCurrentUser(isResearcher, isReviewer, isSupervisor);
                        var assessment = {};
                        assessment[field] = true;
                        $scope.isAnyMilestoneStarted(assessment).should.be.equal(expectedResult);
                    });
                });
            };

        check(['assignment_date', 'last_review_date', 'approval_date'], '', false, false, false, true);
        check(['researcher_start_date', 'researcher_submit_date', 'reviewer_start_date', 'reviewer_submit_date'],
            ' and the current user is a supervisor', false, false, true, true);
        check(['researcher_start_date', 'researcher_submit_date'], ' and the current user is a researcher',
            true, false, false, true);
        check(['researcher_start_date', 'researcher_submit_date'], ' and the current user is a reviewer',
            false, true, false, false);
        check(['reviewer_start_date', 'reviewer_submit_date'], ' and the current user is a reviewer',
            false, true, false, true);
        check(['reviewer_start_date', 'reviewer_submit_date'], ' and the current user is a researcher',
            true, false, false, false);

        it('returns `false` if none of the required fields is set', function() {
            setCurrentUser(true, true, true);
            $scope.isAnyMilestoneStarted({}).should.be.equal(false);
        });
    });

    describe('DIALOGS', function() {
        var ASSESSMENT = 'assessment';

        beforeEach(function() {
            mocks.dialogFactory = sinon.mock(rgiDialogFactory);
        });

        describe('#assignAssessmentDialog', function() {
            it('opens a dialog', function() {
                mocks.dialogFactory.expects('assessmentAssign').withArgs($scope, ASSESSMENT);
                $scope.assignAssessmentDialog(ASSESSMENT);
            });
        });

        describe('#assignAssessmentExternalDialog', function() {
            it('opens a dialog', function() {
                mocks.dialogFactory.expects('assessmentExternalAssign').withArgs($scope, ASSESSMENT);
                $scope.assignAssessmentExternalDialog(ASSESSMENT);
            });
        });

        describe('#assignAssessmentSupervisorDialog', function() {
            it('opens a dialog', function() {
                mocks.dialogFactory.expects('assessmentSupervisorAssign').withArgs($scope, ASSESSMENT);
                $scope.assignAssessmentSupervisorDialog(ASSESSMENT);
            });
        });

        describe('#assignAssessmentViewerDialog', function() {
            it('opens a dialog', function() {
                mocks.dialogFactory.expects('assessmentViewerAssign').withArgs($scope, ASSESSMENT);
                $scope.assignAssessmentViewerDialog(ASSESSMENT);
            });
        });

        describe('#reassignAssessmentDialog', function() {
            it('opens a dialog', function() {
                mocks.dialogFactory.expects('assessmentAssign').withArgs($scope, ASSESSMENT);
                $scope.reassignAssessmentDialog(ASSESSMENT);
            });
        });
    });

    afterEach(function () {
        rgiIdentitySrvc.currentUser = backups.currentUser;
        $rootScope.externalThreshold = backups.externalThreshold;

        Object.keys(stubs).forEach(function(stubName) {
            stubs[stubName].restore();
        });

        Object.keys(mocks).forEach(function(mockName) {
            mocks[mockName].restore();
        });
    });
});
