'use strict';

describe('rgiMoveAssessmentDialogCtrl', function () {
    beforeEach(module('app'));
    var $scope, rgiDialogFactory, userGetSpy, userGetStub,
        profile = {
            firstName: 'Current User First Name',
            lastName: 'Current User Last Name'
        },
        researcher = {
            firstName: 'Researcher First Name',
            lastName: 'Researcher Last Name',
            role: 'Researcher'
        },
        reviewer = {
            firstName: 'Reviewer First Name',
            lastName: 'Reviewer Last Name',
            role: 'Reviewer'
        },
        initializeController = function(firstPass, status, role, counters) {
            beforeEach(inject(
                function ($rootScope, $controller, _rgiDialogFactory_, rgiUserSrvc) {
                    rgiDialogFactory = _rgiDialogFactory_;
                    $scope = $rootScope.$new();
                    profile.role = role;

                    $scope.$parent = {
                        assessment: {
                            edit_control: 'CURRENT USER ID',
                            first_pass: firstPass,
                            status: status
                        },
                        assessment_counters: counters
                    };

                    if(role === 'researcher') {
                        $scope.$parent.assessment.reviewer_ID = reviewer;
                    } else if(role === 'reviewer') {
                        $scope.$parent.assessment.researcher_ID = researcher;
                    }

                    userGetSpy = sinon.spy(function(criteria, callback) {
                        callback(profile);
                    });
                    userGetStub = sinon.stub(rgiUserSrvc, 'get', userGetSpy);

                    $controller('rgiMoveAssessmentDialogCtrl', {$scope: $scope});

                    userGetSpy.withArgs({_id: $scope.$parent.assessment.edit_control}).called.should.be.equal(true);
                    userGetStub.restore();
                }
            ));
        },
        getUserInfo = function(user) {
            return user.firstName + ' ' + user.lastName + ' (' + user.role + ')';
        },
        getOption = function(text, value) {
            return {text: text, value: value};
        };

    describe('initialization', function() {
        describe('status: trial_submitted', function() {
            describe('flagged: 0, finalized < length', function() {
                initializeController(false, 'trial_submitted', 'researcher', {
                    approved: 0,
                    finalized: 0,
                    flagged: 0,
                    length: 10
                });

                it('has no workflow options', function () {
                    $scope.workflow_opts.should.deep.equal([]);
                });
            });

            describe('flagged: 0, approved == length', function() {
                initializeController(false, 'trial_submitted', 'researcher', {
                    approved: 10,
                    finalized: 0,
                    flagged: 0,
                    length: 10
                });

                it('has a `Allow to continue assessment` workflow option only', function () {
                    $scope.workflow_opts.should.deep.equal([
                        getOption('Allow ' + getUserInfo(profile) + ' to continue assessment.', 'assigned_' + profile.role)
                    ]);
                });
            });

            describe('flagged: 0, finalized == length', function() {
                initializeController(false, 'trial_submitted', 'researcher', {
                    approved: 0,
                    finalized: 10,
                    flagged: 0,
                    length: 10
                });

                it('has a `Approve assessment` workflow option only', function () {
                    $scope.workflow_opts.should.deep.equal([
                        getOption('Approve assessment', 'approved')
                    ]);
                });
            });

            describe('flagged > 0', function() {
                initializeController(false, 'trial_submitted', 'researcher', {
                    approved: 1,
                    finalized: 0,
                    flagged: 1,
                    length: 10
                });

                it('has a `Send back for review` workflow option only', function () {
                    $scope.workflow_opts.should.deep.equal([
                        getOption('Send back to ' + getUserInfo(profile) + ' for review.', profile.role + '_trial')
                    ]);
                });
            });
        });

        describe('status: approved', function() {
            describe('flagged > 0', function() {
                initializeController(false, 'approved', 'researcher', {
                    approved: 0,
                    finalized: 0,
                    flagged: 1,
                    length: 10
                });

                it('has 4 workflow options', function () {
                    $scope.workflow_opts.should.deep.equal([
                        getOption('Send back to ' + getUserInfo(profile) + ' for review.', 'review_' + profile.role),
                        getOption('Move to internal review', 'internal_review'),
                        getOption('Move to external review', 'external_review'),
                        getOption('Final approval', 'final_approval')
                    ]);
                });
            });

            describe('flagged == 0, current user is not researcher / reviewer', function() {
                initializeController(false, 'approved', 'supervisor', {
                    approved: 0,
                    finalized: 0,
                    flagged: 0,
                    length: 10
                });

                it('has 4 workflow options', function () {
                    $scope.workflow_opts.should.deep.equal([
                        getOption('Send back to ' + getUserInfo(profile) + ' for review.', 'review_' + profile.role),
                        getOption('Move to internal review', 'internal_review'),
                        getOption('Move to external review', 'external_review'),
                        getOption('Final approval', 'final_approval')
                    ]);
                });
            });

            describe('flagged == 0, current user is reviewer', function() {
                initializeController(false, 'approved', 'reviewer', {
                    approved: 0,
                    finalized: 0,
                    flagged: 0,
                    length: 10
                });

                it('has 5 workflow options', function () {
                    $scope.workflow_opts.should.deep.equal([
                        getOption('Send back to ' + getUserInfo(profile) + ' for review.', 'review_' + profile.role),
                        getOption('Move to ' + getUserInfo(researcher) + '.', 'assigned_' + researcher.role),
                        getOption('Move to internal review', 'internal_review'),
                        getOption('Move to external review', 'external_review'),
                        getOption('Final approval', 'final_approval')
                    ]);
                });
            });

            describe('flagged == 0, current user is researcher, first_pass: false', function() {
                initializeController(false, 'approved', 'researcher', {
                    approved: 0,
                    finalized: 0,
                    flagged: 0,
                    length: 10
                });

                it('has 5 workflow options', function () {
                    $scope.workflow_opts.should.deep.equal([
                        getOption('Send back to ' + getUserInfo(profile) + ' for review.', 'review_' + profile.role),
                        getOption('Move to ' + getUserInfo(reviewer) + '.', 'assigned_' + reviewer.role),
                        getOption('Move to internal review', 'internal_review'),
                        getOption('Move to external review', 'external_review'),
                        getOption('Final approval', 'final_approval')
                    ]);
                });
            });

            describe('flagged == 0, current user is researcher, first_pass: true', function() {
                initializeController(true, 'approved', 'researcher', {
                    approved: 0,
                    finalized: 0,
                    flagged: 0,
                    length: 10
                });

                it('has 5 workflow options', function () {
                    $scope.workflow_opts.should.deep.equal([
                        getOption('Send back to ' + getUserInfo(profile) + ' for review.', 'review_' + profile.role),
                        getOption('Move to ' + getUserInfo(reviewer) + '.', reviewer.role + '_trial'),
                        getOption('Move to internal review', 'internal_review'),
                        getOption('Move to external review', 'external_review'),
                        getOption('Final approval', 'final_approval')
                    ]);
                });
            });
        });
    });

     describe('#moveAssessment', function () {
         var ngDialogMock,
             checkMoveAssessment = function(action, expectedResubmittedValue) {
                 $scope.action = action;
                 $scope.moveAssessment();
                 $scope.$parent.assessment.resubmitted.should.be.equal(expectedResubmittedValue);
             };

         initializeController(false, false, 'unknown', 'researcher', {
             approved: 0,
             finalized: 0,
             flagged: 0,
             length: 0
         });

         beforeEach(function() {
             ngDialogMock = sinon.mock(rgiDialogFactory);
             ngDialogMock.expects('assessmentMoveConfirm').withArgs($scope);
         });

         it('just opens a dialog without the `resubmitted` flag modification', function () {
             var NOT_MODIFIED = 'not modified';
             $scope.$parent.assessment.resubmitted = NOT_MODIFIED;
             checkMoveAssessment('no-resubmitted-flag-modification', NOT_MODIFIED);
         });

         it('sets the `resubmitted` flag if a trial assessment returned back for review', function () {
             checkMoveAssessment('researcher_trial', true);
         });

         it('sets the `resubmitted` flag if a full assessment returned back for review', function () {
             checkMoveAssessment('review_researcher', true);
         });

         it('sets the `resubmitted` flag if a full assessment returned back for review', function () {
             checkMoveAssessment('assigned_researcher', false);
         });

         afterEach(function() {
             ngDialogMock.verify();
             ngDialogMock.restore();
         });
     });
});
