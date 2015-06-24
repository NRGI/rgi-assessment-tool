'use strict';
/*jslint nomen: true newcap: true */
var describe, beforeEach, afterEach, it, inject, expect, sinon;

describe('rgiAssessmentAdminReviewCtrl', function () {
    beforeEach(module('app'));

    var $scope, $routeParams, ngDialog, rgiAnswerSrvc, rgiAssessmentSrvc, rgiUserListSrvc;
    var assessment_ID = 'assessment_ID', $routeParamsAssessment_ID;
    var answerQueryStub, answerQuerySpy;
    var userListGetStub, userListGetSpy;
    var assessmentGetStub, assessmentGetSpy;

    var assessment = {
        reviewer_ID: 'reviewer',
        researcher_ID: 'researcher',
        assignment: {
            assigned_by: 'assignee'
        },
        modified: [{
            modified_by: 'modifier'
        }],
        assessment_ID: 'assessment'
    };

    beforeEach(inject(
        function ($rootScope, $controller, _$routeParams_, _ngDialog_, _rgiAnswerSrvc_, _rgiAssessmentSrvc_, _rgiUserListSrvc_) {
            $routeParams = _$routeParams_;
            ngDialog = _ngDialog_;
            rgiAnswerSrvc = _rgiAnswerSrvc_;
            rgiAssessmentSrvc = _rgiAssessmentSrvc_;
            rgiUserListSrvc = _rgiUserListSrvc_;

            answerQuerySpy = sinon.spy(function() {
                return 'QUESTION LIST';
            });
            answerQueryStub = sinon.stub(rgiAnswerSrvc, 'query', answerQuerySpy);

            userListGetSpy = sinon.spy(function(object) {
                var dataMap = {
                    reviewer: 'REVIEWER',
                    researcher: 'RESEARCHER',
                    assignee: 'ASSIGNEE',
                    modifier: 'MODIFIER'
                };

                return dataMap[object._id];
            });
            userListGetStub = sinon.stub(rgiUserListSrvc, 'get', userListGetSpy);

            assessmentGetSpy = sinon.spy(function(uselessAssessmentParams, callback) {
                callback(assessment);
            });
            assessmentGetStub = sinon.stub(rgiAssessmentSrvc, 'get', assessmentGetSpy);

            $routeParamsAssessment_ID = $routeParams.assessment_ID;
            $routeParams.assessment_ID = assessment_ID;
            $scope = $rootScope.$new();
            $controller('rgiAssessmentAdminReviewCtrl', {$scope: $scope});
        }
    ));

    it('initializes sorting options', function () {
        _.isEqual($scope.sort_options, [
            {value: "question_order", text: "Sort by Question Number"},
            {value: "component_id", text: "Sort by Component"},
            {value: "status", text: "Sort by Status"}
        ]).should.be.equal(true);
    });

    it('initializes sorting order', function () {
        $scope.sort_order.should.be.equal('question_order');
    });

    it('loads assessment data', function () {
        $scope.assessment.question_list.should.be.equal('QUESTION LIST');
        $scope.assessment.edited_by.should.be.equal('MODIFIER');
        $scope.assessment.assigned_by.should.be.equal('ASSIGNEE');
        $scope.assessment.researcher.should.be.equal('RESEARCHER');
        $scope.assessment.reviewer.should.be.equal('REVIEWER');

        $scope.assessment.assessment_ID.should.be.equal('assessment');
        $scope.assessment.reviewer_ID.should.be.equal('reviewer');
        $scope.assessment.researcher_ID.should.be.equal('researcher');

        _.isEqual($scope.assessment.assignment, {assigned_by: 'assignee'}).should.be.equal(true);
        _.isEqual($scope.assessment.modified, [{modified_by: 'modifier'}]).should.be.equal(true);
        assessmentGetSpy.withArgs({assessment_ID: assessment_ID}).called.should.be.equal(true);
    });

    describe('#moveAssessmentDialog', function() {
        it('calls dialog service with defined parameters', function() {
            var ngDialogMock = sinon.mock(ngDialog);
            ngDialogMock.expects('open').withArgs({
                template: 'partials/admin/assessments/move-assessment-dialog',
                controller: 'rgiMoveAssessmentDialogCtrl',
                className: 'ngdialog-theme-plain',
                scope: $scope
            });

            $scope.moveAssessmentDialog();

            $scope.value.should.be.equal(true);
            ngDialogMock.verify();
            ngDialogMock.restore();
        });
    });

    afterEach(function () {
        answerQueryStub.restore();
        userListGetStub.restore();
        assessmentGetStub.restore();
        $routeParams.assessment_ID = $routeParamsAssessment_ID;
    });
});