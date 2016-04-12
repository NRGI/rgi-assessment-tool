'use strict';

angular.module('app').factory('rgiReferenceListSrvc', function () {
    return {
        isEmpty: function(references) {
            var listEmpty = true;

            if(references !== undefined) {
                references.forEach(function(reference) {
                    if(!reference.hidden) {
                        listEmpty = false;
                    }
                });
            }

            return listEmpty;
        }
    };
});
