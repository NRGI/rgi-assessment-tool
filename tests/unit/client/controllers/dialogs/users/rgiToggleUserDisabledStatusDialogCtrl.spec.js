'use strict';

describe('rgiToggleUserDisabledStatusDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, rgiNotifier, rgiUserMethodSrvc;

    beforeEach(inject(
        function ($rootScope, $controller, _rgiNotifier_, _rgiUserMethodSrvc_) {
            rgiNotifier = _rgiNotifier_;
            rgiUserMethodSrvc = _rgiUserMethodSrvc_;

            $scope = $rootScope.$new();
            $controller('rgiToggleUserDisabledStatusDialogCtrl', {$scope: $scope});
        }
    ));

    describe('#toggleUserDisabledStatus', function () {
        var updateUserStub, updateUserSpy, notifierMock, callbacks = {};

        beforeEach(function () {
            updateUserSpy = sinon.spy(function () {
                return {
                    then: function (callbackSuccess, callbackFailure) {
                        callbacks.success = callbackSuccess;
                        callbacks.failure = callbackFailure;

                        return {
                            finally: function(callback) {
                                callback();
                            }
                        };
                    }
                };
            });

            updateUserStub = sinon.stub(rgiUserMethodSrvc, 'updateUser', updateUserSpy);
            notifierMock = sinon.mock(rgiNotifier);
            $scope.closeThisDialog = sinon.spy();
        });

        describe('activate', function() {
            beforeEach(function () {
                $scope.$parent.user = {disabled: true};
                $scope.toggleUserDisabledStatus();
            });

            it('submits a request to update the user data', function() {
                updateUserSpy.withArgs({disabled: false}).called.should.be.equal(true);
            });

            describe('CALLBACKS', function() {
                describe('SUCCESS', function() {
                    beforeEach(function () {
                        notifierMock.expects('notify').withArgs('User account has been activated');
                        callbacks.success();
                    });

                    it('resets the `disabled` flag', function() {
                        $scope.$parent.user.disabled.should.be.equal(false);
                    });
                });

                describe('FAILURE', function() {
                    var REASON = 'reason';

                    beforeEach(function () {
                        notifierMock.expects('error').withArgs(REASON);
                        callbacks.failure(REASON);
                    });

                    it('keeps the `disabled` flag unchanged', function() {
                        $scope.$parent.user.disabled.should.be.equal(true);
                    });
                });
            });
        });

        describe('deactivate', function() {
            beforeEach(function () {
                $scope.$parent.user = {disabled: false};
                $scope.toggleUserDisabledStatus();
            });

            it('submits a request to update the user data', function() {
                updateUserSpy.withArgs({disabled: true}).called.should.be.equal(true);
            });

            describe('CALLBACKS', function() {
                describe('SUCCESS', function() {
                    beforeEach(function () {
                        notifierMock.expects('notify').withArgs('User account has been deactivated');
                        callbacks.success();
                    });

                    it('sets the `disabled` flag', function() {
                        $scope.$parent.user.disabled.should.be.equal(true);
                    });
                });

                describe('FAILURE', function() {
                    var REASON = 'reason';

                    beforeEach(function () {
                        notifierMock.expects('error').withArgs(REASON);
                        callbacks.failure(REASON);
                    });

                    it('keeps the `disabled` flag unchanged', function() {
                        $scope.$parent.user.disabled.should.be.equal(false);
                    });
                });
            });
        });

        afterEach(function () {
            $scope.closeThisDialog.called.should.be.equal(true);
            notifierMock.verify();
            notifierMock.restore();
            updateUserStub.restore();
        });
    });
});
