'use strict';

describe('rgiDeleteUserDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, $location, rgiNotifier, rgiUserMethodSrvc;

    beforeEach(inject(
        function ($rootScope, $controller, _$location_, _rgiNotifier_, _rgiUserMethodSrvc_) {
            $location = _$location_;
            rgiNotifier = _rgiNotifier_;
            rgiUserMethodSrvc = _rgiUserMethodSrvc_;

            $scope = $rootScope.$new();
            $controller('rgiDeleteUserDialogCtrl', {$scope: $scope});
        }
    ));

    describe('#deleteUser', function () {
        var deleteUserStub, deleteUserSpy, notifierMock, USER_ID = 'USER_ID';

        beforeEach(function () {
            notifierMock = sinon.mock(rgiNotifier);
            $scope.$parent.user = {_id: USER_ID};
            $scope.closeThisDialog = 'closeThisDialog';
        });

        describe('INVALID DATA', function() {
            it('shows an error message if there are assessments assigned to the user', function() {
                $scope.$parent.user.assessments = [1];
                notifierMock.expects('error').withArgs('You cannot delete a user with an assigned assessment!');
                $scope.deleteUser();
            });
        });

        describe('VALID DATA', function() {
            var finallySpy;

            beforeEach(function() {
                $scope.$parent.user.assessments = [];
                finallySpy = sinon.spy();
            });

            describe('POSITIVE CASE', function () {
                beforeEach(function() {
                    deleteUserSpy = sinon.spy(function () {
                        return {
                            then: function (callback) {
                                callback();
                                return {finally: finallySpy};
                            }
                        };
                    });
                    deleteUserStub = sinon.stub(rgiUserMethodSrvc, 'deleteUser', deleteUserSpy);
                });

                it('redirects to the user list', function () {
                    var $locationMock = sinon.mock($location);
                    $locationMock.expects('path').withArgs('/admin/user-admin');

                    $scope.deleteUser();

                    $locationMock.verify();
                    $locationMock.restore();
                });

                it('shows success message', function () {
                    notifierMock.expects('notify').withArgs('User account has been deleted');
                    $scope.deleteUser();
                });
            });

            describe('NEGATIVE CASE', function () {
                var ERROR_MESSAGE = 'ERROR MESSAGE';

                beforeEach(function() {
                    deleteUserSpy = sinon.spy(function () {
                        return {
                            then: function (uselessCallbackPositive, callbackNegative) {
                                callbackNegative(ERROR_MESSAGE);
                                return {finally: finallySpy};
                            }
                        };
                    });
                    deleteUserStub = sinon.stub(rgiUserMethodSrvc, 'deleteUser', deleteUserSpy);
                });

                it('shows error message', function () {
                    notifierMock.expects('error').withArgs(ERROR_MESSAGE);
                    $scope.deleteUser();
                });
            });

            afterEach(function () {
                finallySpy.withArgs($scope.closeThisDialog).called.should.be.equal(true);
                deleteUserSpy.withArgs(USER_ID).called.should.be.equal(true);
                deleteUserStub.restore();
            });
        });//VALID DATA

        afterEach(function () {
            notifierMock.verify();
            notifierMock.restore();
        });
    });
});
