'use strict';

describe('rgiAssessmentStatusDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, rgiAssessmentMethodSrvc, rgiNotifier,
        ASSESSMENT_ID = 'assessment id', EDIT_CONTROL = 'edit control',
        NEW_STATUS = 'new status', ORIGINAL_STATUS = 'original status';

    beforeEach(inject(
        function ($rootScope, _rgiAssessmentMethodSrvc_, _rgiNotifier_) {
            rgiAssessmentMethodSrvc = _rgiAssessmentMethodSrvc_;
            rgiNotifier = _rgiNotifier_;
            $scope = $rootScope.$new();

            $scope.assessmentId = ASSESSMENT_ID;
            $scope.assessments = [{_id: ASSESSMENT_ID, edit_control: EDIT_CONTROL, status: ORIGINAL_STATUS}];
            $scope.newStatus = NEW_STATUS;
        }
    ));

    describe('RESEARCHER STATUS SELECTED & RESEARCHER IS SET', function() {
        var RESEARCHER_ID = 'researcher id';

        beforeEach(inject(
            function ($controller) {
                $scope.newStatus = 'researcher_assigned';
                $scope.assessments[0].researcher_ID = {_id: RESEARCHER_ID};
                $controller('rgiAssessmentStatusDialogCtrl', {$scope: $scope});
            }
        ));

        it('selects the researcher as edit control', function () {
            $scope.editControl.selected.should.be.equal(RESEARCHER_ID);
        });
    });

    describe('REVIEWER STATUS SELECTED BUT NO REVIEWER IS SET', function() {
        beforeEach(inject(
            function ($controller) {
                $scope.newStatus = 'reviewer_assigned';
                $controller('rgiAssessmentStatusDialogCtrl', {$scope: $scope});
            }
        ));

        it('assigns the default value to the `edit control` flag', function () {
            $scope.editControl.selected.should.be.equal(EDIT_CONTROL);
        });
    });

    describe('CHECK THE AVAILABLE USERS SET', function() {
        var RESEARCHER_ID = 'researcher id', SUPERVISOR_ID = 'supervisor id';

        beforeEach(inject(
            function ($controller) {
                $scope.assessments[0].researcher_ID = {_id: RESEARCHER_ID};
                $scope.assessments[0].supervisor_ID = [{_id: SUPERVISOR_ID}];
                $controller('rgiAssessmentStatusDialogCtrl', {$scope: $scope});
            }
        ));

        it('collects IDs of all assigned users', function () {
            console.log(JSON.stringify($scope.editControl.availableUsers));
            $scope.editControl.availableUsers.should.deep.equal([{_id: SUPERVISOR_ID}, {_id: RESEARCHER_ID}]);
        });
    });

    describe('EDIT CONTROL NOT SELECTED', function() {
        beforeEach(inject(
            function ($controller) {
                $controller('rgiAssessmentStatusDialogCtrl', {$scope: $scope});
            }
        ));

        it('assigns the default value to the `edit control` flag', function () {
            $scope.editControl.selected.should.be.equal(EDIT_CONTROL);
        });

        describe('#setStatus', function () {
            var mocks = {}, spies = {}, stubs = {},
                setUpdateAssessmentStub = function (callback) {
                    spies.assessmentMethodUpdateAssessment = sinon.spy(function () {
                        return {then: callback};
                    });
                    stubs.assessmentMethodUpdateAssessment = sinon.stub(rgiAssessmentMethodSrvc, 'updateAssessment',
                        spies.assessmentMethodUpdateAssessment);
                };

            beforeEach(function () {
                $scope.statuses = {};
                $scope.statuses[ASSESSMENT_ID] = ORIGINAL_STATUS;

                mocks.notifier = sinon.mock(rgiNotifier);
                $scope.closeThisDialog = sinon.spy();
            });

            describe('SUCCESS CASE', function () {
                beforeEach(function () {
                    setUpdateAssessmentStub(function (callback) {
                        callback();
                        return {
                            finally: function (finalCallback) {
                                finalCallback();
                            }
                        };
                    });
                });

                describe('REVIEWER STATUS', function () {
                    beforeEach(function () {
                        $scope.newStatus = 'reviewer_trial';
                    });

                    it('sets the `edit_control` assessment field if a reviewer is assigned to the assessment', function () {
                        $scope.assessments[0].reviewer_ID = 'REVIEWER';
                        $scope.editControl.selected = $scope.assessments[0].reviewer_ID;
                        $scope.setStatus();
                        $scope.assessments[0].edit_control.should.be.equal($scope.assessments[0].reviewer_ID);
                    });

                    it('does not modify the `edit_control` assessment field if no reviewer is assigned to it', function () {
                        $scope.assessments[0].reviewer_ID = undefined;
                        $scope.setStatus();
                        $scope.assessments[0].edit_control.should.be.equal(EDIT_CONTROL);
                    });
                });

                describe('NOT REVIEWER STATUS', function () {
                    beforeEach(function () {
                        mocks.notifier.expects('notify').withArgs('Status changed!');
                        $scope.newStatus = 'NEW STATUS';
                        $scope.setStatus();
                    });

                    it('updates the assessment status', function () {
                        $scope.assessments[0].status.should.be.equal($scope.newStatus);
                        $scope.statuses[ASSESSMENT_ID].should.be.equal($scope.newStatus);
                    });

                    it('shows successful notification', function () {
                        mocks.notifier.verify();
                    });

                    it('does not modify the `edit_control` assessment field', function () {
                        $scope.assessments[0].edit_control.should.be.equal(EDIT_CONTROL);
                    });
                });
            });

            describe('FAILURE CASE', function () {
                var FAILURE_REASON = 'FAILURE REASON';

                beforeEach(function () {
                    setUpdateAssessmentStub(function (callbackSuccess, callbackFailure) {
                        callbackFailure(FAILURE_REASON);
                        return {
                            finally: function (finalCallback) {
                                finalCallback();
                            }
                        };
                    });

                    mocks.notifier.expects('error').withArgs(FAILURE_REASON);
                    $scope.newStatus = 'NEW STATUS';
                    $scope.setStatus();
                });

                it('leaves the assessment status unmodified', function () {
                    $scope.assessments[0].status.should.be.equal(ORIGINAL_STATUS);
                    $scope.statuses[ASSESSMENT_ID].should.be.equal(ORIGINAL_STATUS);
                });

                it('shows error message', function () {
                    mocks.notifier.verify();
                });
            });

            afterEach(function () {
                $scope.closeThisDialog.called.should.be.equal(true);
                $scope.assessments[0].status = $scope.newStatus;
                spies.assessmentMethodUpdateAssessment.withArgs($scope.assessments[0]).called.should.be.equal(true);

                Object.keys(mocks).forEach(function (mockName) {
                    mocks[mockName].restore();
                });

                Object.keys(stubs).forEach(function (stubName) {
                    stubs[stubName].restore();
                });
            });
        });
    });
});
