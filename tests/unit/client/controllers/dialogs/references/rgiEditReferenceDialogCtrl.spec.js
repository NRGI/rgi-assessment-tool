'use strict';

describe('rgiEditReferenceDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, $rootScope, rgiAnswerMethodSrvc, rgiHttpResponseProcessorSrvc, rgiIntervieweeSrvc, rgiNotifier,
        REFERENCE, REFERENCE_INDEX = 'REFERENCE INDEX', actualErrorHandler, spies = {}, stubs = {},
        initialize = function(citationType, doExtra) {
            beforeEach(inject(function ($controller) {
                REFERENCE = {citation_type: citationType};
                $scope.$parent.$parent.answer.references[REFERENCE_INDEX] = REFERENCE;
                doExtra();
                $controller('rgiEditReferenceDialogCtrl', {$scope: $scope});
            }));
        };

    beforeEach(inject(
        function (
            $controller,
            _$rootScope_,
            _rgiAnswerMethodSrvc_,
            _rgiHttpResponseProcessorSrvc_,
            _rgiIntervieweeSrvc_,
            _rgiNotifier_
        ) {
            $rootScope = _$rootScope_;
            rgiAnswerMethodSrvc = _rgiAnswerMethodSrvc_;
            rgiHttpResponseProcessorSrvc = _rgiHttpResponseProcessorSrvc_;
            rgiIntervieweeSrvc = _rgiIntervieweeSrvc_;
            rgiNotifier = _rgiNotifier_;

            $scope = $rootScope.$new();
            $scope.$parent = {$parent: {
                answer: {references: {}},
                ref_index: REFERENCE_INDEX
            }};
        }
    ));

    describe('`document` citation type', function() {
        initialize('document', function() {});

        it('sets the reference data', function() {
            $scope.ref.should.be.equal(REFERENCE);
        });

        describe('#editReference', function() {
            var mocks = {};

            beforeEach(function() {
                mocks.notifier = sinon.mock(rgiNotifier);
                $scope.closeThisDialog = sinon.spy();
            });

            describe('VALID DATA', function() {
                var setStub = function(callback) {
                    spies.answerMethodUpdateAnswer = sinon.spy(function() {
                        return {then: callback};
                    });

                    stubs.answerMethodUpdateAnswer = sinon.stub(rgiAnswerMethodSrvc, 'updateAnswer',
                        spies.answerMethodUpdateAnswer);
                };

                beforeEach(function() {
                    $scope.ref.date_accessed = true;
                });

                describe('SUCCESS CASE', function() {
                    beforeEach(function() {
                        setStub(function(callback) {
                            callback();
                            return {finally: function(finalCallback) {finalCallback();}};
                        });

                        mocks.$rootScope = sinon.mock($rootScope);
                        mocks.$rootScope.expects('$broadcast').withArgs('RESET_REFERENCE_ACTION');

                        mocks.notifier.expects('notify').withArgs('The reference has been edited');
                        $scope.editReference(REFERENCE_INDEX);
                    });

                    it('submits a request to update the answer data', function() {
                        spies.answerMethodUpdateAnswer.withArgs($scope.$parent.$parent.answer)
                            .called.should.be.equal(true);
                    });

                    it('shows a notification', function() {
                        mocks.notifier.verify();
                    });

                    it('sends a broadcast message', function() {
                        mocks.$rootScope.verify();
                    });
                });

                it('shows the failure reason in case of a failure', function() {
                    var FAILURE_REASON = 'FAILURE REASON';
                    mocks.notifier.expects('error').withArgs(FAILURE_REASON);


                    setStub(function(callbackSuccess, callbackFailure) {
                        callbackFailure(FAILURE_REASON);
                        return {finally: function(finalCallback) {finalCallback();}};
                    });

                    $scope.editReference(REFERENCE_INDEX);
                    mocks.notifier.verify();
                });

                afterEach(function() {
                    $scope.closeThisDialog.called.should.be.equal(true);
                });
            });

            it('shows an error message if the date is missed', function() {
                $scope.ref.date_accessed = false;
                mocks.notifier.expects('error').withArgs('You must select the date');
                $scope.editReference(REFERENCE_INDEX);
                mocks.notifier.verify();
            });

            afterEach(function() {
                Object.keys(mocks).forEach(function(mockName) {
                    mocks[mockName].restore();
                });
            });
        });
    });

    describe('`interview` citation type', function() {
        var INTERVIEWEE = 'INTERVIEWEE', INTERVIEWEE_ID = 'INTERVIEWEE ID',
            initializeInterviewController = function(interviewee) {
                stubs.httpResponseProcessorGetDefaultHandler = sinon.stub(rgiHttpResponseProcessorSrvc, 'getDefaultHandler',
                    function(errorMessage) {return errorMessage;});

                spies.intervieweeGet = sinon.spy(function(criteria, callback, errorHandler) {
                    actualErrorHandler = errorHandler;
                    callback(INTERVIEWEE);
                });

                stubs.intervieweeGet = sinon.stub(rgiIntervieweeSrvc, 'get', spies.intervieweeGet);
                $scope.$parent.$parent.answer.references[REFERENCE_INDEX].interviewee_ID = interviewee;
            };

        describe('INTERVIEWEE OBJECT', function() {
            initialize('interview', function() {
                initializeInterviewController({_id: INTERVIEWEE_ID});
            });

            it('sets the reference data', function() {
                $scope.ref.should.be.equal(REFERENCE);
            });

            it('sets HTTP error handler', function() {
                actualErrorHandler.should.be.equal('Load interviewee data failure');
            });

            it('sends an HTTP request to get interviewee data', function() {
                spies.intervieweeGet.withArgs({_id: INTERVIEWEE_ID}).called.should.be.equal(true);
            });

            it('sets the interviewee data', function() {
                $scope.interviewee.should.be.equal(INTERVIEWEE);
            });
        });

        describe('INTERVIEWEE ID', function() {
            initialize('interview', function() {
                initializeInterviewController(INTERVIEWEE_ID);
            });

            it('sends an HTTP request to get interviewee data', function() {
                spies.intervieweeGet.withArgs({_id: INTERVIEWEE_ID}).called.should.be.equal(true);
            });
        });
    });

    afterEach(function() {
        Object.keys(stubs).forEach(function(stubName) {
            stubs[stubName].restore();
        });
    });
});
