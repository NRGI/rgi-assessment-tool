/*jslint node: true */
'use strict';
/*jslint nomen: true newcap: true */
var _, angular, describe, beforeEach, afterEach, it, inject, expect, sinon;

describe('rgiQuestionAdminDetailCtrl', function () {
    beforeEach(module('app'));

    var $scope, $location, $routeParams, ngDialog, rgiIdentitySrvc, rgiQuestionSrvc, rgiQuestionMethodSrvc, rgiNotifier,
        questionGetStub, questionGetSpy,
        $routeParamsIdBackUp, $routeParamsId = 'QUESTION-ID',
        identityCurrentUserBackUp, identityCurrentUser = 'CURRENT USER',
        questionData = {
            _id: 'QUESTION-ID',
            comments: [],
            question_choices: [
                {order: 1, criteria: 'yes'},
                {order: 2, criteria: 'no'}
            ]
        };

    beforeEach(inject(
        function ($rootScope, $controller, _$location_, _$routeParams_, _ngDialog_, _rgiIdentitySrvc_, _rgiQuestionSrvc_, _rgiQuestionMethodSrvc_, _rgiNotifier_) {
            $location = _$location_;
            $routeParams = _$routeParams_;
            ngDialog = _ngDialog_;
            rgiIdentitySrvc = _rgiIdentitySrvc_;
            rgiQuestionSrvc = _rgiQuestionSrvc_;
            rgiQuestionMethodSrvc = _rgiQuestionMethodSrvc_;
            rgiNotifier = _rgiNotifier_;

            identityCurrentUserBackUp = rgiIdentitySrvc.currentUser;
            rgiIdentitySrvc.currentUser = identityCurrentUser;

            $routeParamsIdBackUp = $routeParams.id;
            $routeParams.id = $routeParamsId;
            /*jshint unused: true*/
            /*jslint unparam: true*/
            questionGetSpy = sinon.spy(function (question, callback) {
                return callback ? callback(questionData) : questionData;
            });
            /*jshint unused: false*/
            /*jslint unparam: false*/
            questionGetStub = sinon.stub(rgiQuestionSrvc, 'get', questionGetSpy);

            $scope = $rootScope.$new();
            $controller('rgiQuestionAdminDetailCtrl', {$scope: $scope});
        }
    ));

    it('loads initial question data by question id got as the route parameter', function () {
        questionGetSpy.withArgs({_id: $routeParamsId}).called.should.be.equal(true);
        _.isEqual($scope.question, questionData).should.be.equal(true);
        _.isEqual($scope.question_start, questionData).should.be.equal(true);
    });

    it('loads current user data', function () {
        _.isEqual($scope.current_user, identityCurrentUser).should.be.equal(true);
    });

    it('initializes components data', function () {
        _.isEqual($scope.component_options, [
            {value: 'context', text: 'Context'},
            {value: 'government_effectiveness', text: 'Government Effectiveness'},
            {value: 'legal', text: 'Institutional and Legal Setting'},
            {value: 'reporting', text: 'Reporting Practices'},
            {value: 'safeguard_and_quality_control', text: 'Safeguard and Quality Control'},
            {value: 'enabling_environment', text: 'Enabling Environment'},
            {value: 'oversight', text: 'Oversight'}
        ]).should.be.equal(true);
    });

    describe('#questionOptionAdd', function () {
        it('adds a placeholder to add a new option', function () {
            var questionChoice, originalItemsNumber = $scope.question.question_choices.length;
            $scope.questionOptionAdd();

            questionChoice = $scope.question.question_choices[$scope.question.question_choices.length - 1];
            questionChoice.order.should.be.equal(originalItemsNumber + 1);
            questionChoice.criteria.should.be.equal('Enter text');
        });
    });

    describe('#questionOptionDelete', function () {
        it('removes choice data', function () {
            var choiceIndex = 0, choiceData = angular.copy($scope.question.question_choices[choiceIndex]);
            $scope.questionOptionDelete();
            _.isEqual($scope.question.question_choices[choiceIndex], choiceData).should.be.equal(false);
        });
    });

    describe('#questionClear', function () {
        it('re-initializes the question data', function () {
            $scope.question.question_choices[0].criteria = 'Yes, of course';
            $scope.questionClear();
            _.isEqual($scope.question, $scope.question_start).should.be.equal(true);
        });
    });

    describe('#questionUpdate', function () {
        var questionMethodDeleteQuestionStub, questionMethodDeleteQuestionSpy, notifierMock;

        beforeEach(function () {
            notifierMock = sinon.mock(rgiNotifier);
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
                questionMethodDeleteQuestionStub = sinon.stub(rgiQuestionMethodSrvc, 'updateQuestion', questionMethodDeleteQuestionSpy);

                notifierMock.expects('notify').withArgs('Question data has been updated');
                var $locationMock = sinon.mock($location);
                $locationMock.expects('path').withArgs('/admin/question-admin');

                $scope.questionUpdate();
                $locationMock.verify();
                $locationMock.restore();
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
                questionMethodDeleteQuestionStub = sinon.stub(rgiQuestionMethodSrvc, 'updateQuestion', questionMethodDeleteQuestionSpy);

                notifierMock.expects('error').withArgs(failureReason);
                $scope.questionUpdate();
            });
        });

        afterEach(function () {
            questionMethodDeleteQuestionSpy.withArgs($scope.question).called.should.be.equal(true);
            questionMethodDeleteQuestionStub.restore();
            notifierMock.verify();
            notifierMock.restore();
        });
    });

    describe('#deleteConfirmDialog', function () {
        it('calls dialog service with defined parameters', function () {
            var ngDialogMock = sinon.mock(ngDialog);
            ngDialogMock.expects('open').withArgs({
                template: 'partials/dialogs/delete-question-confirmation-dialog',
                controller: 'rgiDeleteQuestionDialogCtrl',
                className: 'ngdialog-theme-default',
                scope: $scope
            });

            $scope.deleteConfirmDialog();

            $scope.value.should.be.equal(true);
            ngDialogMock.verify();
            ngDialogMock.restore();
        });
    });

    describe('#deleteConfirmDialog', function () {
        it('sets the value to TRUE', function () {
            $scope.deleteConfirmDialog();
            $scope.value.should.be.equal(true);
        });

        it('opens a dialog', function () {
            var ngDialogMock = sinon.mock(ngDialog);
            ngDialogMock.expects('open').withArgs({
                template: 'partials/dialogs/delete-question-confirmation-dialog',
                controller: 'rgiDeleteQuestionDialogCtrl',
                className: 'ngdialog-theme-default',
                scope: $scope
            });

            $scope.deleteConfirmDialog();

            ngDialogMock.verify();
            ngDialogMock.restore();
        });

    });

    describe('#questionDelete', function () {
        var questionMethodUpdateQuestionStub, questionMethodUpdateQuestionSpy, notifierMock,
            currentUser;

        beforeEach(function () {
            notifierMock = sinon.mock(rgiNotifier);
            $scope.question.new_comment = 'NEW COMMENT';
            currentUser = {
                _id: 'user-id',
                firstName: 'First Name',
                lastName: 'Last Name',
                role: 'user'
            };
        });

        describe('POSITIVE CASE', function () {
            it('sends a request and displays a success message', function () {
                questionMethodUpdateQuestionSpy = sinon.spy(function () {
                    return {
                        then: function (callback) {
                            callback();
                        }
                    };
                });

                notifierMock.expects('notify').withArgs('Comment added');
            });
        });

        describe('NEGATIVE CASE', function () {
            it('shows error message', function () {
                var failureReason = 'REASON';
                /*jshint unused: true*/
                /*jslint unparam: true*/
                questionMethodUpdateQuestionSpy =  sinon.spy(function () {
                    return {
                        then: function (uselessCallbackPositive, callbackNegative) {
                            callbackNegative(failureReason);
                        }
                    };
                });
                /*jshint unused: true*/
                /*jslint unparam: true*/

                notifierMock.expects('notify').withArgs(failureReason);
            });
        });

        afterEach(function () {
            questionMethodUpdateQuestionStub = sinon.stub(rgiQuestionMethodSrvc, 'updateQuestion', questionMethodUpdateQuestionSpy);
            $scope.commentSubmit(currentUser);

            var questionCopy = angular.copy($scope.question),
                spyArgs = questionMethodUpdateQuestionSpy.args[0][0];
            delete questionCopy.new_comment;

            questionCopy.comments[0].date.substring(0, questionCopy.comments[0].date.length - 4);
            spyArgs.comments[0].date.substring(0, spyArgs.comments[0].date.length - 4);

            _.isEqual(spyArgs, questionCopy).should.be.equal(true);

            questionMethodUpdateQuestionSpy.called.should.be.equal(true);
            questionMethodUpdateQuestionStub.restore();
            notifierMock.verify();
            notifierMock.restore();
        });
    });

    afterEach(function () {
        $routeParams.id = $routeParamsIdBackUp;
        rgiIdentitySrvc.currentUser = identityCurrentUserBackUp;
        questionGetStub.restore();
    });
});
