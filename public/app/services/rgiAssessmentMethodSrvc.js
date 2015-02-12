angular.module('app').factory('rgiAssessmentMethodSrvc', function ($http, $q, rgiIdentitySrvc, rgiAssessmentSrvc) {
    return {
        createAssessment: function (newAssessmentData) {
            // var newAssessment = new rgiAssessmentSrvc(newAssessmentData);
            // var dfd = $q.defer();

            // newAssessment.$save().then(function () {
            //     dfd.resolve();
            // }, function (response) {
            //     dfd.reject(response.data.reason);
            // });
            // return dfd.promise;
        },
        // deleteAssessment: function (userDeletion) {
        //     var dfd = $q.defer();

        //     userDeletion.$remove().then(function () {
        //         dfd.resolve();
        //     }), function (response) {
        //         dfd.reject(response.data.reason);
        //     };
        //     return dfd.promise;
        // },
        updateAssessment: function (newAssessmentData) {
            var dfd = $q.defer();

            newAssessmentData.$update().then(function () {
                dfd.resolve();
            }), function (response) {
                dfd.reject(response.data.reason);
            };

            return dfd.promise;
        }
    }
});