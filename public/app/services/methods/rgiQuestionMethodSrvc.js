'use strict';

angular.module('app')
    .factory('rgiQuestionMethodSrvc', function (
        $q,
        rgiQuestionSrvc
    ) {
        return {
            insertQuestionSet: function (new_question_set) {
                var dfd = $q.defer(),
                    new_questions = new rgiQuestionSrvc(new_question_set);
                new_questions.length = new_question_set.length;
                new_questions.$save().then(function () {
                    dfd.resolve();
                }, function (response) {
                    dfd.reject(response.data.reason);
                });
                return dfd.promise;
            },
            updateQuestionSet: function (new_question_data) {
                var dfd = $q.defer(),
                    update_questions = new rgiQuestionSrvc(new_question_data);

                update_questions.length = new_question_data.length;

                update_questions.$update().then(function () {
                    dfd.resolve();
                }, function (response) {
                    dfd.reject(response.data.reason);
                });
                return dfd.promise;
            },
            // insertQuestionSet: function (new_question_set) {
            //     var dfd = $q.defer(),
            //         // new_question;
            //         newQuestions = new rgiQuestionSrvc(new_question_set);

            //     new_question_set.forEach(function (el, i) {
            //         new_question = new rgiQuestionSrvc(el);
            //         new_question.$save().then(function () {
            //             dfd.resolve();
            //         }, function (response) {
            //             dfd.reject(response.data.reason);
            //         });
            //     });
            //     return dfd.promise;
            // },
            updateQuestion: function (new_question_data) {
                var dfd = $q.defer();

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