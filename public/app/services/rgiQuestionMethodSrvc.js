'use strict';
var angular;
/*jslint newcap: true */

angular.module('app').factory('rgiQuestionMethodSrvc', function ($q, rgiQuestionSrvc) {
    return {
        createQuestion: function () {
            var dfd = $q.defer();
            return dfd.promise;
        },
        updateQuestion: function (new_question_data) {
            var dfd = $q.defer();
            console.log(new_question_data);
            new_question_data.$update().then(function () {
                dfd.resolve();
            }, function (response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        },
        deleteQuestion: function (questionDeletion) {
            var dfd, deleteID;

            dfd = $q.defer();
            deleteID = new rgiQuestionSrvc();
            deleteID.id = questionDeletion;

            deleteID.$delete().then(function () {
                dfd.resolve();
            }, function (response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        }
    };
});