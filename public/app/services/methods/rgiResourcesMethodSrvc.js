'use strict';

angular
    .module('app')
    .factory('rgiResourcesMethodSrvc', function (
        $q,
        rgiResourcesSrvc
        //$http,
        //
    ) {
        return {
            //createInterviewee: function (new_interviewee_data) {
            //    var new_interviewee = new rgiIntervieweeSrvc(new_interviewee_data),
            //        dfd = $q.defer();
            //    new_interviewee.$save().then(function (interviewee) {
            //        dfd.resolve(interviewee);
            //    }, function (response) {
            //        dfd.reject(response.data.reason);
            //    });
            //    return dfd.promise;
            //},
            //deleteInterviewee: function (user_deletion) {
            //    var dfd = $q.defer(),
            //        delete_ID = new rgiIntervieweeSrvc();
            //
            //    delete_ID.id = user_deletion;
            //    //noinspection CommaExpressionJS
            //    delete_ID.$delete().then(function (response) {
            //        dfd.resolve(response);
            //    }, function (response) {
            //        dfd.reject(response.data.reason);
            //    });
            //    return dfd.promise;
            //},
            updateResource: function (new_resource_data) {
                var dfd = $q.defer();

                //noinspection CommaExpressionJS
                new_resource_data.$update().then(function () {
                    dfd.resolve();
                }, function (response) {
                    dfd.reject(response.data.reason);
                });
                return dfd.promise;
            },
            deleteResource: function (resource_deletion) {
                var dfd = $q.defer(),
                    delete_ID = new rgiResourcesSrvc();

                delete_ID.id = resource_deletion;

                delete_ID.$delete().then(function () {
                    dfd.resolve();
                }, function (response) {
                    dfd.reject(response.data.reason);
                });
                return dfd.promise;
            }
            //deleteQuestion: function (questionDeletion) {
            //    var dfd, deleteID;
            //
            //    dfd = $q.defer();
            //    deleteID = new rgiQuestionSrvc();
            //    deleteID.id = questionDeletion;
            //
            //    deleteID.$delete().then(function () {
            //        dfd.resolve();
            //    }, function (response) {
            //        dfd.reject(response.data.reason);
            //    });
            //    return dfd.promise;
            //}
        };
    });