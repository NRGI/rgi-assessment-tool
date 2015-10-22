'use strict';
/*jshint -W079 */
var describe, beforeEach, it, inject, expect;

describe('rgiAnswerSrvc', function () {
    var answerServiceInstance, $httpBackend;

    beforeEach(module('app'));

    beforeEach(inject(function(rgiAnswerSrvc, _$httpBackend_) {
        $httpBackend = _$httpBackend_;
        answerServiceInstance = new rgiAnswerSrvc();
    }));

    it('requests answer data for a given `answerId`', function () {
        var answerId = 1;
        $httpBackend.expectGET('/api/answers/' + answerId).respond('');
        answerServiceInstance.$get({answer_ID: answerId});
    });

    afterEach(function() {
        $httpBackend.flush();
    });
});