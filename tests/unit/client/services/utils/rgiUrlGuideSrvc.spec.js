'use strict';

describe('rgiUrlGuideSrvc', function () {
    var rgiUrlGuideSrvc, rgiIdentitySrvc, identityCurrentUserBackup, ASSESSMENT_ID = 'KGZ-2017-MI',
        ROLES = {
            supervisor: {label: 'A SUPERVISOR', uri: '/admin/assessments-admin'},
            viewer: {label: 'NOT A SUPERVISOR', uri: '/assessments'}
        };

    beforeEach(module('app'));

    beforeEach(inject(function(_rgiUrlGuideSrvc_, _rgiIdentitySrvc_) {
        rgiUrlGuideSrvc = _rgiUrlGuideSrvc_;
        rgiIdentitySrvc = _rgiIdentitySrvc_;
        identityCurrentUserBackup = angular.copy(rgiIdentitySrvc.currentUser);
    }));

    Object.keys(ROLES).forEach(function(role) {
        describe('THE CURRENT USER IS ' + ROLES[role].label, function() {
            beforeEach(function() {
                rgiIdentitySrvc.currentUser = {role: role};
            });

            describe('#getAssessmentsUrl', function() {
                it('returns assessment base URL based on the current user type', function() {
                    rgiUrlGuideSrvc.getAssessmentsUrl().should.be.equal(ROLES[role].uri);
                });
            });

            describe('#getAssessmentUrl', function() {
                it('returns assessment URL based on the current user type', function() {
                    rgiUrlGuideSrvc.getAssessmentUrl(ASSESSMENT_ID).should.be.equal(ROLES[role].uri + '/' + ASSESSMENT_ID);
                });
            });

            describe('#getAnswerUrl', function() {
                [{order: 7, id: '007'}, {order: 14, id: '014'}, {order: 147, id: '147'}].forEach(function(answerId) {
                    it('returns answer URL based on the current user type', function() {
                        rgiUrlGuideSrvc.getAnswerUrl(ASSESSMENT_ID, answerId.order).should.be.equal(ROLES[role].uri +
                            '/answer/' + ASSESSMENT_ID + '-' + answerId.id);
                    });
                });
            });
        });
    });

    afterEach(function() {
        rgiIdentitySrvc.currentUser = identityCurrentUserBackup;
    });
});
