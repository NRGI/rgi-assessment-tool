/*global angular */
'use strict';

var app = angular.module('app').factory('rgiQuestionMethodSrvc', function ($http, $q, rgiIdentitySrvc, rgiQuestionSrvc) {
    return {
        updateQuestion: function (newQuestionData) {
            var dfd = $q.defer();
            newQuestionData.$update().then(function () {
                dfd.resolve();
            }), function (response) {
                dfd.reject(response.data.reason);
            };
            return dfd.promise;
        },
        deleteQuestion: function (questionDeletion) {
            var dfd = $q.defer();
            var deleteID = new rgiQuestionSrvc();
            deleteID.id = questionDeletion;

            deleteID.$delete().then(function () {
                dfd.resolve();
            }), function (response) {
                dfd.reject(response.data.reason);
            };
            return dfd.promise;
        }
    }
});