'use strict';

describe('rgiAuthLogsCtrl', function () {
    beforeEach(module('app'));

    var $scope, rgiAuthLogsSrvc, rgiHttpResponseProcessorSrvc, rgiNotifier, userId = 'USER-ID';

    beforeEach(inject(
        function ($rootScope, $controller, _rgiAuthLogsSrvc_, _rgiHttpResponseProcessorSrvc_, _rgiNotifier_) {
            $scope = $rootScope.$new();
            rgiAuthLogsSrvc = _rgiAuthLogsSrvc_;
            rgiHttpResponseProcessorSrvc = _rgiHttpResponseProcessorSrvc_;
            rgiNotifier = _rgiNotifier_;
            $controller('rgiAuthLogsCtrl', {$scope: $scope});
        }
    ));

    describe('initialization', function() {
        describe('CURRENT USER NOT DETECTED', function() {
            it('does nothing until user data loaded', function() {
                $scope.user = undefined;
                var authLogsMock = sinon.mock(rgiAuthLogsSrvc);
                authLogsMock.expects('getTotalNumber').never();

                $scope.$apply();

                authLogsMock.verify();
                authLogsMock.restore();
            });
        });

        describe('CURRENT USER DETECTED', function() {
            var authLogsSpy, authLogsStub, response, extraMock, cleanUp;

            beforeEach(function() {
                $scope.user = {_id: userId};
            });

            describe('NEGATIVE CASE', function() {
                var httpResponseProcessorStubs = {}, httpResponseProcessorHandleSpy;

                beforeEach(function() {
                    httpResponseProcessorHandleSpy = sinon.spy();
                    httpResponseProcessorStubs.handle = sinon.stub(rgiHttpResponseProcessorSrvc, 'handle', httpResponseProcessorHandleSpy);

                    httpResponseProcessorStubs.getMessage = sinon.stub(rgiHttpResponseProcessorSrvc, 'getMessage', function(response, message) {
                        return message;
                    });

                    cleanUp = function() {
                        httpResponseProcessorStubs.getMessage.restore();
                        httpResponseProcessorStubs.handle.restore();
                        httpResponseProcessorHandleSpy.withArgs(response).called.should.be.equal(true);
                    };
                });

                it('shows an error message, if it fails to get the logs number', function () {
                    extraMock = sinon.mock(rgiNotifier);
                    extraMock.expects('error').withArgs('Auth logs loading failure');
                });

                afterEach(function () {
                    authLogsSpy = sinon.spy(function() {
                        return {
                            then: function(callbackPositive, callbackNegative) {
                                callbackNegative();
                            }
                        };
                    });
                });
            });

            describe('POSITIVE CASE', function() {
                beforeEach(function() {
                    cleanUp = function() {};
                });

                it('load logs, if it gets the logs number successfully', function () {
                    response = {data: {}};
                    extraMock = sinon.mock($scope);
                    extraMock.expects('loadLogs');
                });

                it('shows an error message, if the error comes in response on logs number request', function () {
                    var error = {message: 'ERROR'};
                    extraMock = sinon.mock(rgiNotifier);
                    extraMock.expects('error').withArgs(error.message);

                    response = {data: {
                        error: error
                    }};
                });

                afterEach(function () {
                    authLogsSpy = sinon.spy(function() {
                        return {
                            then: function(callback) {
                                callback(response);
                            }
                        };
                    });
                });
            });

            afterEach(function () {
                authLogsStub = sinon.stub(rgiAuthLogsSrvc, 'getTotalNumber', authLogsSpy);
                $scope.$apply();
                cleanUp();

                extraMock.verify();
                extraMock.restore();
                authLogsSpy.withArgs(userId).called.should.be.equal(true);
                authLogsStub.restore();
            });
        });
    });

    describe('#loadLogs', function() {
        var authLogsListSpy, check, logsNumberResponse, logsListResponse, notifierMock, errorResponse = 'ERROR';

        beforeEach(function() {
            $scope.user = {_id: userId};
        });

        describe('CORRECT RESPONSE CASE', function() {
            it('does not send a request for logs, if there are no logs detected', function() {
                logsNumberResponse = {data: {error: null, number: 0}};
                check = function() {
                    authLogsListSpy.called.should.be.equal(false);
                };
            });

            it('shows a corresponding error message, if an error comes in the response', function() {
                logsNumberResponse = {data: {error: null, number: 21}};
                logsListResponse = {data: {error: {message: 'Error Message'}, logs: []}};

                notifierMock = sinon.mock(rgiNotifier);
                notifierMock.expects('error').withArgs(logsListResponse.data.error.message);

                check = function() {
                    notifierMock.verify();
                    notifierMock.restore();
                };
            });

            it('pushes logs to the storage, if there are logs detected', function() {
                logsNumberResponse = {data: {error: null, number: 21}};
                logsListResponse = {data: {error: null, logs: [1, 2, 3]}};

                check = function() {
                    var initialLogsNumber = $scope.logs.length;
                    $scope.loadLogs();
                    ($scope.logs.length > initialLogsNumber).should.be.equal(true);
                };
            });

            afterEach(function() {
                authLogsListSpy = sinon.spy(function() {
                    return {
                        then: function(callback) {
                            callback(logsListResponse);
                        }
                    };
                });
            });
        });

        describe('ERROR CASE', function() {
            var httpResponseProcessorStubs = {}, httpResponseProcessorHandleSpy;

            it('shows an error message, if the request is failed', function() {
                httpResponseProcessorHandleSpy = sinon.spy();
                httpResponseProcessorStubs.handle = sinon.stub(rgiHttpResponseProcessorSrvc, 'handle', httpResponseProcessorHandleSpy);

                httpResponseProcessorStubs.getMessage = sinon.stub(rgiHttpResponseProcessorSrvc, 'getMessage', function(response, message) {
                    return message;
                });

                logsNumberResponse = {data: {error: null, number: 21}};
                notifierMock = sinon.mock(rgiNotifier);
                notifierMock.expects('error').withArgs('Auth logs loading failure');

                check = function() {
                    httpResponseProcessorStubs.getMessage.restore();
                    httpResponseProcessorStubs.handle.restore();
                    httpResponseProcessorHandleSpy.withArgs(errorResponse).called.should.be.equal(true);

                    notifierMock.verify();
                    notifierMock.restore();
                };
            });

            afterEach(function() {
                authLogsListSpy = sinon.spy(function() {
                    return {
                        then: function(successCallback, errorCallback) {
                            errorCallback(errorResponse);
                        }
                    };
                });
            });
        });

        afterEach(function() {
            var authLogsGetTotalNumberStub = sinon.stub(rgiAuthLogsSrvc, 'getTotalNumber', function() {
                return {
                    then: function(callback) {
                        callback(logsNumberResponse);
                    }
                };
            }),
                authLogsListStub = sinon.stub(rgiAuthLogsSrvc, 'list', authLogsListSpy);

            $scope.$apply();
            check();

            authLogsGetTotalNumberStub.restore();
            authLogsListStub.restore();
        });
    });
});
