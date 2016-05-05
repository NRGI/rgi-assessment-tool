'use strict';

angular.module('app').factory('rgiSortableGuideSrvc', function () {
    return {
        getOptions: function(orderChangedCallback) {
            return {
                accept: function (sourceItemHandleScope, destSortableScope) {
                    return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
                },
                orderChanged: orderChangedCallback,
                clone: false,
                allowDuplicates: false
            };
        }
    };
});
