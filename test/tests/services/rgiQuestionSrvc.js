'use strict';
/*jshint -W079 */

var describe, beforeEach, it, inject, expect;

describe('rgiQuestionSrvc', function () {
    var questionServiceInstance, $httpBackend;

    beforeEach(module('app'));

    beforeEach(inject(function(rgiQuestionSrvc, _$httpBackend_) {
        $httpBackend = _$httpBackend_;
        questionServiceInstance = new rgiQuestionSrvc();
    }));

    it('requests question data for a given `questionId`', function () {
        var questionId = 1;
        $httpBackend.expectGET('/api/questions/' + questionId).respond('');
        questionServiceInstance.$query({_id: questionId});
    });

    afterEach(function() {
        $httpBackend.flush();
    });
});