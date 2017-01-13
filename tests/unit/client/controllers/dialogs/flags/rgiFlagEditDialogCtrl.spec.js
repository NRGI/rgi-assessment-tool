'use strict';

describe('rgiFlagEditDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, backups = {}, callbacks = {}, mocks = {}, spies = {}, stubs = {},
        FLAG_ORIGINAL_CONTENT = 'flag original content', CURRENT_USER = 'current user',
        $route, ngDialog, rgiAnswerMethodSrvc, rgiIdentitySrvc, rgiNotifier;

    beforeEach(inject(
        function ($rootScope, $controller, _$route_, _ngDialog_, _rgiAnswerMethodSrvc_, _rgiIdentitySrvc_, _rgiNotifier_) {
            $route = _$route_;
            ngDialog = _ngDialog_;
            rgiAnswerMethodSrvc = _rgiAnswerMethodSrvc_;
            rgiNotifier = _rgiNotifier_;

            rgiIdentitySrvc = _rgiIdentitySrvc_;
            backups.identityCurrentUser = angular.copy(rgiIdentitySrvc.currentUser);
            rgiIdentitySrvc.currentUser = CURRENT_USER;

            $scope = $rootScope.$new();
            $scope.$parent = {flag: {content: FLAG_ORIGINAL_CONTENT}};
            $controller('rgiFlagEditDialogCtrl', {$scope: $scope});
        }
    ));

    it('sets the current user', function() {
        $scope.current_user.should.be.equal(CURRENT_USER);
    });

    it('sets the flag content', function() {
        $scope.flag_content.should.be.equal(FLAG_ORIGINAL_CONTENT);
    });

    describe('#closeDialog', function() {
        it('closes the dialog', function() {
            mocks.ngDialog = sinon.mock(ngDialog);
            mocks.ngDialog.expects('close');
            $scope.closeDialog();
        });
    });

    describe('#saveFlag', function() {
        var setParentData = function(flagContent) {
            $scope.$parent = {
                answer: {flags: ['dummy flag', {}]},
                flag: {content: flagContent},
                index: 1
            };
        };

        beforeEach(function() {
            mocks.notifier = sinon.mock(rgiNotifier);
        });

        it('shows an error message if the flag content is not modified', function() {
            setParentData(FLAG_ORIGINAL_CONTENT);
            mocks.notifier.expects('error').withArgs('Do you have edits to submit?');
            $scope.saveFlag();
        });

        describe('FLAG MODIFIED', function() {
            var FLAG_MODIFIED_CONTENT = 'modified flag content';

            beforeEach(function() {
                spies.answerMethodUpdateAnswer = sinon.spy(function() {
                    return {
                        then: function(callbackSuccess, callbackFailure) {
                            callbacks.answerMethodUpdateAnswerSuccess = callbackSuccess;
                            callbacks.answerMethodUpdateAnswerFailure = callbackFailure;

                            return {
                                finally: function(callback) {
                                    callback();
                                }
                            };
                        }
                    };
                });

                stubs.answerMethodUpdateAnswer = sinon.stub(rgiAnswerMethodSrvc, 'updateAnswer',
                    spies.answerMethodUpdateAnswer);

                $scope.closeThisDialog = sinon.spy();
                setParentData(FLAG_MODIFIED_CONTENT);
                $scope.saveFlag();
            });

            it('closes the dialog', function() {
                $scope.closeThisDialog.called.should.be.equal(true);
            });

            it('submits a request to update the answer data', function() {
                $scope.$parent.answer.flags[$scope.$parent.index].content.should.be.equal($scope.flag_content);
                spies.answerMethodUpdateAnswer.withArgs($scope.$parent.answer).called.should.be.equal(true);
            });

            it('shows the failure reason in case of a failure', function() {
                var REASON = 'reason';
                mocks.notifier.expects('notify').withArgs(REASON);
                callbacks.answerMethodUpdateAnswerFailure(REASON);
            });

            describe('SUCCESS CASE', function() {
                it('shows a success message', function() {
                    mocks.notifier.expects('notify').withArgs('Flag edited');
                });

                it('reloads the state', function() {
                    mocks.$route = sinon.mock($route);
                    mocks.$route.expects('reload');
                });

                afterEach(function() {
                    callbacks.answerMethodUpdateAnswerSuccess();
                });
            });
        });
    });

    afterEach(function() {
        Object.keys(mocks).forEach(function(mockName) {
            mocks[mockName].verify();
            mocks[mockName].restore();
        });

        rgiIdentitySrvc.currentUser = backups.identityCurrentUser;
    });
});
