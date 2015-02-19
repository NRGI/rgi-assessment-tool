'use strict';
var angular;
angular.module('app').factory('rgiAnswerMethodSrvc', function ($http, $q, rgiIdentitySrvc, rgiAnswerSrvc) {
    return {
        insertAnswerSet: function (new_answer_set) {
            var dfd = $q.defer(),
                newAnswers = new rgiAnswerSrvc(new_answer_set);
            newAnswers.length = new_answer_set.length;
            newAnswers.$save().then(function () {
                dfd.resolve();
            }, function (response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        },
        updateAnswer: function (new_answer_data) {
            var dfd = $q.defer();
            new_answer_data.$update().then(function () {
                dfd.resolve();
            }, function (response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        }
    };
});