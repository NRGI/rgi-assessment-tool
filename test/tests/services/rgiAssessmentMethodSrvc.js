'use strict';
/*jslint nomen: true newcap: true */
var describe, beforeEach, it, inject, expect;

describe('rgiAssessmentMethodSrvc', function () {
    beforeEach(module('app'));

    var rgiAssessmentMethodSrvc;
    var $q, rgiAssessmentSrvc;
    var $qDeferStub, $qDeferSpy, expectedPromise;

    beforeEach(inject(function (_rgiAssessmentMethodSrvc_, _$q_, _rgiAssessmentSrvc_) {
        $q = _$q_;
        rgiAssessmentSrvc = _rgiAssessmentSrvc_;
        rgiAssessmentMethodSrvc = _rgiAssessmentMethodSrvc_;
    }));

    describe('#createAssessment', function () {
        var rgiAssessmentSrvcStub;

        it('resolves the deferred in positive case', function () {
            expectedPromise = 'POSITIVE';

            rgiAssessmentSrvcStub = sinon.stub(rgiAssessmentSrvc.prototype, '$save', function() {
                return {
                    then: function(callback) {
                        callback();
                    }
                };
            });

            $qDeferSpy = sinon.spy();
            $qDeferStub = sinon.stub($q, 'defer', function() {
                return {
                    resolve: $qDeferSpy,
                    promise: expectedPromise
                };
            });

            rgiAssessmentMethodSrvc.createAssessment([expectedPromise]).should.be.equal(expectedPromise);
            $qDeferSpy.called.should.be.equal(true);
        });

        it('resolves the deferred in positive case', function () {
            expectedPromise = 'NEGATIVE';
            var REJECT_RESPONSE = {
                data: {reason: 'REJECT_INSERTION'}
            };

            rgiAssessmentSrvcStub = sinon.stub(rgiAssessmentSrvc.prototype, '$save', function() {
                return {
                    then: function(callbackPositive, callbackNegative) {
                        callbackNegative(REJECT_RESPONSE);
                    }
                };
            });

            $qDeferSpy = sinon.spy();
            $qDeferStub = sinon.stub($q, 'defer', function() {
                return {
                    reject: $qDeferSpy,
                    promise: expectedPromise
                };
            });

            rgiAssessmentMethodSrvc.createAssessment([expectedPromise]).should.be.equal(expectedPromise);
            $qDeferSpy.should.have.been.calledWith(REJECT_RESPONSE.data.reason);
        });

        afterEach(function () {
            rgiAssessmentSrvcStub.restore();
        });
    });

    describe('#updateAssessment', function () {
        it('resolves the deferred in positive case', function () {
            expectedPromise = 'POSITIVE';

            $qDeferSpy = sinon.spy();
            $qDeferStub = sinon.stub($q, 'defer', function() {
                return {
                    resolve: $qDeferSpy,
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

            $qDeferSpy.called.should.be.equal(true);
        });

    });

    afterEach(function () {
        $qDeferStub.restore();
    });
});