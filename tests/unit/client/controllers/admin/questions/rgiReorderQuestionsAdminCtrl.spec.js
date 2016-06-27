'use strict';

describe('rgiReorderQuestionsAdminCtrl', function () {
    beforeEach(module('app'));

    var $scope, $q, rgiNotifier, rgiQuestionMethodSrvc,
        actualErrorHandler, sortableOptionsHandlers, regroupAllowed,
        PRECEPTS = [], QUESTIONS = [], stubs = {}, spies = {};

    beforeEach(inject(
        function (
            $rootScope,
            $controller,
            _$q_,
            rgiHttpResponseProcessorSrvc,
            _rgiNotifier_,
            rgiPreceptGuideSrvc,
            _rgiQuestionMethodSrvc_,
            rgiQuestionSrvc,
            rgiSortableGuideSrvc
        ) {
            $q = _$q_;
            rgiNotifier = _rgiNotifier_;
            rgiQuestionMethodSrvc = _rgiQuestionMethodSrvc_;

            spies.preceptGuideGetQuestionTemplates = sinon.spy(function() {
                return PRECEPTS;
            });

            stubs.preceptGuideGetQuestionTemplates = sinon.stub(rgiPreceptGuideSrvc, 'getQuestionTemplates',
                spies.preceptGuideGetQuestionTemplates);

            stubs.sortableGuideGetOptions = sinon.stub(rgiSortableGuideSrvc, 'getOptions', function(regroup, options) {
                sortableOptionsHandlers = options;
                regroupAllowed = regroup;
            });

            stubs.httpResponseProcessorGetDefaultHandler = sinon.stub(rgiHttpResponseProcessorSrvc, 'getDefaultHandler',
                function(errorMessage) {return errorMessage;});

            spies.questionQuery = sinon.spy(function(criteria, callback, errorHandler) {
                actualErrorHandler = errorHandler;
                callback(QUESTIONS);
            });

            stubs.questionQuery = sinon.stub(rgiQuestionSrvc, 'query', spies.questionQuery);
            $scope = $rootScope.$new();
            $controller('rgiReorderQuestionsAdminCtrl', {$scope: $scope});
        }
    ));

    it('resets the `reordered` flag', function () {
        $scope.reordered.should.be.equal(false);
    });

    it('loads the questions list', function () {
        spies.questionQuery.withArgs({assessment_ID: 'base'}).called.should.be.equal(true);
    });

    it('sets the precepts', function () {
        $scope.precepts.should.deep.equal(PRECEPTS);
    });

    it('processes HTTP failures', function () {
        actualErrorHandler.should.be.equal('Load question data failure');
    });

    describe('sortableOptions', function() {
        it('allows regrouping', function() {
            regroupAllowed.should.be.equal(true);
        });

        it('processes both reordering and regrouping', function() {
            Object.keys(sortableOptionsHandlers).should.deep.equal(['itemMoved', 'orderChanged']);
        });

        describe('#updateOrder', function() {
            var NEW_PRECEPT = 1, QUESTION,
                updateOrder = function(question, newPrecept) {
                    $scope.precepts = [{data: [question]}];
                    QUESTION = question;

                    sortableOptionsHandlers.itemMoved({
                        source: {
                            itemScope: {question: question}
                        },
                        dest: {
                            sortableScope: {
                                precept: {id: 'precept_' + newPrecept}
                            }
                        }
                    });
                },
                testUpdateOrder = function(description, questionOrder, precept, expectedResult) {
                    it(description, function() {
                        updateOrder({question_order: questionOrder, precept: precept}, NEW_PRECEPT);
                        $scope.reordered.should.be.equal(expectedResult);
                    });
                };

            testUpdateOrder('set the `reordered` flag if the order is modified', 0, 1, true);
            testUpdateOrder('set the `reordered` flag if the order is modified', 1, 2, true);
            testUpdateOrder('set the `reordered` flag if the order is modified', 1, 1, false);

            afterEach(function() {
                QUESTION.newOrder.should.be.equal(1);
                QUESTION.newPrecept.should.be.equal(NEW_PRECEPT);
            });
        });
    });

    describe('#reorder', function() {
        var notifierMock, QUESTION, $promise = 'PROMISE',
            set$qAllStub = function(callback) {
                spies.$qAll = sinon.spy(function() {
                    return {then: callback};
                });
                stubs.$qAll = sinon.stub($q, 'all', spies.$qAll);
            },
            setQuestion = function(question) {
                QUESTION = question;
                $scope.precepts = [{data: [question]}];
            };

        beforeEach(function() {
            spies.questionMethodUpdateQuestion = sinon.spy(function() {
                return {$promise: $promise};
            });
            stubs.questionMethodUpdateQuestion = sinon.stub(rgiQuestionMethodSrvc, 'updateQuestion',
                spies.questionMethodUpdateQuestion);

            notifierMock = sinon.mock(rgiNotifier);
        });

        describe('SUCCESS CASE', function() {
            beforeEach(function() {
                set$qAllStub(function(callback) {
                    callback();
                });

                notifierMock.expects('notify').withArgs('The questions have been reordered');
            });

            it('modifies the question order if it is set', function() {
                setQuestion({question_order: 1, newOrder: 2, precept: 1, newPrecept: 1});
            });

            it('modifies the question precept if it is set', function() {
                setQuestion({question_order: 1, newOrder: 1, precept: 1, newPrecept: 2});
            });

            afterEach(function() {
                $scope.reorder();
                QUESTION.question_order.should.be.equal(QUESTION.newOrder);
                QUESTION.precept.should.be.equal(QUESTION.newPrecept);
                spies.$qAll.withArgs([$promise]).called.should.be.equal(true);
            });
        });

        it('shows the failure reason in case of a failure', function() {
            var FAILURE_REASON = 'FAILURE REASON';

            set$qAllStub(function(callbackSuccess, callbackFailure) {
                callbackFailure(FAILURE_REASON);
            });

            notifierMock.expects('error').withArgs(FAILURE_REASON);
            setQuestion({question_order: 1, newOrder: 1, precept: 1, newPrecept: 1});
            $scope.reorder();
        });

        afterEach(function() {
            notifierMock.verify();
            notifierMock.restore();
        });
    });

    afterEach(function() {
        Object.keys(stubs).forEach(function(stubName) {
            stubs[stubName].restore();
        });
    });
});
