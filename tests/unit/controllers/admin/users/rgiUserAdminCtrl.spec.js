'use strict';

describe('rgiUserAdminCtrl', function () {
    beforeEach(module('app'));
    var $scope, notifierMock, httpResponseProcessorHandleSpy, stubs = {};

    beforeEach(inject(
        function (
            $rootScope,
            $controller,
            rgiAssessmentSrvc,
            rgiAuthLogsSrvc,
            rgiHttpResponseProcessorSrvc,
            rgiNotifier,
            rgiUserSrvc
        ) {
            $scope = $rootScope.$new();
            notifierMock = sinon.mock(rgiNotifier);

            var
                data = [
                    {
                        _id: 'user0',
                        assessments: [
                            {assessment_ID: 'assessment-0-0'},
                            {assessment_ID: 'assessment-0-1'}
                        ]
                    },
                    {
                        _id: 'user1',
                        assessments: [
                            {assessment_ID: 'assessment-1-0'},
                            {assessment_ID: 'assessment-1-1'}
                        ]
                    }
                ];
            /*jshint unused: true*/
            /*jslint unparam: true*/
            stubs.userQuery = sinon.stub(rgiUserSrvc, 'query', function (uselessOptions, callback) {
                callback(data);
            });
            /*jshint unused: false*/
            /*jslint unparam: false*/
            stubs.assessmentgetCached = sinon.stub(rgiAssessmentSrvc, 'getCached', function (assessment, callback) {
                var detailsMap = {
                    'assessment-0-0': 'details-0-0',
                    'assessment-0-1': 'details-0-1',
                    'assessment-1-0': 'details-1-0',
                    'assessment-1-1': 'details-1-1'
                };

                callback(detailsMap[assessment.assessment_ID]);
            });

            stubs.authLogsGetMostRecent = sinon.stub(rgiAuthLogsSrvc, 'getMostRecent', function (userId, action) {
                return {then: function(callbackPositive, callbackNegative) {
                    callbackPositive({data: {logs: [userId + ' ' + action]}});
                    callbackNegative(userId + ' ' + action);
                }};
            });

            stubs.httpResponseProcessorGetMessage = sinon.stub(rgiHttpResponseProcessorSrvc, 'getMessage',
                function(uselessResponse, message) {return message;});

            httpResponseProcessorHandleSpy = sinon.spy();
            stubs.httpResponseProcessorGetMessage = sinon.stub(rgiHttpResponseProcessorSrvc, 'handle',
                httpResponseProcessorHandleSpy);

                $controller('rgiUserAdminCtrl', {$scope: $scope});
        }
    ));

    describe('FAILURE CASE', function() {
        it('shows an error message', function () {
            notifierMock.verify();
        });

        it('process the failure response', function () {
            httpResponseProcessorHandleSpy.withArgs('user0 sign-in').called.should.be.equal(true);
            httpResponseProcessorHandleSpy.withArgs('user1 sign-in').called.should.be.equal(true);
        });
    });

    describe('SUCCESS CASE', function() {
        it('initializes sort options', function () {
            $scope.sort_options.should.deep.equal([
                {value: 'firstName', text: 'Sort by First Name'},
                {value: 'lastName', text: 'Sort by Last Name'},
                {value: 'username', text: 'Sort by Username'},
                {value: 'role', text: 'Sort by Role'},
                {value: 'approved', text: 'Sort by Approved'},
                {value: 'submitted', text: 'Sort by Submitted'}
            ]);
        });

        it('sets sort order', function () {
            $scope.sort_order.should.be.equal('lastName');
        });

        it('loads assessments data', function () {
            $scope.users.should.deep.equal([
                {
                    last_sign_in: 'user0 sign-in',
                    _id: 'user0',
                    assessments: [
                        {assessment_ID: 'assessment-0-0', details: 'details-0-0'},
                        {assessment_ID: 'assessment-0-1', details: 'details-0-1'}
                    ]
                },
                {
                    last_sign_in: 'user1 sign-in',
                    _id: 'user1',
                    assessments: [
                        {assessment_ID: 'assessment-1-0', details: 'details-1-0'},
                        {assessment_ID: 'assessment-1-1', details: 'details-1-1'}
                    ]
                }
            ]);
        });
    });

    afterEach(function() {
        notifierMock.restore();

        Object.keys(stubs).forEach(function(stubName) {
            stubs[stubName].restore();
        });
    });
});
