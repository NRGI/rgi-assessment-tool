'use strict';
/*jshint -W079 */

describe('rgiQuestionAdminDetailCtrl', function () {
    beforeEach(module('app'));

    var $scope, $location, $route, $routeParams,
        rgiDialogFactory, rgiPreceptGuideSrvc, rgiQuestionSrvc, rgiQuestionMethodSrvc, rgiNotifier,
        questionGetStub, questionGetSpy,
        getPreceptsStub, getPreceptsSpy, PRECEPTS = 'PRECEPTS',
        $routeParamsIdBackUp, $routeParamsId = 'QUESTION-ID',
        questionData = {
            _id: 'QUESTION-ID',
            comments: [],
            question_criteria: [
                {order: 1, criteria: 'yes'},
                {order: 2, criteria: 'no'}
            ]
        };

    beforeEach(inject(
        function (
            $rootScope,
            $controller,
            _$location_,
            _$route_,
            _$routeParams_,
            _rgiDialogFactory_,
            _rgiPreceptGuideSrvc_,
            _rgiQuestionSrvc_,
            _rgiQuestionMethodSrvc_,
            _rgiNotifier_
        ) {
            $location = _$location_;
            $route = _$route_;
            $routeParams = _$routeParams_;
            rgiDialogFactory = _rgiDialogFactory_;
            rgiPreceptGuideSrvc = _rgiPreceptGuideSrvc_;
            rgiQuestionSrvc = _rgiQuestionSrvc_;
            rgiQuestionMethodSrvc = _rgiQuestionMethodSrvc_;
            rgiNotifier = _rgiNotifier_;

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

            getPreceptsSpy = sinon.spy(function () {
                return PRECEPTS;
            });
            getPreceptsStub = sinon.stub(rgiPreceptGuideSrvc, 'getPrecepts', getPreceptsSpy);

            $scope = $rootScope.$new();
            $controller('rgiQuestionAdminDetailCtrl', {$scope: $scope});
        }
    ));

    it('loads initial question data by question id got as the route parameter', function () {
        questionGetSpy.withArgs({_id: $routeParamsId}).called.should.be.equal(true);
        $scope.question.should.deep.equal(questionData);
    });

    it('sets the precept options', function () {
        getPreceptsSpy.called.should.be.equal(true);
        $scope.precept_options.should.be.equal(PRECEPTS);
    });

    it('sets the page type', function () {
        $scope.page_type.should.be.equal('question');
    });

    it('sets type options', function () {
        $scope.type_options.should.deep.equal([
            {value: 'context', text: 'Context'},
            {value: 'scored', text: 'Scored'},
            {value: 'shadow', text: 'Shadow'}
        ]);
    });

    it('initializes components data', function () {
        $scope.component_options.should.deep.equal([
            {value: 'legal', text: 'Legal and Regulatory Structure'},
            {value: 'oversight', text: 'Oversight and Compliance'},
            {value: 'reporting', text: 'Reporting and Disclosure Practices'}
        ]);
    });

    describe('#questionOptionAdd', function () {
        var questionChoice;

        beforeEach(function() {
            $scope.question.question_criteria = [{
                letter: 'a',
                order: 1,
                value: 2
            }];

            $scope.questionOptionAdd();
            questionChoice = $scope.question.question_criteria[$scope.question.question_criteria.length - 1];
        });

        it('adds a new option with the next `order` value', function () {
            questionChoice.order.should.be.equal(2);
        });

        it('adds a new option with the next `value` value', function () {
            questionChoice.value.should.be.equal(3);
        });

        it('adds a new option with the next `order` value', function () {
            questionChoice.letter.should.be.equal('b');
        });

        it('adds a new option with an empty `text` value', function () {
            questionChoice.text.should.be.equal('');
        });
    });

    describe('#questionOptionDelete', function () {
        it('removes choice data', function () {
            var choiceIndex = 0, choiceData = angular.copy($scope.question.question_criteria[choiceIndex]);
            $scope.questionOptionDelete();
            $scope.question.question_criteria[choiceIndex].should.not.deep.equal(choiceData);
        });
    });

    describe('#questionClear', function () {
        it('reloads the page', function () {
            var $routeMock = sinon.mock($route);
            $routeMock.expects('reload');

            $scope.questionClear();

            $routeMock.verify();
            $routeMock.restore();
        });
    });

    describe('#questionUpdate', function () {
        var notifierMock;

        beforeEach(function () {
            notifierMock = sinon.mock(rgiNotifier);
        });

        describe('INCOMPLETE DATA CASES', function () {
            it('shows an error message if there are no choices', function () {
                $scope.question.question_criteria = [];
                notifierMock.expects('error').withArgs('You must supply at least one option!');
                $scope.questionUpdate();
            });

            it('shows an error message if there is no guidance', function () {
                $scope.question.question_criteria = [
                    {order: 1, criteria: 'yes'},
                    {order: 2, criteria: 'no'}
                ];
                notifierMock.expects('error').withArgs('You must supply question guidance!');
                $scope.questionUpdate();
            });

            it('shows an error message if the order is not set', function () {
                $scope.question.question_criteria = [
                    {order: 1, criteria: 'yes'},
                    {order: 2, criteria: 'no'}
                ];
                $scope.question.question_guidance_text = 'The Guidance';

                notifierMock.expects('error').withArgs('you must supply question order!');
                $scope.questionUpdate();
            });

            it('shows an error message if the question text is not set', function () {
                $scope.question.question_criteria = [
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
                $scope.question.question_criteria = [
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
        questionGetStub.restore();
        getPreceptsStub.restore();
    });
});
