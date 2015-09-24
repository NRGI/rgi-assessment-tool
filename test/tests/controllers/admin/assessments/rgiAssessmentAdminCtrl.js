'use strict';
/*jshint -W079 */

var _, describe, beforeEach, afterEach, it, inject, expect, sinon;

describe('rgiAssessmentAdminCtrl', function () {
    beforeEach(module('app'));

    var $scope, $location, $routeParams, ngDialog, rgiNotifier, rgiAssessmentSrvc, rgiAssessmentMethodSrvc, rgiUserListSrvc,
        assessmentQueryStub, assessmentQuerySpy,
        userListGetStub, userListGetSpy,
        assessments = [
            {
                assessment_ID: 'assessment-authorized',
                country: 'country-authorized',
                edit_control: 'edit-control-authorized',
                start_date: 'start-date-authorized',
                version: 'version-authorized',
                year: 'year-authorized',
                status: 'authorized',
                modified: [{modified_by: 'author-id'}]
            },
            {
                assessment_ID: 'assessment-published',
                country: 'country-published',
                edit_control: 'edit-control-published',
                researcher_ID: 'researcher-id',
                reviewer_ID: 'reviewer-id',
                start_date: 'start-date-published',
                version: 'version-published',
                year: 'year-published',
                status: 'published',
                modified: []
            }
        ];

    beforeEach(inject(
        function ($rootScope, _$location_, _$routeParams_, _ngDialog_, _rgiNotifier_, _rgiAssessmentSrvc_, _rgiAssessmentMethodSrvc_, _rgiUserListSrvc_) {
            $scope = $rootScope.$new();
            $location = _$location_;
            $routeParams = _$routeParams_;
            ngDialog = _ngDialog_;
            rgiNotifier = _rgiNotifier_;
            rgiAssessmentSrvc = _rgiAssessmentSrvc_;
            rgiAssessmentMethodSrvc = _rgiAssessmentMethodSrvc_;
            rgiUserListSrvc = _rgiUserListSrvc_;

            userListGetSpy = sinon.spy(function (criterion) {
                var users = {
                    'author-id': 'author',
                    'researcher-id': 'researcher',
                    'reviewer-id': 'reviewer'
                };

                return users[criterion._id];
            });
            userListGetStub = sinon.stub(rgiUserListSrvc, 'get', userListGetSpy);
        }
    ));

    describe('NO route params', function () {
        beforeEach(inject(
            function ($controller) {
                assessmentQuerySpy = sinon.spy(function (callback) {
                    callback(assessments);
                });
                assessmentQueryStub = sinon.stub(rgiAssessmentSrvc, 'query', assessmentQuerySpy);
                $controller('rgiAssessmentAdminCtrl', {$scope: $scope});
            }
        ));

        it('initializes sorting options', function () {
            _.isEqual($scope.sort_options, [
                {value: 'country', text: 'Sort by Country'},
                {value: 'start_date', text: 'Date started'},
                {value: 'status', text: 'Status'},
                {value: 'year', text: 'Year of assessment'},
                {value: 'version', text: 'Version'}
            ]).should.be.equal(true);
        });

        it('initializes sorting order', function () {
            $scope.sort_order.should.be.equal('country');
        });

        it('loads assessment data', function () {
            _.isEqual($scope.assessments, [
                {
                    assessment_ID: 'assessment-authorized',
                    country: 'country-authorized',
                    edit_control: 'edit-control-authorized',
                    researcher_ID: undefined,
                    reviewer_ID: undefined,
                    start_date: 'start-date-authorized',
                    version: 'version-authorized',
                    year: 'year-authorized',
                    status: 'authorized',
                    modified: [{modified_by: 'author-id'}],
                    edited_by: 'author'
                },
                {
                    assessment_ID: 'assessment-published',
                    country: 'country-published',
                    edit_control: 'edit-control-published',
                    researcher_ID: 'researcher-id',
                    reviewer_ID: 'reviewer-id',
                    start_date: 'start-date-published',
                    version: 'version-published',
                    year: 'year-published',
                    status: 'published',
                    researcher: 'researcher',
                    reviewer: 'reviewer'
                }
            ]).should.be.equal(true);
        });

        describe('#assessmentStartReview', function () {
            var assessmentGetStub, assessmentGetSpy, notifierMock,
                assessmentMethodUpdateAssessmentStub, assessmentMethodUpdateAssessmentSpy,
                assessment_ID = 'assessment-id';

            beforeEach(function () {
                /*jshint unused: true*/
                /*jslint unparam: true*/
                assessmentGetSpy = sinon.spy(function (criterion, callback) {
                    callback({});
                });
                /*jshint unused: false*/
                /*jslint unparam: false*/
                assessmentGetStub = sinon.stub(rgiAssessmentSrvc, 'get', assessmentGetSpy);
                notifierMock = sinon.mock(rgiNotifier);
            });

            describe('SUCCESS', function () {
                it('changes the location & shows a notification', function () {
                    assessmentMethodUpdateAssessmentSpy = sinon.spy(function () {
                        return {
                            then: function (callback) {
                                callback();
                            }
                        };
                    });
                    assessmentMethodUpdateAssessmentStub = sinon.stub(rgiAssessmentMethodSrvc, 'updateAssessment', assessmentMethodUpdateAssessmentSpy);
                    var $locationMock = sinon.mock($location);

                    notifierMock.expects('notify').withArgs('Assessment review started!');
                    $locationMock.expects('path').withArgs('/admin/assessment-review/answer-review-edit/' + assessment_ID + '-001');

                    $scope.assessmentStartReview(assessment_ID);
                    $locationMock.verify();
                    $locationMock.restore();
                });
            });

            describe('FAILURE', function () {
                it('changes the location & shows a notification', function () {
                    var reason = 'REASON';

                    assessmentMethodUpdateAssessmentSpy = sinon.spy(function () {
                        /*jshint unused: true*/
                        /*jslint unparam: true*/
                        return {
                            then: function (uselesscallbackSuccess, callbackFailure) {
                                callbackFailure(reason);
                            }
                        };
                    });
                    /*jshint unused: false*/
                    /*jslint unparam: false*/
                    assessmentMethodUpdateAssessmentStub = sinon.stub(rgiAssessmentMethodSrvc, 'updateAssessment', assessmentMethodUpdateAssessmentSpy);

                    notifierMock.expects('error').withArgs(reason);
                    $scope.assessmentStartReview(assessment_ID);
                });
            });

            afterEach(function () {
                assessmentGetSpy.withArgs({assessment_ID: assessment_ID}).called.should.be.equal(true);
                assessmentMethodUpdateAssessmentSpy.withArgs({status: 'under_review'}).called.should.be.equal(true);
                assessmentGetStub.restore();
                assessmentMethodUpdateAssessmentStub.restore();
                notifierMock.verify();
                notifierMock.restore();
            });
        });

        describe('#newAssessmentDialog', function () {
            it('sets the value to TRUE', function () {
                $scope.newAssessmentDialog();
                $scope.value.should.be.equal(true);
            });

            it('opens a dialog', function () {
                var ngDialogMock = sinon.mock(ngDialog);
                ngDialogMock.expects('open').withArgs({
                    template: 'partials/dialogs/new-assessment-dialog',
                    controller: 'rgiNewAssessmentDialogCtrl',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                });

                $scope.newAssessmentDialog();

                ngDialogMock.verify();
                ngDialogMock.restore();
            });
        });

        describe('#assignAssessmentDialog', function () {
            var assessment = {assessment_ID: 'assessment-id'};

            it('sets the value to TRUE', function () {
                $scope.assignAssessmentDialog(assessment);
                $scope.value.should.be.equal(true);
            });

            it('updates the assessment', function () {
                $scope.assignAssessmentDialog(assessment);
                $scope.assessment_update_ID.should.be.equal(assessment.assessment_ID);
            });

            it('opens a dialog', function () {
                var ngDialogMock = sinon.mock(ngDialog);
                ngDialogMock.expects('open').withArgs({
                    template: 'partials/dialogs/assign-assessment-dialog',
                    controller: 'rgiAssignAssessmentDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    scope: $scope
                });

                $scope.assignAssessmentDialog(assessment);

                ngDialogMock.verify();
                ngDialogMock.restore();
            });
        });
    });

    describe('route params set', function () {
        var version = '2015-1', $routeParamsVersion;

        beforeEach(inject(
            function ($controller) {
                /*jshint unused: true*/
                /*jslint unparam: true*/
                assessmentQuerySpy = sinon.spy(function (options, callback) {
                    callback(assessments);
                });
                /*jshint unused: false*/
                /*jslint unparam: false*/
                assessmentQueryStub = sinon.stub(rgiAssessmentSrvc, 'query', assessmentQuerySpy);

                $routeParamsVersion = $routeParams.version;
                $routeParams.version = version;

                $controller('rgiAssessmentAdminCtrl', {$scope: $scope});
            }
        ));

        it('loads assessment data', function () {
            _.isEqual($scope.assessments, [
                {
                    assessment_ID: 'assessment-authorized',
                    country: 'country-authorized',
                    researcher_ID: undefined,
                    reviewer_ID: undefined,
                    start_date: 'start-date-authorized',
                    version: 'version-authorized',
                    year: 'year-authorized',
                    status: 'authorized',
                    modified: [{modified_by: 'author-id'}],
                    edited_by: 'author'
                },
                {
                    assessment_ID: 'assessment-published',
                    country: 'country-published',
                    researcher_ID: 'researcher-id',
                    reviewer_ID: 'reviewer-id',
                    start_date: 'start-date-published',
                    version: 'version-published',
                    year: 'year-published',
                    status: 'published',
                    researcher: 'researcher',
                    reviewer: 'reviewer'
                }
            ]).should.be.equal(true);

            assessmentQuerySpy.withArgs({year: '2015', version: '1'}).called.should.be.equal(true);
        });

        afterEach(function () {
            $routeParams.version = $routeParamsVersion;
        });
    });

    afterEach(function () {
        assessmentQueryStub.restore();
        userListGetStub.restore();
    });
});
