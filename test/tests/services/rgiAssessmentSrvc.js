'use strict';
/*jshint -W079 */

var describe, beforeEach, it, inject, expect;

describe('rgiAssessmentSrvc', function () {
    var assessmentServiceInstance, $httpBackend;

    beforeEach(module('app'));

    beforeEach(inject(function(rgiAssessmentSrvc, _$httpBackend_) {
        $httpBackend = _$httpBackend_;
        assessmentServiceInstance = new rgiAssessmentSrvc();
    }));

    it('requests assessments data for a given `assessmentId`', function () {
        var assessmentId = 1;
        $httpBackend.expectGET('/api/assessments/' + assessmentId).respond([]);
        assessmentServiceInstance.$query({assessment_ID: assessmentId});
    });

    afterEach(function() {
        $httpBackend.flush();
    });
});