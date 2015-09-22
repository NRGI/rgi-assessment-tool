'use strict';

var describe, beforeEach, it, inject, expect;

describe('rgiAuthSrvc', function () {
    var rgiAuthSrvc;
    var $q, $http, rgiIdentitySrvc, rgiUserSrvc;

    beforeEach(module('app'));

    beforeEach(inject(function(_rgiAuthSrvc_, _$q_, _$http_, _rgiIdentitySrvc_, _rgiUserSrvc_) {
        $http = _$http_;
        $q = _$q_;
        rgiIdentitySrvc = _rgiIdentitySrvc_;
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

    describe('#authenticateUser', function() {
        var $deferredResolveSpy, promise, $qDeferSpy, $qDeferStub, $httpPostSpy, $httpPostStub;
        var username = 'username', password = 'password';

        beforeEach(function () {
            $deferredResolveSpy = sinon.spy();
            promise = 'promise';

            $qDeferSpy = sinon.spy(function() {
                return {
                    resolve: $deferredResolveSpy,
                    promise: promise
                };
            });
            $qDeferStub = sinon.stub($q, 'defer', $qDeferSpy);
        });

        it('sets the user data to Identity service on successful authorization', function() {
            var firstName = 'Alex';

            $httpPostSpy = sinon.spy(function() {
                return {
                    then: function(callback) {
                        callback({
                            data: {
                                success: true,
                                user: {
                                    firstName: firstName
                                }
                            }
                        });
                    }
                };
            });
            $httpPostStub = sinon.stub($http, 'post', $httpPostSpy);

            rgiAuthSrvc.authenticateUser(username, password).should.be.equal(promise);

            rgiIdentitySrvc.currentUser.firstName.should.be.equal(firstName);
            $deferredResolveSpy.withArgs(true).called.should.be.equal(true);
        });

        it('does nothing on failed authorization', function() {
            $httpPostSpy = sinon.spy(function() {
                return {
                    then: function(callback) {
                        callback({
                            data: {
                                success: false
                            }
                        });
                    }
                };
            });
            $httpPostStub = sinon.stub($http, 'post', $httpPostSpy);

            rgiAuthSrvc.authenticateUser(username, password).should.be.equal(promise);
            $deferredResolveSpy.withArgs(true).called.should.be.equal(false);
        });

        afterEach(function () {
            $httpPostSpy.withArgs('/login', {username: username, password: password}).called.should.be.equal(true);
            $qDeferStub.restore();
            $httpPostStub.restore();
        });
    });

    describe('#logoutUser', function() {
        it('sends logout request to the back end', function() {
            var $deferredResolveSpy = sinon.spy();
            var promise = 'promise';

            var $qDeferSpy = sinon.spy(function() {
                return {
                    resolve: $deferredResolveSpy,
                    promise: promise
                };
            });
            var $qDeferStub = sinon.stub($q, 'defer', $qDeferSpy);

            var $httpPostSpy = sinon.spy(function() {
                return {
                    then: function(callback) {
                        callback();
                    }
                };
            });
            var $httpPostStub = sinon.stub($http, 'post', $httpPostSpy);

            rgiAuthSrvc.logoutUser().should.be.equal(promise);
            should.equal(rgiIdentitySrvc.currentUser, undefined);

            $httpPostSpy.withArgs('/logout', {logout: true}).called.should.be.equal(true);
            $deferredResolveSpy.called.should.be.equal(true);

            $qDeferStub.restore();
            $httpPostStub.restore();
        });
    });
});