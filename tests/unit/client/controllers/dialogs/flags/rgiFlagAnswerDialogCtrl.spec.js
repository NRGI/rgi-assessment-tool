'use strict';

describe('rgiFlagAnswerDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, backups = {}, mocks = {},
        CURRENT_USER = {
            _id: 'current user id',
            role: 'current user role',
            firstName: 'current user first name',
            lastName: 'current user last name'
        },
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
            $controller('rgiFlagAnswerDialogCtrl', {$scope: $scope});
        }
    ));

    it('sets the current user', function() {
        $scope.current_user.should.deep.equal(CURRENT_USER);
    });

    describe('#closeDialog', function() {
        it('closes the dialog', function() {
            mocks.ngDialog = sinon.mock(ngDialog);
            mocks.ngDialog.expects('close');
            $scope.closeDialog();
        });
    });

    describe('#saveFlag', function() {
        var callbacks = {}, spies = {}, stubs = {}, EDIT_CONTROL = 'edit control', FLAG_CONTENT = 'flag content';

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
            $scope.$parent = {answer: {flags: []}, assessment: {edit_control: EDIT_CONTROL}};
            $scope.flag_content = FLAG_CONTENT;

            mocks.notifier = sinon.mock(rgiNotifier);
            $scope.saveFlag();
        });

        it('closes the dialog', function() {
            $scope.closeThisDialog.called.should.be.equal(true);
        });

        it('submits a request to update the answer data', function() {
            spies.answerMethodUpdateAnswer.called.should.be.equal(true);
            var answer = spies.answerMethodUpdateAnswer.args[0][0];

            answer.status.should.be.equal('flagged');
            answer.modified.should.be.equal(false);
            answer.researcher_resolve_flag_required.should.be.equal(true);

            var flag = answer.flags[0];
            (new Date().getTime() - new Date(flag.date).getTime() < 200).should.be.equal(true);

            flag.author_name.should.be.equal(CURRENT_USER.firstName + ' ' + CURRENT_USER.lastName);
            flag.author.should.be.equal(CURRENT_USER._id);
            flag.role.should.be.equal(CURRENT_USER.role);

            flag.content.should.be.equal(FLAG_CONTENT);
            flag.addressed.should.be.equal(false);
            flag.addressed_to.should.be.equal(EDIT_CONTROL);
        });

        it('shows the failure reason in case of a failure', function() {
            var REASON = 'reason';
            mocks.notifier.expects('notify').withArgs(REASON);
            callbacks.answerMethodUpdateAnswerFailure(REASON);
        });

        describe('SUCCESS CASE', function() {
            it('shows a success message', function() {
                mocks.notifier.expects('notify').withArgs('Answer flagged');
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

    afterEach(function() {
        Object.keys(mocks).forEach(function(mockName) {
            mocks[mockName].verify();
            mocks[mockName].restore();
        });

        rgiIdentitySrvc.currentUser = backups.identityCurrentUser;
    });
});
