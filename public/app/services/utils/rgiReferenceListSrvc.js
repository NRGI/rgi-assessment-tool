'use strict';

angular.module('app').factory('rgiReferenceListSrvc', function () {
    var isAuthor = function(reference, user) {
        if(user === undefined) {
            return true;
        } else {
            return reference.author._id ? reference.author._id === user._id : reference.author === user._id;
        }
    };

    var referenceList = {
        getLength: function(references, user) {
            var length = 0;

            if(references !== undefined) {
                references.forEach(function(reference) {
                    if(!reference.hidden && isAuthor(reference, user)) {
                        length++;
                    }
                });
            }

            return length;
        },
        isEmpty: function(references, user) {
            return referenceList.getLength(references, user) === 0;
        }
    };

    return referenceList;
});
