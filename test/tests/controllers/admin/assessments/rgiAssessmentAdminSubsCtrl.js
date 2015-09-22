'use strict';
/*jslint nomen: true newcap: true */
var describe, beforeEach, afterEach, it, inject, expect, sinon;

//TODO roll into list ctrl tests
describe('rgiAssessmentAdminSubsCtrl', function () {
    beforeEach(module('app'));

    //var $scope, $routeParams, ngDialog, rgiAssessmentSrvc, rgiUserListSrvc;
    //var $routeParamsVersion, version = '2015-b';
    //var assessmentQueryStub, assessmentQuerySpy, userListGetStub;
    //
    //beforeEach(inject(
    //    function ($rootScope, $controller, _$routeParams_, _ngDialog_, _rgiAssessmentSrvc_, _rgiUserListSrvc_) {
    //        $routeParams = _$routeParams_;
    //        ngDialog = _ngDialog_;
    //        rgiAssessmentSrvc = _rgiAssessmentSrvc_;
    //        rgiUserListSrvc = _rgiUserListSrvc_;
    //
    //        userListGetStub = sinon.stub(rgiUserListSrvc, 'get', function(user) {
    //            var userMap = {
    //                editor: 'Editor',
    //                researcher: 'Researcher',
    //                reviewer: 'Reviewer'
    //            };
    //            return userMap[user._id];
    //        });
    //
    //        assessmentQuerySpy = sinon.spy(function(assessmentData, callback) {
    //            callback([
    //                {
    //                    assessment_ID: 'assessment-short',
    //                    country: 'country-short',
    //                    researcher_ID: 'researcher-short',
    //                    start_date: 'date-short',
    //                    version: 'version-short',
    //                    year: 'year-short',
    //                    status: 'status-short',
    //                    modified: []
    //                },
    //                {
    //                    assessment_ID: 'assessment',
    //                    country: 'country',
    //                    researcher_ID: 'researcher',
    //                    reviewer_ID: 'reviewer',
    //                    start_date: 'date',
    //                    version: 'version',
    //                    year: 'year',
    //                    status: 'status',
    //                    modified: [{modified_by: 'editor'}]
    //                }
    //            ]);
    //        });
    //        assessmentQueryStub = sinon.stub(rgiAssessmentSrvc, 'query', assessmentQuerySpy);
    //
    //        $routeParamsVersion = $routeParams.version;
    //        $routeParams.version = version;
    //
    //        $scope = $rootScope.$new();
    //        $controller('rgiAssessmentAdminSubsCtrl', {$scope: $scope});
    //    }
    //));
    //
    //it('initializes sorting options', function () {
    //    _.isEqual($scope.sort_options, [
    //        {value: 'country', text: 'Sort by Country'},
    //        {value: 'start_date', text: 'Date started'},
    //        {value: 'status', text: 'Status'},
    //        {value: 'year', text: 'Year of assessment'},
    //        {value: 'version', text: 'Version'}
    //    ]).should.be.equal(true);
    //});

    //it('initializes sorting order', function () {
    //    $scope.sort_order.should.be.equal('country');
    //});
    //
    //it('loads assessment data', function () {
    //    assessmentQuerySpy.withArgs({year: '2015', version: 'b'}).called.should.be.equal(true);
    //    _.isEqual($scope.assessments, [
    //        {
    //            assessment_ID: 'assessment-short',
    //            country: 'country-short',
    //            researcher_ID: 'researcher-short',
    //            reviewer_ID: undefined,
    //            start_date: 'date-short',
    //            version: 'version-short',
    //            year: 'year-short',
    //            status: 'status-short'
    //        },
    //        {
    //            assessment_ID: 'assessment',
    //            country: 'country',
    //            researcher_ID: 'researcher',
    //            reviewer_ID: 'reviewer',
    //            start_date: 'date',
    //            version: 'version',
    //            year: 'year',
    //            status: 'status',
    //            modified: [{modified_by: 'editor'}],
    //            edited_by: 'Editor',
    //            reviewer: 'Reviewer',
    //            researcher: 'Researcher'
    //        }
    //    ]).should.be.equal(true);
    //});
    //
    //describe('#newAssessmentDialog', function() {
    //    it('calls dialog service with defined parameters', function() {
    //        var ngDialogMock = sinon.mock(ngDialog);
    //        ngDialogMock.expects('open').withArgs({
    //            template: 'partials/admin/assessments/new-assessment-dialog',
    //            controller: 'assessmentDialogCtrl',
    //            className: 'ngdialog-theme-plain',
    //            scope: $scope
    //        });
    //
    //        $scope.newAssessmentDialog();
    //
    //        $scope.value.should.be.equal(true);
    //        ngDialogMock.verify();
    //        ngDialogMock.restore();
    //    });
    //});
    //
    //afterEach(function () {
    //    userListGetStub.restore();
    //    assessmentQueryStub.restore();
    //    $routeParams.version = $routeParamsVersion;
    //});
});
