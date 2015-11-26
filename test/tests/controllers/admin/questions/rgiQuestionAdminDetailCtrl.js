'use strict';
/*jshint -W079 */

describe('rgiQuestionAdminDetailCtrl', function () {
    beforeEach(module('app'));

    var $scope, $location, $routeParams,
        rgiDialogFactory, rgiIdentitySrvc, rgiQuestionSrvc, rgiQuestionMethodSrvc, rgiNotifier,
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
        function (
            $rootScope,
            $controller,
            _$location_,
            _$routeParams_,
            _rgiDialogFactory_,
            _rgiIdentitySrvc_,
            _rgiQuestionSrvc_,
            _rgiQuestionMethodSrvc_,
            _rgiNotifier_
        ) {
            $location = _$location_;
            $routeParams = _$routeParams_;
            rgiDialogFactory = _rgiDialogFactory_;
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
        var notifierMock;

        beforeEach(function () {
            notifierMock = sinon.mock(rgiNotifier);
        });

        describe('INCOMPLETE DATA CASES', function () {
            it('shows an error message if there are no choices', function () {
                $scope.question.question_choices = [];
                notifierMock.expects('error').withArgs('You must supply at least one option!');
                $scope.questionUpdate();
            });

            it('shows an error message if there is no guidance', function () {
                $scope.question.question_choices = [
                    {order: 1, criteria: 'yes'},
                    {order: 2, criteria: 'no'}
                ];
                notifierMock.expects('error').withArgs('You must supply question guidance!');
                $scope.questionUpdate();
            });

            it('shows an error message if the order is not set', function () {
                $scope.question.question_choices = [
                    {order: 1, criteria: 'yes'},
                    {order: 2, criteria: 'no'}
                ];
                $scope.question.question_guidance_text = 'The Guidance';

                notifierMock.expects('error').withArgs('you must supply question order!');
                $scope.questionUpdate();
            });

            it('shows an error message if the question text is not set', function () {
                $scope.question.question_choices = [
                    {order: 1, criteria: 'yes'},
                    {order: 2, criteria: 'no'}
                ];

                $scope.question.question_guidance_text = 'The Guidance';
                $scope.question.question_order = 1;

                notifierMock.expects('error').withArgs('You must supply question text!');
                $scope.questionUpdate();
            });
        });

        describe('COMPLETE DATA CASES', function() {
            var questionMethodDeleteQuestionStub, questionMethodDeleteQuestionSpy;

            beforeEach(function () {
                $scope.question.question_choices = [
                    {order: 1, criteria: 'yes'},
                    {order: 2, criteria: 'no'}
                ];

                $scope.question.question_guidance_text = 'The Guidance';
                $scope.question.question_order = 1;
                $scope.question.question_text = 'The Question';
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
            });
        });

        afterEach(function () {
            notifierMock.verify();
            notifierMock.restore();
        });
    });

    describe('#deleteConfirmDialog', function () {
        it('opens delete dialog', function () {
            var dialogFactoryMock = sinon.mock(rgiDialogFactory);
            dialogFactoryMock.expects('questionDelete').withArgs($scope);

            $scope.deleteConfirmDialog();

            dialogFactoryMock.verify();
            dialogFactoryMock.restore();
        });
    });

    afterEach(function () {
        $routeParams.id = $routeParamsIdBackUp;
        rgiIdentitySrvc.currentUser = identityCurrentUserBackUp;
        questionGetStub.restore();
    });
});
