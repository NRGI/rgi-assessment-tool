'use strict';
//var angular;
/*jslint newcap: true */

angular.module('app').factory('rgiDocumentMethodSrvc', function ($q) {
    return {
        // insertAnswerSet: function (new_answer_set) {
        //     var dfd = $q.defer(),
        //         newAnswers = new rgiAnswerSrvc(new_answer_set);
        //     newAnswers.length = new_answer_set.length;
        //     newAnswers.$save().then(function () {
        //         dfd.resolve();
        //     }, function (response) {
        //         dfd.reject(response.data.reason);
        //     });
        //     return dfd.promise;
        // },
        updateDocument: function (new_doc_data) {
            var dfd = $q.defer();

            new_doc_data.$update().then(function () {
                dfd.resolve();
            }, function (response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        }
        // },
        // updateAnswerSet: function (new_answer_data) {
        //     var dfd = $q.defer();
        //     new_answer_data.forEach(function (el, i) {
        //         el.$update().then(function () {
        //             dfd.resolve();
        //         }, function (response) {
        //             dfd.reject(response.data.reason);
        //         });
        //     });
        //     return dfd.promise;
        // }
        // updateAnswerSet: function (new_answer_data) {
        //     console.log(new_answer_data);
        //     var dfd = $q.defer(),
        //         newAnswers = new rgiAnswerSrvc(new_answer_data);
        //     newAnswers.length = new_answer_data.length;
        //     console.log(newAnswers);
        //     // newAnswers.$update().then(function () {
        //     //     dfd.resolve();
        //     // }, function (response) {
        //     //     dfd.reject(response.data.reason);
        //     // });
        //     return dfd.promise;
        // }
    };
});
