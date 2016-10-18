'use strict';

describe('rgiReferenceListSrvc', function () {
    var rgiReferenceListSrvc;

    beforeEach(module('app'));

    beforeEach(inject(function(_rgiReferenceListSrvc_) {
        rgiReferenceListSrvc = _rgiReferenceListSrvc_;
    }));

    describe('#getLength', function() {
        var AUTHOR_ID = 'author id';

        it('counts references by author id', function() {
            var references = [
                {author: AUTHOR_ID, hidden: false},
                {author: AUTHOR_ID, hidden: false},
                {author: 'another author', hidden: false}
            ];

            rgiReferenceListSrvc.getLength(references, {_id: AUTHOR_ID}).should.be.equal(2);
        });

        it('counts references by author object', function() {
            var references = [
                {author: {_id: AUTHOR_ID}, hidden: false},
                {author: {_id: AUTHOR_ID}, hidden: false},
                {author: 'another author', hidden: false}
            ];

            rgiReferenceListSrvc.getLength(references, {_id: AUTHOR_ID}).should.be.equal(2);
        });

        it('skips hidden references', function() {
            var references = [
                {author: AUTHOR_ID, hidden: true},
                {author: {_id: AUTHOR_ID}, hidden: true},
                {author: 'another author', hidden: false}
            ];

            rgiReferenceListSrvc.getLength(references, {_id: AUTHOR_ID}).should.be.equal(0);
        });

        it('counts all non-hidden references if the author is not set', function() {
            var references = [
                {author: AUTHOR_ID, hidden: false},
                {author: {_id: AUTHOR_ID}, hidden: true},
                {author: 'another author', hidden: false}
            ];

            rgiReferenceListSrvc.getLength(references, undefined).should.be.equal(2);
        });
    });

    describe('#isAnyBelongingToTheUserType', function() {
        var ROLE = 'researcher';

        it('counts references by role match', function() {
            var references = [
                {author: {role: ROLE}, hidden: false},
                {author: {role: ROLE}, hidden: false},
                {author: {role: 'supervisor'}, hidden: false}
            ];

            rgiReferenceListSrvc.isAnyBelongingToTheUserType(references, {role: ROLE}).should.not.be.equal(false);
        });

        it('skips references without author role', function() {
            var references = [
                {author: {}, hidden: false},
                {author: {role: 'supervisor'}, hidden: false}
            ];

            rgiReferenceListSrvc.isAnyBelongingToTheUserType(references, {role: ROLE}).should.not.be.equal(true);
        });

        it('returns `false` if the user is not set', function() {
            var references = [
                {author: {role: ROLE}, hidden: false},
                {author: {role: ROLE}, hidden: false},
                {author: {role: 'supervisor'}, hidden: false}
            ];

            rgiReferenceListSrvc.isAnyBelongingToTheUserType(references, undefined).should.not.be.equal(true);
        });
    });

    describe('#isEmpty', function() {
        var AUTHOR_ID = 'author id';

        it('counts references by author id', function() {
            var references = [
                {author: AUTHOR_ID, hidden: false},
                {author: AUTHOR_ID, hidden: false},
                {author: 'another author', hidden: false}
            ];

            rgiReferenceListSrvc.isEmpty(references, {_id: AUTHOR_ID}).should.be.equal(false);
        });

        it('counts references by author object', function() {
            var references = [
                {author: {_id: AUTHOR_ID}, hidden: false},
                {author: {_id: AUTHOR_ID}, hidden: false},
                {author: 'another author', hidden: false}
            ];

            rgiReferenceListSrvc.isEmpty(references, {_id: AUTHOR_ID}).should.be.equal(false);
        });

        it('skips hidden references', function() {
            var references = [
                {author: AUTHOR_ID, hidden: true},
                {author: {_id: AUTHOR_ID}, hidden: true},
                {author: 'another author', hidden: false}
            ];

            rgiReferenceListSrvc.isEmpty(references, {_id: AUTHOR_ID}).should.be.equal(true);
        });

        it('counts all non-hidden references if the author is not set', function() {
            var references = [
                {author: AUTHOR_ID, hidden: false},
                {author: {_id: AUTHOR_ID}, hidden: true},
                {author: 'another author', hidden: false}
            ];

            rgiReferenceListSrvc.isEmpty(references, undefined).should.be.equal(false);
        });
    });
});
