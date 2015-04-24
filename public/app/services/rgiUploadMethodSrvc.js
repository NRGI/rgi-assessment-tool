'use strict';
var angular;

angular.module('app').factory('rgiUploadMethodSrvc', function ($q, rgiUploadSrvc) {
    return {
        upload: function (fileItem) {
            console.log('.url');
            var newUpload = new rgiUploadSrvc(fileItem),
                dfd = $q.defer();
            newUpload.test = 'test';
            console.log(newUpload);

            newUpload.$save().then(function () {
                dfd.resolve();
            }, function (res) {
                dfd.reject(res.data.reason);
            });
            return dfd.promise;
        }
    };
});


// // query users or get user by id and return only first and last name and email
// angular.module('app').factory('rgiUploadSrvc', function($resource) {
//     var UserResource = $resource('/file-upload', {_id: "@id"}, {});

//     return UserResource;
// });

// console.log('hello');
//  // $scope.$watch('files', function () {
//         //     $scope.upload($scope.files);
//         // });
//         // // $scope.upload = function (files) {
//         //     if (files && files.length) {
//         //         var i = 0;
//         //         for (i; i < files.length; i++) {
//         //             var file = files[i];
//         //             $upload.upload({
//         //                 url: $'https://s3.amazonaws.com/rgi-upload-test/',
//         //                 method: 'POST',
//         //                 key: file.name,
//         //                 AWSAccessKeyId:


//         //                 url: 'upload/url',
//         //                 fields: {'username': $scope.username},
//         //                 file: file
//         //             }).progress(function (evt) {
//         //                 var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//         //                 console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
//         //             }).success(function (data, status, headers, config) {
//         //                 console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
//         //             });
//         //         }
//         //     }
//         // };
//         // $scope.uploader = new rgiFileUploader();
//         // console.log($scope.uploader);


//             // var uploader = $scope.uploader = new FileUploader({
//     //         url: 'upload'
//     //     });
//     // uploader.filters.push({
//     //     name: 'customFilter',
//     //     fn: function (item /*{File|FileLikeObject}*/, options) {
//     //         return this.queue.length < 10;
//     //     }
//     // });