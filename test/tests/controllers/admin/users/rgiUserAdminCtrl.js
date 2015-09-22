'use strict';
/*jshint -W079 */

var _, describe, beforeEach, afterEach, it, inject, expect, sinon;

describe('rgiUserAdminCtrl', function () {
    beforeEach(module('app'));
    var $scope, rgiUserSrvc, rgiAssessmentSrvc;

    beforeEach(inject(
        function ($rootScope, $controller, _rgiUserSrvc_, _rgiAssessmentSrvc_) {
            $scope = $rootScope.$new();
            rgiUserSrvc = _rgiUserSrvc_;
            rgiAssessmentSrvc = _rgiAssessmentSrvc_;
            /*jshint unused: true*/
            /*jslint unparam: true*/
            var data = [
                {
                    assessments: [
                        {assessment_ID: 'assessment-0-0'},
                        {assessment_ID: 'assessment-0-1'}
                    ]
                },
                {
                    assessments: [
                        {assessment_ID: 'assessment-1-0'},
                        {assessment_ID: 'assessment-1-1'}
                    ]
                }
            ], userQuerySpy = sinon.spy(function (uselessOptions, callback) {
                callback(data);
            }), userQueryStub = sinon.stub(rgiUserSrvc, 'query', userQuerySpy), assessmentGetSpy =
                function (assessment) {
                    var detailsMap = {
                        'assessment-0-0': 'details-0-0',
                        'assessment-0-1': 'details-0-1',
                        'assessment-1-0': 'details-1-0',
                        'assessment-1-1': 'details-1-1'
                    };

                    return detailsMap[assessment.assessment_ID];
                }, assessmentGetStub = sinon.stub(rgiAssessmentSrvc, 'get', assessmentGetSpy);
            /*jshint unused: false*/
            /*jslint unparam: false*/

            $controller('rgiUserAdminCtrl', {$scope: $scope});
            userQueryStub.restore();
            assessmentGetStub.restore();
        }
    ));

    it('initializes sort options', function () {
        _.isEqual($scope.sort_options, [
            {value: 'firstName', text: 'Sort by First Name'},
            {value: 'lastName', text: 'Sort by Last Name'},
            {value: 'username', text: 'Sort by Username'},
            {value: 'role', text: 'Sort by Role'},
            {value: 'approved', text: 'Sort by Approved'},
            {value: 'submitted', text: 'Sort by Submitted'}
        ]).should.be.equal(true);
    });

    it('sets sort order', function () {
        $scope.sort_order.should.be.equal('lastName');
    });

    it('loads assessments data', function () {
        _.isEqual($scope.users, [
            {
                assessments: [
                    {assessment_ID: 'assessment-1-0', details: 'details-1-0'},
                    {assessment_ID: 'assessment-1-1', details: 'details-1-1'}
                ]
            },
            {
                assessments: [
                    {assessment_ID: 'assessment-0-0', details: 'details-0-0'},
                    {assessment_ID: 'assessment-0-1', details: 'details-0-1'}
                ]
            }
        ]).should.be.equal(true);
    });
});
