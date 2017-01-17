'use strict';

describe('rgiCalendarCtrl', function () {
    beforeEach(module('app'));
    var $scope;

    beforeEach(inject(
        function ($rootScope, $controller) {
            $scope = $rootScope.$new();
            $controller('rgiCalendarCtrl', {$scope: $scope});
        }
    ));

    it('limits the date range to now', function() {
        (new Date().getTime() - $scope.date_max_limit.getTime() < 100).should.be.equal(true);
    });

    it('initializes the date options', function() {
        $scope.date_options.should.deep.equal({formatYear: 'yy', startingDay: 1});
    });

    it('initializes the date format', function() {
        $scope.date_format.should.be.equal('dd-MMMM-yyyy');
    });

    it('initializes the `opened` status', function() {
        $scope.status.opened.should.be.equal(false);
    });

    describe('#openCalendar', function() {
        it('sets the `opened` status', function() {
            $scope.openCalendar();
            $scope.status.opened.should.be.equal(true);
        });
    });
});
