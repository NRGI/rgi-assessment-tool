'use strict';

angular.module('app').factory('rgiReferenceListSrvc', function () {
    var
        isAuthor = function(reference, user) {
            if(user === undefined) {
                return true;
            } else {
                return reference.author._id ? reference.author._id === user._id : reference.author === user._id;
            }
        },
        isBelongingToUserType = function(reference, user) {
            return (user !== undefined) && (reference.author.role !== undefined) && (reference.author.role === user.role);
        },
        getLength = function(references, user, checkReference) {
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
            return getLength(references, user, isAuthor);
        },
        isAnyBelongingToTheUserType: function(references, user) {
            return getLength(references, user, isBelongingToUserType);
        },
        isEmpty: function(references, user) {
            return referenceList.getLength(references, user) === 0;
        }
    };

    return referenceList;
});
