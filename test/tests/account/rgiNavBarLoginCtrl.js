'use strict';
/*jslint nomen: true newcap: true */
var describe, beforeEach, afterEach, it, inject, expect, sinon;

describe('rgiNavBarLoginCtrl', function () {
    beforeEach(module('app'));

    var $scope, $location, rgiAuthSrvc, rgiAssessmentSrvc, rgiNotifier;
    var rgiNotifierNotifyStub, rgiNotifierNotifySpy;

    beforeEach(inject(
        function ($rootScope, $controller, _$location_, _rgiAssessmentSrvc_, _rgiAuthSrvc_, _rgiNotifier_) {
            $scope = $rootScope.$new();
            $location = _$location_;
            rgiAssessmentSrvc = _rgiAssessmentSrvc_;
            rgiAuthSrvc = _rgiAuthSrvc_;
            rgiNotifier = _rgiNotifier_;

            rgiNotifierNotifySpy = sinon.spy();
            rgiNotifierNotifyStub = sinon.stub(rgiNotifier, 'notify', rgiNotifierNotifySpy);

            $controller('rgiNavBarLoginCtrl', {$scope: $scope});
        }
    ));

    describe('#signout', function () {
        var mocks = {};

        beforeEach(function () {
            mocks.$location = sinon.mock($location);
            mocks.$location.expects('path').withArgs('/');

            mocks.rgiAuthSrvc = sinon.mock(rgiAuthSrvc);
            mocks.rgiAuthSrvc.expects('logoutUser').
                returns({
                    then: function (callback) {
                        callback();
                    }
                });

            $scope.signout();
        });

        it('shows a notification message', function () {
            rgiNotifierNotifySpy.withArgs('You have successfully signed out!').called.should.be.equal(true);
        });

        it('resets the username & password', function () {
            $scope.username.should.be.equal('');
            $scope.password.should.be.equal('');
        });

        afterEach(function () {
            for (var mockIndex in mocks) {
                mocks[mockIndex].verify();
                mocks[mockIndex].restore();
            }
        });
    });

    describe('#signin', function () {
        var authenticationStub;
        var CORRECT_CREDENTIALS = {username: 'EXISTING_USER', password: 'CORRECT_PASSWORD'};

        beforeEach(function () {
            authenticationStub = sinon.stub(rgiAuthSrvc, 'authenticateUser', function(username, password) {
                return {
                    then: function(callback) {
                        callback((username === CORRECT_CREDENTIALS.username) && (password === CORRECT_CREDENTIALS.password));
                    }
                };
            });
        });

        describe('Authentication failure', function () {
            beforeEach(function () {
                $scope.signin('NON-EXISTING-USER', 'INCORRECT-PASSWORD');
            });

            it('shows a notification message', function () {
                rgiNotifierNotifySpy.withArgs('Username/Password combination incorrect').called.should.be.equal(true);
            });

            it('clears the version list', function () {
                $scope.versions.length.should.be.equal(0);
            });
        });

        describe('Authentication success', function () {
            var assessmentStub;

            beforeEach(function () {
                assessmentStub = sinon.stub(rgiAssessmentSrvc, 'query', function(useless, callback) {
                    callback([
                        {year: 2010, version: 'the social network'},
                        {year: 2010, version: 'the social network'},
                        {year: 1995, version: 'the pirates of silicon valley'}
                    ]);
                });

                $scope.signin(CORRECT_CREDENTIALS.username, CORRECT_CREDENTIALS.password);
            });

            it('shows a notification message', function () {
                rgiNotifierNotifySpy.withArgs('You have successfully signed in!').called.should.be.equal(true);
            });

            it('fills the version list', function () {
                _.isEqual([
                    {
                        year: 2010,
                        version: 'the social network',
                        name: '2010 The social network',
                        url: '2010_the social network'
                    },
                    {
                        year: 1995,
                        version: 'the pirates of silicon valley',
                        name: '1995 The pirates of silicon valley',
                        url: '1995_the pirates of silicon valley'
                    }
                ], $scope.versions).should.be.equal(true);
            });

            afterEach(function () {
                assessmentStub.restore();
            });
        });

        afterEach(function () {
            authenticationStub.restore();
        });
    });

    afterEach(function () {
        rgiNotifierNotifyStub.restore();
    });
});