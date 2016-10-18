'use strict';

angular.module('app').factory('rgiReferenceListSrvc', function () {
    var getLength = function(references, user, checkReference) {
        var length = 0;

        if(references !== undefined) {
            references.forEach(function(reference) {
                if(!reference.hidden && checkReference(reference, user)) {
                    length++;
                }
            });
        }

        return length;
    };

    var referenceList = {
        getLength: function(references, user) {
            return getLength(references, user, function(reference, user) {
                if(user === undefined) {
                    return true;
                } else {
                    return reference.author._id ? reference.author._id === user._id : reference.author === user._id;
                }
            });
        },
        isAnyBelongingToTheUserType: function(references, user) {
            return getLength(references, user, function(ref, user) {
                return (user !== undefined) && (ref.author.role !== undefined) && (ref.author.role === user.role);
            }) > 0;
        },
        isEmpty: function(references, user) {
            return referenceList.getLength(references, user) === 0;
        }
    };

    return referenceList;
});
