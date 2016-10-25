'use strict';

angular.module('app')
    .factory('rgiAnswerMethodSrvc', ['$q', 'rgiAnswerSrvc', 'rgiHttpResponseProcessorSrvc', function (
        $q,
        rgiAnswerSrvc,
        rgiHttpResponseProcessorSrvc
    ) {
        var getHandleFailureResponse = function(dfd) {
            return rgiHttpResponseProcessorSrvc.getDeferredHandler(dfd, 'Save answer failure');
        };

        return {
            insertAnswerSet: function (new_answer_set) {
                var dfd = $q.defer(),
                    newAnswers = new rgiAnswerSrvc(new_answer_set);
                newAnswers.length = new_answer_set.length;

                newAnswers.$save().then(function () {
                    dfd.resolve();
                }, getHandleFailureResponse(dfd));

                return dfd.promise;
            },
            updateAnswer: function (new_answer_data) {
                var dfd = $q.defer();

                new_answer_data.$update().then(function () {
                    dfd.resolve();
                }, getHandleFailureResponse(dfd));

                return dfd.promise;
            },
            updateAnswerSet: function (new_answer_data) {
                var dfd = $q.defer();

                new_answer_data.forEach(function (el) {
                    el.$update().then(function () {
                        dfd.resolve();
                    }, getHandleFailureResponse(dfd));
                });

                return dfd.promise;
            }
        };
    }]);
