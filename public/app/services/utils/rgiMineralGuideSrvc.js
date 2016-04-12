'use strict';

angular.module('app').factory('rgiMineralGuideSrvc', function () {
    return {
        list: function() {
            return [
                'Bauxite',
                'Copper',
                'Diamond',
                'Gold',
                'Iron ore',
                'Nickel',
                'Phosphate -Precious stones (Jade)',
                'Uranium'
            ];
        }
    };
});
