'use strict';

describe('rgiNotifier', function () {
    beforeEach(module('app'));
    var rgiNotifier, rgiToastr, rgiToastrMock;
    var message = 'MESSAGE';

    beforeEach(inject(function (_rgiNotifier_, _rgiToastr_) {
        rgiToastr = _rgiToastr_;
        rgiNotifier = _rgiNotifier_;
        rgiToastrMock = sinon.mock(rgiToastr);
    }));

    describe('#notify', function () {
        it('calls rgiNotifier.notify', function () {
            rgiToastrMock.expects('success').withArgs(message);
            rgiNotifier.notify(message);
        });
    });

    describe('#error', function () {
        it('calls rgiNotifier.error', function () {
            rgiToastrMock.expects('error').withArgs(message);
            rgiNotifier.error(message);
        });
    });

    afterEach(function () {
        rgiToastrMock.verify();
        rgiToastrMock.restore();
    });

});