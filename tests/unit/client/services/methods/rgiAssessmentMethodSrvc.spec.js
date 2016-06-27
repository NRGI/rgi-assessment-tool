'use strict';

describe('rgiAssessmentMethodSrvc', function () {
    beforeEach(module('app'));

    var rgiAssessmentMethodSrvc;
    var $q, rgiAssessmentSrvc;
    var stubs = {}, spies = {}, expectedPromise, REJECT_RESPONSE = 'REJECTED RESPONSE';

    beforeEach(inject(function (_rgiAssessmentMethodSrvc_, _$q_, _rgiAssessmentSrvc_, rgiHttpResponseProcessorSrvc) {
        $q = _$q_;
        rgiAssessmentSrvc = _rgiAssessmentSrvc_;
        rgiAssessmentMethodSrvc = _rgiAssessmentMethodSrvc_;

        spies.httpResponseProcessorHandle = sinon.spy();
        stubs.httpResponseProcessorHandle = sinon.stub(rgiHttpResponseProcessorSrvc, 'handle',
            spies.httpResponseProcessorHandle);

        stubs.httpResponseProcessorGetMessage = sinon.stub(rgiHttpResponseProcessorSrvc, 'getMessage',
            function(response, alternativeMessage) {
                return alternativeMessage;
            });
    }));

    describe('#createAssessment', function () {
        it('resolves the deferred in positive case', function () {
            expectedPromise = 'POSITIVE';

            stubs.assessmentSave = sinon.stub(rgiAssessmentSrvc.prototype, '$save', function() {
                return {
                    then: function(callback) {
                        callback();
                    }
                };
            });

            spies.$qDefer = sinon.spy();
            stubs.$qDefer = sinon.stub($q, 'defer', function() {
                return {
                    resolve: spies.$qDefer,
                    promise: expectedPromise
                };
            });

            rgiAssessmentMethodSrvc.createAssessment([expectedPromise]).should.be.equal(expectedPromise);
            spies.$qDefer.called.should.be.equal(true);
        });

        it('resolves the deferred in positive case', function () {
            expectedPromise = 'NEGATIVE';

            stubs.assessmentSave = sinon.stub(rgiAssessmentSrvc.prototype, '$save', function() {
                return {
                    then: function(callbackPositive, callbackNegative) {
                        callbackNegative(REJECT_RESPONSE);
                    }
                };
            });

            spies.$qDefer = sinon.spy();
            stubs.$qDefer = sinon.stub($q, 'defer', function() {
                return {
                    reject: spies.$qDefer,
                    promise: expectedPromise
                };
            });

            rgiAssessmentMethodSrvc.createAssessment([expectedPromise]).should.be.equal(expectedPromise);
            spies.$qDefer.should.have.been.calledWith('Save assessment failure');
        });
    });

    describe('#updateAssessment', function () {
        it('resolves the deferred in positive case', function () {
            expectedPromise = 'POSITIVE';

            spies.$qDefer = sinon.spy();
            stubs.$qDefer = sinon.stub($q, 'defer', function() {
                return {
                    resolve: spies.$qDefer,
                    promise: expectedPromise
                };
            });

            rgiAssessmentMethodSrvc.updateAssessment({
                $update: function() {
                    return {
                        then: function(callbackPositive) {
                            callbackPositive();
                        }
                    };
                }
            }).should.be.equal(expectedPromise);

            spies.$qDefer.called.should.be.equal(true);
        });

        it('rejects the deferred in negative case', function () {
            expectedPromise = 'NEGATIVE';

            spies.$qDefer = sinon.spy();
            stubs.$qDefer = sinon.stub($q, 'defer', function() {
                return {
                    reject: spies.$qDefer,
                    promise: expectedPromise
                };
            });

            rgiAssessmentMethodSrvc.updateAssessment({
                $update: function() {
                    return {
                        then: function(uselessCallbackPositive, callbackNegative) {
                            callbackNegative({});
                        }
                    };
                }
            }).should.be.equal(expectedPromise);

            spies.$qDefer.should.have.been.calledWith('Save assessment failure');
        });
    });

    afterEach(function () {
        Object.keys(stubs).forEach(function(stubName) {
            stubs[stubName].restore();
        });
    });
});
