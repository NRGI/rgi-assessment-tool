/*jslint node: true */
'use strict';
/*jslint nomen: true newcap: true */
var describe, beforeEach, afterEach, it, inject, expect, sinon;

describe('rgiDeleteQuestionDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, $location, ngDialog, rgiNotifier, rgiQuestionMethodSrvc;

    beforeEach(inject(
        function ($rootScope, $controller, _$location_, _ngDialog_, _rgiNotifier_, _rgiQuestionMethodSrvc_) {
            $location = _$location_;
            ngDialog = _ngDialog_;
            rgiNotifier = _rgiNotifier_;
            rgiQuestionMethodSrvc = _rgiQuestionMethodSrvc_;

            $scope = $rootScope.$new();

            $controller('rgiDeleteQuestionDialogCtrl', {$scope: $scope});
        }
    ));

    describe('#questionDelete', function () {
        var questionMethodDeleteQuestionStub, questionMethodDeleteQuestionSpy, notifierMock,
            QUESTION_ID = 'QUESTION_ID';

        beforeEach(function () {
            notifierMock = sinon.mock(rgiNotifier);
            $scope.$parent.question = {_id: QUESTION_ID};
        });

        describe('POSITIVE CASE', function () {
            it('shows message and redirects', function () {
                questionMethodDeleteQuestionSpy = sinon.spy(function () {
                    return {
                        then: function (callback) {
                            callback();
                        }
                    };
                });
                questionMethodDeleteQuestionStub = sinon.stub(rgiQuestionMethodSrvc, 'deleteQuestion', questionMethodDeleteQuestionSpy);

                var $locationMock = sinon.mock($location);
                $scope.closeThisDialog = sinon.spy();

                $locationMock.expects('path').withArgs('/admin/question-admin');
                notifierMock.expects('notify').withArgs('Question has been deleted');

                $scope.questionDelete();

                $locationMock.verify();
                $locationMock.restore();
                $scope.closeThisDialog.called.should.be.equal(true);
            });
        });

        describe('NEGATIVE CASE', function () {
            it('shows error message', function () {
                var failureReason = 'REASON';
                questionMethodDeleteQuestionSpy =  sinon.spy(function () {
                    /*jshint unused: true*/
                    /*jslint unparam: true*/
                    return {
                        then: function (uselessCallbackPositive, callbackNegative) {
                            callbackNegative(failureReason);
                        }
                    };
                });
                /*jshint unused: false*/
                /*jslint unparam: false*/
                questionMethodDeleteQuestionStub = sinon.stub(rgiQuestionMethodSrvc, 'deleteQuestion', questionMethodDeleteQuestionSpy);

                notifierMock.expects('error').withArgs(failureReason);
                $scope.questionDelete();
            });
        });

        afterEach(function () {
            questionMethodDeleteQuestionSpy.withArgs(QUESTION_ID).called.should.be.equal(true);
            questionMethodDeleteQuestionStub.restore();
            notifierMock.verify();
            notifierMock.restore();
        });
    });

    describe('#closeDialog', function () {
        it('closes the dialog', function () {
            var ngDialogMock = sinon.mock(ngDialog);
            $scope.closeDialog();
            ngDialogMock.verify();
            ngDialogMock.restore();
        });
    });
});
