'use strict';

describe('rgiUnlinkDocumentDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, $q, rgiDocumentSrvc, rgiHttpResponseProcessorSrvc, rgiNotifier, rgiUnlinkDocumentSrvc;

    beforeEach(inject(
        function ($rootScope, $controller, _$q_, _rgiDocumentSrvc_, _rgiHttpResponseProcessorSrvc_, _rgiNotifier_, _rgiUnlinkDocumentSrvc_) {
            $q = _$q_;
            rgiDocumentSrvc = _rgiDocumentSrvc_;
            rgiHttpResponseProcessorSrvc = _rgiHttpResponseProcessorSrvc_;
            rgiNotifier = _rgiNotifier_;
            rgiUnlinkDocumentSrvc = _rgiUnlinkDocumentSrvc_;

            $scope = $rootScope.$new();
            $controller('rgiUnlinkDocumentDialogCtrl', {$scope: $scope});
        }
    ));

    describe('#unlinkDocument', function() {
        var callbacks = {}, spies = {}, stubs = {},
            PROMISES = {update: 'update promise', delete: 'delete promise'},
            FIELDS = {answers: ['answer'], assessments: ['assessment'], questions: ['question']};

        beforeEach(function() {
            spies.httpResponseProcessorGetDefaultHandler = sinon.spy(function(errorMessage) {
                return errorMessage;
            });
            stubs.httpResponseProcessorGetDefaultHandler = sinon.stub(rgiHttpResponseProcessorSrvc, 'getDefaultHandler',
                spies.httpResponseProcessorGetDefaultHandler);

            spies.$qAll = sinon.spy(function() {
                return {then: function(callbackSuccess, callbackFailure) {
                    callbacks.$qAllSuccess = callbackSuccess;
                    callbacks.$qAllFailure = callbackFailure;
                }};
            });
            stubs.$qAll = sinon.stub($q, 'all', spies.$qAll);

            spies.unlinkDocumentDelete = sinon.spy(function() {
                return {$promise: PROMISES.delete};
            });
            stubs.unlinkDocumentDelete = sinon.stub(rgiUnlinkDocumentSrvc, 'delete', spies.unlinkDocumentDelete);

            spies.documentUpdate = sinon.spy(function() {
                return {$promise: PROMISES.update};
            });
            stubs.documentUpdate = sinon.stub(rgiDocumentSrvc.prototype, '$update', spies.documentUpdate);

            $scope.document = angular.copy(FIELDS);
            $scope.unlinkDocument();
        });

        it('executes a callback on all promises resolution', function() {
            stubs.$qAll.withArgs([PROMISES.update, PROMISES.delete]).called.should.be.equal(true);
        });

        it('process HTTP failures', function() {
            callbacks.$qAllFailure.should.be.equal('Unlink document failure');
        });

        Object.keys(FIELDS).forEach(function(field) {
            it('resets the document ' + field, function() {
                $scope.document[field].should.deep.equal([]);
            });
        });

        it('submits a request to update the answer data', function() {
            spies.documentUpdate.called.should.be.equal(true);
        });

        it('submits a request to unlink the document data', function() {
            spies.unlinkDocumentDelete.called.should.be.equal(true);
        });

        describe('CALLBACK', function() {
            var mocks = {};

            beforeEach(function() {
                mocks.notifier = sinon.mock(rgiNotifier);
            });

            describe('SUCCESS CASE', function() {
                beforeEach(function() {
                    $scope.closeThisDialog = sinon.spy();
                    mocks.notifier.expects('notify').withArgs('The document has been deleted');
                    callbacks.$qAllSuccess({});
                });

                it('closes the dialog', function() {
                    $scope.closeThisDialog.called.should.be.equal(true);
                });
            });

            describe('FAILURE CASE', function() {
                beforeEach(function() {
                    var REASON = 'reason';
                    mocks.notifier.expects('error').withArgs(REASON);
                    callbacks.$qAllSuccess({reason: REASON});
                });

                Object.keys(FIELDS).forEach(function(field) {
                    it('restores the document ' + field, function() {
                        $scope.document[field].should.deep.equal(FIELDS[field]);
                    });
                });
            });

            afterEach(function() {
                Object.keys(mocks).forEach(function(mockName) {
                    mocks[mockName].verify();
                    mocks[mockName].restore();
                });
            });
        });

        afterEach(function() {
            Object.keys(stubs).forEach(function(stubName) {
                stubs[stubName].restore();
            });
        });
    });
});
