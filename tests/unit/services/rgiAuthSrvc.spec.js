'use strict';

describe('rgiAuthSrvc', function () {
    var rgiAuthSrvc,
        $q, $http, rgiHttpResponseProcessorSrvc, rgiIdentitySrvc, rgiNotifier, rgiUserSrvc,
        spies = {}, stubs = {};

    beforeEach(module('app'));

    beforeEach(inject(function(
        _rgiAuthSrvc_,
        _$q_,
        _$http_,
        _rgiHttpResponseProcessorSrvc_,
        _rgiIdentitySrvc_,
        _rgiNotifier_,
        _rgiUserSrvc_
    ) {
        $http = _$http_;
        $q = _$q_;
        rgiHttpResponseProcessorSrvc = _rgiHttpResponseProcessorSrvc_;
        rgiIdentitySrvc = _rgiIdentitySrvc_;
        rgiNotifier = _rgiNotifier_;
        rgiUserSrvc = _rgiUserSrvc_;

        rgiAuthSrvc = _rgiAuthSrvc_;
    }));

    describe('#authorizeCurrentUserForRoute', function () {
        var role = 'user';
        var rgiIdentityIsAuthorizedStub, rgiIdentityIsAuthorizedSpy;

        it('returns TRUE, if the current user has the defined role', function() {
            rgiIdentityIsAuthorizedSpy = sinon.spy(function() {
                return true;
            });
            rgiIdentityIsAuthorizedStub = sinon.stub(rgiIdentitySrvc, 'isAuthorized', rgiIdentityIsAuthorizedSpy);
            rgiAuthSrvc.authorizeCurrentUserForRoute(role).should.be.equal(true);
        });

        it('rejects $q, if the current user does not have the defined role', function() {
            var $qRejectSpy = sinon.spy();
            var $qRejectStub = sinon.stub($q, 'reject', $qRejectSpy);

            rgiIdentityIsAuthorizedSpy = sinon.spy(function() {
                return false;
            });
            rgiIdentityIsAuthorizedStub = sinon.stub(rgiIdentitySrvc, 'isAuthorized', rgiIdentityIsAuthorizedSpy);

            should.equal(rgiAuthSrvc.authorizeCurrentUserForRoute(role), undefined);
            $qRejectSpy.withArgs('not authorized').called.should.be.equal(true);
            $qRejectStub.restore();
        });

        afterEach(function () {
            rgiIdentityIsAuthorizedSpy.withArgs(role).called.should.be.equal(true);
            rgiIdentityIsAuthorizedStub.restore();
        });
    });

    describe('#authorizeAuthenticatedUserForRoute', function () {
        var rgiIdentityIsAuthenticatedStub, rgiIdentityIsAuthenticatedSpy;

        it('returns TRUE, if the current user is authenticated', function() {
            rgiIdentityIsAuthenticatedSpy = sinon.spy(function() {
                return true;
            });
            rgiIdentityIsAuthenticatedStub = sinon.stub(rgiIdentitySrvc, 'isAuthenticated', rgiIdentityIsAuthenticatedSpy);
            rgiAuthSrvc.authorizeAuthenticatedUserForRoute().should.be.equal(true);
        });

        it('rejects $q, if the current user is not authenticated', function() {
            var $qRejectSpy = sinon.spy();
            var $qRejectStub = sinon.stub($q, 'reject', $qRejectSpy);

            rgiIdentityIsAuthenticatedSpy = sinon.spy(function() {
                return false;
            });
            rgiIdentityIsAuthenticatedStub = sinon.stub(rgiIdentitySrvc, 'isAuthenticated', rgiIdentityIsAuthenticatedSpy);

            should.equal(rgiAuthSrvc.authorizeAuthenticatedUserForRoute(), undefined);
            $qRejectSpy.withArgs('not authorized').called.should.be.equal(true);
            $qRejectStub.restore();
        });

        afterEach(function () {
            rgiIdentityIsAuthenticatedSpy.called.should.be.equal(true);
            rgiIdentityIsAuthenticatedStub.restore();
        });
    });

    var set$httpPostStub = function(callback) {
        spies.$httpPost = sinon.spy(function() {
            return {then: callback};
        });

        stubs.$httpPost = sinon.stub($http, 'post', spies.$httpPost);
    };

    describe('LOGIN / LOGOUT', function() {
        var promise, promiseGot;

        beforeEach(function () {
            spies.$deferredResolve = sinon.spy();
            promise = 'promise';

            spies.$qDefer = sinon.spy(function() {
                return {
                    resolve: spies.$deferredResolve,
                    promise: promise
                };
            });
            stubs.$qDefer = sinon.stub($q, 'defer', spies.$qDefer);
        });

        describe('#authenticateUser', function() {
            var username = 'username', password = 'password';

            it('sets the user data to Identity service on successful authorization', function() {
                var firstName = 'Alex';
                set$httpPostStub(function(callback) {
                    callback({
                        data: {
                            success: true,
                            user: {
                                firstName: firstName
                            }
                        }
                    });
                });

                promiseGot = rgiAuthSrvc.authenticateUser(username, password);
                rgiIdentitySrvc.currentUser.firstName.should.be.equal(firstName);
                spies.$deferredResolve.withArgs(true).called.should.be.equal(true);
            });

            it('does nothing on failed authorization', function() {
                set$httpPostStub(function(callback) {
                    callback({
                        data: {
                            success: false
                        }
                    });
                });

                promiseGot = rgiAuthSrvc.authenticateUser(username, password);
                spies.$deferredResolve.withArgs(true).called.should.be.equal(false);
            });

            afterEach(function () {
                spies.$httpPost.withArgs('/login', {username: username, password: password}).called.should.be.equal(true);
            });
        });

        describe('#logoutUser', function() {
            it('sends logout request to the back end', function() {
                set$httpPostStub(function(callback) {
                    callback();
                });

                promiseGot = rgiAuthSrvc.logoutUser();
                should.equal(rgiIdentitySrvc.currentUser, undefined);

                spies.$httpPost.withArgs('/logout', {logout: true}).called.should.be.equal(true);
                spies.$deferredResolve.called.should.be.equal(true);
            });
        });

        describe('HTTP failure', function() {
            var RESPONSE = 'RESPONSE', ERROR_MESSAGE = 'ERROR MESSAGE', notifierMock;

            beforeEach(function() {
                notifierMock = sinon.mock(rgiNotifier);
                notifierMock.expects('error').withArgs(ERROR_MESSAGE);

                spies.httpResponseProcessorHandle = sinon.spy();
                spies.httpResponseProcessorGetMessage = sinon.spy(function() {
                    return ERROR_MESSAGE;
                });

                stubs.httpResponseProcessorHandle = sinon.stub(rgiHttpResponseProcessorSrvc, 'handle',
                    spies.httpResponseProcessorHandle);
                stubs.httpResponseProcessorGetMessage = sinon.stub(rgiHttpResponseProcessorSrvc, 'getMessage',
                    spies.httpResponseProcessorGetMessage);

                set$httpPostStub(function(uselessCallbackSuccess, callbackFailure) {
                    callbackFailure(RESPONSE);
                });
            });

            it('processed in #authenticateUser', function() {
                promiseGot = rgiAuthSrvc.authenticateUser();
            });

            it('processed in #logoutUser', function() {
                promiseGot = rgiAuthSrvc.logoutUser();
            });

            afterEach(function() {
                spies.httpResponseProcessorHandle.withArgs(RESPONSE).called.should.be.equal(true);
                spies.httpResponseProcessorGetMessage.withArgs(RESPONSE).called.should.be.equal(true);

                notifierMock.restore();
                notifierMock.verify();
            });
        });

        afterEach(function () {
            promiseGot.should.be.equal(promise);

            Object.keys(stubs).forEach(function(stubName) {
                stubs[stubName].restore();
            });
        });
    });
});
