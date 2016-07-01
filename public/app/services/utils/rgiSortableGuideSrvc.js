'use strict';

angular.module('app').factory('rgiSortableGuideSrvc', function (_) {
    var sortableGuide = {
        getOptions: function(acceptRegroup, extraOptions) {
            var options = {
                accept: function (sourceItemHandleScope, destSortableScope) {
                    return acceptRegroup || (sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id);
                },
                clone: false,
                allowDuplicates: false
            };

            if(extraOptions !== undefined) {
                _.extend(options, extraOptions);
            }

            return options;
        },
        getDefaultOptions: function(orderChangedCallback) {
            return sortableGuide.getOptions(false, {orderChanged: orderChangedCallback});
        }
    };

    return sortableGuide;
});
