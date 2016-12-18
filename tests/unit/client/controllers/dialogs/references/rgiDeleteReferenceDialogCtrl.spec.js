'use strict';

describe('rgiDeleteReferenceDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, $rootScope, $q, rgiAnswerMethodSrvc, rgiHttpResponseProcessorSrvc, rgiNotifier,
        rgiDocumentSrvc, rgiDocumentMethodSrvc, rgiIntervieweeSrvc, rgiIntervieweeMethodSrvc,
        callbacks = {}, mocks = {}, spies = {}, stubs = {}, expectedPromises,
        actualErrorHandlers, answerMethodUpdateAnswerPromise = 'answer method update answer promise',
        CURRENT_REFERENCE_INDEX = 0, CURRENT_ASSESSMENT_ID = 'KG-2016', CURRENT_ANSWER_ID = CURRENT_ASSESSMENT_ID + '-1',
        setReferences = function(references) {
            while($scope.$parent.$parent.answer.references.length > 1) {
                $scope.$parent.$parent.answer.references.pop();
            }

            Object.keys(references[CURRENT_REFERENCE_INDEX]).forEach(function(field) {
                $scope.$parent.$parent.answer.references[CURRENT_REFERENCE_INDEX][field] =
                    references[CURRENT_REFERENCE_INDEX][field];
            });

            for(var referenceIndex = 1; referenceIndex < references.length; referenceIndex++) {
                $scope.$parent.$parent.answer.references.push(references[referenceIndex]);
            }
        },
        checkCommonExpectations = function(hiddenStatus, notificationMessage) {
            expect(actualErrorHandlers.indexOf('Save reference failure') !== -1).to.equal(true);
            expect($scope.closeThisDialog.called).to.equal(true);
            expect($scope.$parent.$parent.answer.references[CURRENT_REFERENCE_INDEX].hidden).to.equal(hiddenStatus);
            expect(spies.$qAll.withArgs(expectedPromises).called).to.equal(true);

            mocks.$rootScope = sinon.mock($rootScope);
            mocks.$rootScope.expects('$broadcast').withArgs('RESET_REFERENCE_ACTION');

            mocks.notifier = sinon.mock(rgiNotifier);
            mocks.notifier.expects('notify').withArgs(notificationMessage);

            callbacks.$qAll();
            mocks.$rootScope.verify();
            mocks.notifier.verify();
        };

    beforeEach(inject(
        function (
            _$rootScope_,
            $controller,
            _$q_,
            _rgiAnswerMethodSrvc_,
            _rgiDocumentSrvc_,
            _rgiDocumentMethodSrvc_,
            _rgiHttpResponseProcessorSrvc_,
            _rgiIntervieweeSrvc_,
            _rgiIntervieweeMethodSrvc_,
            _rgiNotifier_
        ) {
            rgiAnswerMethodSrvc = _rgiAnswerMethodSrvc_;
            rgiHttpResponseProcessorSrvc = _rgiHttpResponseProcessorSrvc_;
            rgiNotifier = _rgiNotifier_;

            rgiDocumentSrvc = _rgiDocumentSrvc_;
            rgiDocumentMethodSrvc = _rgiDocumentMethodSrvc_;
            rgiIntervieweeSrvc = _rgiIntervieweeSrvc_;
            rgiIntervieweeMethodSrvc = _rgiIntervieweeMethodSrvc_;

            $q = _$q_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();

            $scope.$parent = {$parent: {answer: {answer_ID: CURRENT_ANSWER_ID, assessment_ID: CURRENT_ASSESSMENT_ID}}};
            $scope.$parent.$parent.ref_index = CURRENT_REFERENCE_INDEX;
            $scope.$parent.$parent.answer.references = [
                {_id: 'current reference id', citation_type: 'interview', hidden: false, interviewee_ID: 'dummy'}
            ];

            $controller('rgiDeleteReferenceDialogCtrl', {$scope: $scope});
            expectedPromises = [];
            actualErrorHandlers = [];
            $scope.closeThisDialog = sinon.spy();

            spies.answerMethodUpdateAnswer = sinon.spy(function() {
                return {$promise: answerMethodUpdateAnswerPromise};
            });

            stubs.answerMethodUpdateAnswer = sinon.stub(rgiAnswerMethodSrvc, 'updateAnswer',
                spies.answerMethodUpdateAnswer);

            spies.$qAll = sinon.spy(function() {
                return {then: function(callback, errorHandler) {
                    callbacks.$qAll = callback;
                    actualErrorHandlers.push(errorHandler);
                    return {finally: function(finalCallback) {finalCallback();}};
                }};
            });

            stubs.$qAll = sinon.stub($q, 'all', spies.$qAll);
            expectedPromises.push(answerMethodUpdateAnswerPromise);

            stubs.httpResponseProcessorGetDefaultHandler = sinon.stub(rgiHttpResponseProcessorSrvc, 'getDefaultHandler',
                function(errorMessage) {return errorMessage;});
        }
    ));

    describe('#deleteReference', function() {
        describe('document', function() {
            var documentId = 'current document id';

            beforeEach(function() {
                spies.documentGet = sinon.spy(function(criteria, callback, errorHandler) {
                    callbacks.documentGet = callback;
                    actualErrorHandlers.push(errorHandler);
                });

                stubs.documentGet = sinon.stub(rgiDocumentSrvc, 'get', spies.documentGet);
            });

            describe('MULTIPLE ASSIGNED DOCUMENT REFERENCES LINKED TO THE SAME DOCUMENT', function() {
                beforeEach(function() {
                    setReferences([
                        {
                            _id: 'current document reference id',
                            citation_type: 'document',
                            hidden: false,
                            document_ID: documentId
                        },
                        {
                            _id: 'another document reference id',
                            citation_type: 'document',
                            hidden: false,
                            document_ID: documentId
                        }
                    ]);

                    $scope.deleteReference();
                });

                it('does not unlink the document references', function() {
                    expect(spies.documentGet.called).to.equal(false);
                });
            });

            describe('SINGLE ASSIGNED DOCUMENT REFERENCE TO THE SAME DOCUMENT', function() {
                var documentMethodUpdateDocumentPromise = 'document method update document promise';

                beforeEach(function() {
                    setReferences([
                        {
                            _id: 'current document reference id',
                            citation_type: 'document',
                            hidden: false,
                            document_ID: documentId
                        }
                    ]);

                    spies.documentMethodUpdateDocument = sinon.spy(function() {
                        return {$promise: documentMethodUpdateDocumentPromise};
                    });

                    stubs.documentMethodUpdateDocument = sinon.stub(rgiDocumentMethodSrvc, 'updateDocument',
                        spies.documentMethodUpdateDocument);

                    $scope.deleteReference();
                });

                it('unlink the document references', function() {
                    expect(spies.documentGet.withArgs({_id: documentId}).called).to.equal(true);
                });

                it('process HTTP failures in get document request', function() {
                    expect(actualErrorHandlers.indexOf('Load reference data failure') !== -1).to.equal(true);
                });

                describe('GET DOCUMENT CALLBACK', function() {
                    var DOCUMENT,
                        ANOTHER_ASSESSMENT_ID = 'AU-2016-MI', ANOTHER_ANSWER_ID = ANOTHER_ASSESSMENT_ID + '-2';

                    beforeEach(function() {
                        DOCUMENT = {
                            answers: [ANOTHER_ANSWER_ID, CURRENT_ANSWER_ID],
                            assessments: ['dummy assessment id', CURRENT_ASSESSMENT_ID, ANOTHER_ASSESSMENT_ID]
                        };

                        callbacks.documentGet(DOCUMENT);
                        expectedPromises.push(documentMethodUpdateDocumentPromise);
                    });

                    it('updates the document data', function() {
                        expect(spies.documentMethodUpdateDocument.called).to.equal(true);
                    });

                    it('removes the answer id from the document answer list', function() {
                        expect(DOCUMENT.answers).to.deep.equal([ANOTHER_ANSWER_ID]);
                    });

                    it('cleans up the document assessment list', function() {
                        expect(DOCUMENT.assessments).to.deep.equal([ANOTHER_ASSESSMENT_ID]);
                    });
                });
            });
        });

        describe('interview', function() {
            var intervieweeId = 'current interviewee id';

            beforeEach(function() {
                spies.intervieweeGet = sinon.spy(function(criteria, callback, errorHandler) {
                    callbacks.intervieweeGet = callback;
                    actualErrorHandlers.push(errorHandler);
                });

                stubs.intervieweeGet = sinon.stub(rgiIntervieweeSrvc, 'get', spies.intervieweeGet);
            });

            describe('MULTIPLE INTERVIEWS FROM THE SAME INTERVIEWEE ASSIGNED', function() {
                beforeEach(function() {
                    setReferences([
                        {
                            _id: 'current interview id',
                            citation_type: 'interview',
                            hidden: false,
                            interviewee_ID: intervieweeId
                        },
                        {
                            _id: 'another interview id',
                            citation_type: 'interview',
                            hidden: false,
                            interviewee_ID: intervieweeId
                        }
                    ]);

                    $scope.deleteReference();
                });

                it('does not unlink the interviewee references', function() {
                    expect(spies.intervieweeGet.called).to.equal(false);
                });
            });

            describe('SINGLE INTERVIEW FROM THE INTERVIEWEE ASSIGNED', function() {
                var intervieweeMethodUpdateIntervieweePromise = 'interviewee method update interviewee promise';

                beforeEach(function() {
                    setReferences([
                        {
                            _id: 'current interview id',
                            citation_type: 'interview',
                            hidden: false,
                            interviewee_ID: intervieweeId
                        }
                    ]);

                    spies.intervieweeMethodUpdateInterviewee = sinon.spy(function() {
                        return {$promise: intervieweeMethodUpdateIntervieweePromise};
                    });

                    stubs.intervieweeMethodUpdateInterviewee = sinon.stub(rgiIntervieweeMethodSrvc, 'updateInterviewee',
                        spies.intervieweeMethodUpdateInterviewee);

                    $scope.deleteReference();
                });

                it('unlink the interviewee references', function() {
                    expect(spies.intervieweeGet.withArgs({_id: intervieweeId}).called).to.equal(true);
                });

                it('process HTTP failures in get interviewee request', function() {
                    expect(actualErrorHandlers.indexOf('Load reference data failure') !== -1).to.equal(true);
                });

                describe('GET INTERVIEWEE CALLBACK', function() {
                    var INTERVIEWEE,
                        ANOTHER_ASSESSMENT_ID = 'AU-2016-MI', ANOTHER_ANSWER_ID = ANOTHER_ASSESSMENT_ID + '-2';

                    describe('EXISTING INTERVIEWEE', function() {
                        beforeEach(function() {
                            INTERVIEWEE = {
                                answers: [ANOTHER_ANSWER_ID, CURRENT_ANSWER_ID],
                                assessments: ['dummy assessment id', CURRENT_ASSESSMENT_ID, ANOTHER_ASSESSMENT_ID]
                            };

                            callbacks.intervieweeGet(INTERVIEWEE);
                            expectedPromises.push(intervieweeMethodUpdateIntervieweePromise);
                        });

                        it('updates the interviewee data', function() {
                            expect(spies.intervieweeMethodUpdateInterviewee.called).to.equal(true);
                        });

                        it('removes the answer id from the interviewee answer list', function() {
                            expect(INTERVIEWEE.answers).to.deep.equal([ANOTHER_ANSWER_ID]);
                        });

                        it('cleans up the interviewee assessment list', function() {
                            expect(INTERVIEWEE.assessments).to.deep.equal([ANOTHER_ASSESSMENT_ID]);
                        });
                    });

                    describe('INTERVIEWEE NOT FOUND', function() {
                        beforeEach(function() {
                            INTERVIEWEE = null;
                            callbacks.intervieweeGet(INTERVIEWEE);
                            expectedPromises.push(intervieweeMethodUpdateIntervieweePromise);
                        });

                        it('executed without errors', function() {

                        });
                    });
                });
            });
        });

        afterEach(function() {
            checkCommonExpectations(true,'The reference has been deleted');
        });
    });

    describe('#restoreReference', function() {
        describe('document', function() {
            var documentId = 'current document id';

            beforeEach(function () {
                spies.documentGet = sinon.spy(function (criteria, callback, errorHandler) {
                    callbacks.documentGet = callback;
                    actualErrorHandlers.push(errorHandler);
                });

                stubs.documentGet = sinon.stub(rgiDocumentSrvc, 'get', spies.documentGet);
            });

            describe('MULTIPLE ASSIGNED DOCUMENT REFERENCES LINKED TO THE SAME DOCUMENT', function() {
                beforeEach(function() {
                    setReferences([
                        {
                            _id: 'current document reference id',
                            citation_type: 'document',
                            hidden: false,
                            document_ID: documentId
                        },
                        {
                            _id: 'another document reference id',
                            citation_type: 'document',
                            hidden: false,
                            document_ID: documentId
                        }
                    ]);

                    $scope.restoreReference();
                });

                it('does not supplement the answer & the assessment with the document references', function() {
                    expect(spies.documentGet.called).to.equal(false);
                });
            });

            describe('SINGLE ASSIGNED DOCUMENT REFERENCE TO THE SAME DOCUMENT', function() {
                var documentMethodUpdateDocumentPromise = 'document method update document promise';

                beforeEach(function() {
                    setReferences([
                        {
                            _id: 'current document reference id',
                            citation_type: 'document',
                            hidden: false,
                            document_ID: documentId
                        }
                    ]);

                    spies.documentMethodUpdateDocument = sinon.spy(function() {
                        return {$promise: documentMethodUpdateDocumentPromise};
                    });

                    stubs.documentMethodUpdateDocument = sinon.stub(rgiDocumentMethodSrvc, 'updateDocument',
                        spies.documentMethodUpdateDocument);

                    $scope.restoreReference();
                });

                it('supplements the document references', function() {
                    expect(spies.documentGet.withArgs({_id: documentId}).called).to.equal(true);
                });

                it('process HTTP failures in get document request', function() {
                    expect(actualErrorHandlers.indexOf('Load reference data failure') !== -1).to.equal(true);
                });

                afterEach(function() {
                    spies.answerMethodUpdateAnswer.args[0][0].modified.should.be.equal(true);
                });

                describe('GET DOCUMENT CALLBACK', function() {
                    var DOCUMENT,
                        ANOTHER_ASSESSMENT_ID = 'AU-2016-MI', ANOTHER_ANSWER_ID = ANOTHER_ASSESSMENT_ID + '-2';

                    beforeEach(function() {
                        DOCUMENT = {
                            answers: [ANOTHER_ANSWER_ID],
                            assessments: [ANOTHER_ASSESSMENT_ID]
                        };

                        callbacks.documentGet(DOCUMENT);
                        expectedPromises.push(documentMethodUpdateDocumentPromise);
                    });

                    it('updates the document data', function() {
                        expect(spies.documentMethodUpdateDocument.called).to.equal(true);
                    });

                    it('adds the answer id to the document answer list', function() {
                        expect(DOCUMENT.answers).to.deep.equal([ANOTHER_ANSWER_ID, CURRENT_ANSWER_ID]);
                    });

                    it('adds the assessment id to the document assessment list', function() {
                        expect(DOCUMENT.assessments).to.deep.equal([ANOTHER_ASSESSMENT_ID, CURRENT_ASSESSMENT_ID]);
                    });
                });
            });
        });

        describe('interview', function() {
            var intervieweeId = 'current interviewee id';

            beforeEach(function() {
                spies.intervieweeGet = sinon.spy(function(criteria, callback, errorHandler) {
                    callbacks.intervieweeGet = callback;
                    actualErrorHandlers.push(errorHandler);
                });

                stubs.intervieweeGet = sinon.stub(rgiIntervieweeSrvc, 'get', spies.intervieweeGet);
            });

            describe('MULTIPLE INTERVIEWS FROM THE SAME INTERVIEWEE ASSIGNED', function() {
                beforeEach(function() {
                    setReferences([
                        {
                            _id: 'current interview id',
                            citation_type: 'interview',
                            hidden: false,
                            interviewee_ID: intervieweeId
                        },
                        {
                            _id: 'another interview id',
                            citation_type: 'interview',
                            hidden: false,
                            interviewee_ID: intervieweeId
                        }
                    ]);

                    $scope.restoreReference();
                });

                it('does not supplement the answer & the assessment with the interviewee references', function() {
                    expect(spies.intervieweeGet.called).to.equal(false);
                });
            });

            describe('SINGLE INTERVIEW FROM THE SAME INTERVIEWEE ASSIGNED', function() {
                var intervieweeMethodUpdateIntervieweePromise = 'interviewee method update interviewee promise';

                beforeEach(function() {
                    setReferences([
                        {
                            _id: 'current interview id',
                            citation_type: 'interview',
                            hidden: false,
                            interviewee_ID: intervieweeId
                        }
                    ]);

                    spies.intervieweeMethodUpdateInterviewee = sinon.spy(function() {
                        return {$promise: intervieweeMethodUpdateIntervieweePromise};
                    });

                    stubs.intervieweeMethodUpdateInterviewee = sinon.stub(rgiIntervieweeMethodSrvc, 'updateInterviewee',
                        spies.intervieweeMethodUpdateInterviewee);

                    $scope.restoreReference();
                });

                it('supplements the interviewee references', function() {
                    expect(spies.intervieweeGet.withArgs({_id: intervieweeId}).called).to.equal(true);
                });

                it('process HTTP failures in get interviewee request', function() {
                    expect(actualErrorHandlers.indexOf('Load reference data failure') !== -1).to.equal(true);
                });

                describe('GET INTERVIEWEE CALLBACK', function() {
                    var INTERVIEWEE,
                        ANOTHER_ASSESSMENT_ID = 'AU-2016-MI', ANOTHER_ANSWER_ID = ANOTHER_ASSESSMENT_ID + '-2';

                    beforeEach(function() {
                        INTERVIEWEE = {
                            answers: [ANOTHER_ANSWER_ID],
                            assessments: [ANOTHER_ASSESSMENT_ID]
                        };

                        callbacks.intervieweeGet(INTERVIEWEE);
                        expectedPromises.push(intervieweeMethodUpdateIntervieweePromise);
                    });

                    it('updates the interviewee data', function() {
                        expect(spies.intervieweeMethodUpdateInterviewee.called).to.equal(true);
                    });

                    it('adds the answer id to the interviewee answer list', function() {
                        expect(INTERVIEWEE.answers).to.deep.equal([ANOTHER_ANSWER_ID, CURRENT_ANSWER_ID]);
                    });

                    it('adds the assessment id to the interviewee assessment list', function() {
                        expect(INTERVIEWEE.assessments).to.deep.equal([ANOTHER_ASSESSMENT_ID, CURRENT_ASSESSMENT_ID]);
                    });
                });
            });
        });

        afterEach(function() {
            checkCommonExpectations(false, 'The reference has been restored');
        });
    });

    afterEach(function() {
        Object.keys(mocks).forEach(function(mockName) {
            mocks[mockName].restore();
        });

        Object.keys(stubs).forEach(function(stubName) {
            stubs[stubName].restore();
        });
    });
});
