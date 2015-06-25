'use strict';
//var angular;
/*jslint newcap: true */

angular.module('app').factory('rgiAssessmentMethodSrvc', function ($http, $q, rgiIdentitySrvc, rgiAssessmentSrvc) {
    return {
        createAssessment: function (newAssessmentData) {

            var dfd = $q.defer(),
                newAssessments = new rgiAssessmentSrvc(newAssessmentData);

            newAssessments.length = newAssessmentData.length;
            newAssessments.$save().then(function () {
                dfd.resolve();
            }, function (response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;

        },
        //deleteAssessment: function (userDeletion) {
        //    var dfd = $q.defer();
        //    console.log(userDeletion);
        //
        ////     userDeletion.$remove().then(function() {
        ////         dfd.resolve();
        ////     }), function(response) {
        ////         dfd.reject(response.data.reason);
        ////     };
        //    return dfd.promise;
        //},
        updateAssessment: function (newAssessmentData) {
            var dfd = $q.defer();

            newAssessmentData.$update().then(function () {
                dfd.resolve();
            }, function(response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        }
    }    
});
