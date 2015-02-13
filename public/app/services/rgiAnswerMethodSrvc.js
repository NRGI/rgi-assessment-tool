/*global angular */
'use strict';

var app = angular.module('app').factory('rgiAnswerMethodSrvc', function ($q, rgiAnswerSrvc) {
    return {
        insertAnswerSet: function (newAnswerSet) {
            var dfd = $q.defer();
            var newAnswers = new rgiAnswerSrvc(newAnswerSet);
            newAnswers.length = newAnswerSet.length;
            newAnswers.$save().then(function () {
                dfd.resolve;
            }, function (response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        }

        // updateAnswer: function (newAnswerData) {
        //     var dfd = $q.defer();
        //     console.log(newAnswerData);
        //     newAnswerData.$update().then(function () {
        //         dfd.resolve();
        //     }), function (response) {
        //         dfd.reject(response.data.reason);
        //     };
        //     return dfd.promise;
        // }
    };
});