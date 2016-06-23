'use strict';

describe('rgiSortableGuideSrvc', function () {
    var rgiSortableGuideSrvc;

    beforeEach(module('app'));

    beforeEach(inject(function(_rgiSortableGuideSrvc_) {
        rgiSortableGuideSrvc = _rgiSortableGuideSrvc_;
    }));

    describe('#getDefaultOptions', function() {
        var sortableOptions, orderChangedCallback;

        beforeEach(function() {
            orderChangedCallback = sinon.spy();
            sortableOptions = rgiSortableGuideSrvc.getDefaultOptions(orderChangedCallback);
        });

        it('does not allow duplicates', function() {
            sortableOptions.allowDuplicates.should.be.equal(false);
        });

        it('does not allow clones', function() {
            sortableOptions.clone.should.be.equal(false);
        });

        it('sets a `order changed` event listener', function() {
            sortableOptions.orderChanged();
            orderChangedCallback.called.should.be.equal(true);
        });

        it('accepts reordering', function() {
            sortableOptions.accept({itemScope: {sortableScope: {$id: 'the same'}}}, {$id: 'the same'})
                .should.be.equal(true);
        });

        it('declines regrouping', function() {
            sortableOptions.accept({itemScope: {sortableScope: {$id: 'first one'}}}, {$id: 'another one'})
                .should.be.equal(false);
        });
    });
});
