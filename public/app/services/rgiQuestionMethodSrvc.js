angular.module('app').factory('rgiQuestionMethodSrvc', function ($http, $q, rgiIdentitySrvc, rgiQuestionSrvc) {
    return {
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