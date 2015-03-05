'use strict';
var angular;
angular.module('app').controller('rgiAnswerCtrl', function ($scope, $routeParams, FileUploader, rgiAnswerSrvc, rgiIdentitySrvc, rgiAssessmentSrvc, rgiAssessmentMethodSrvc, rgiQuestionSrvc, rgiAnswerMethodSrvc, rgiNotifier, $location) {
    $scope.identity = rgiIdentitySrvc;
    // $scope.uploader = new FileUploader();

    var uploader = $scope.uploader = new FileUploader({
        isHTML5: true,
        withCredentials: true,
        uploadItem: function (file) {
            console.log(file._file);
    //         var token_req = {
    //             method: 'POST',
    //             url: 'https://api.mendeley.com/oauth/token?grant_type=client_credentials&scope=all&client_id=1560:chBcJvsqMHLoD8mF',
    //             headers: {
    //                 'Content-Type': 'application/x-www-form-urlencoded',
    //                 'Access-Control-Allow-Origin': '*'
    //             }
    //             // data: {
    //             //     grant_type: 'client_credentials',
    //             //     scope: 'all',
    //             //     client_id: '1560:chBcJvsqMHLoD8mF'
    //             // }
    //         };
    // //         {method: 'GET', url: 'www.google.com/someapi', headers: {
    // // 'Authorization': 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=='}
    //         $http(token_req)
    //             .success(function (data, status, headers, config) {
    //                 console.log('success');
    //                 console.log(data);
    //                 console.log(status);
    //                 console.log(headers);
    //                 console.log(config);
    //             }).
    //             error(function (data, status, headers, config) {
    //                 console.log('failure');
    //                 console.log(data);
    //                 console.log(status);
    //                 console.log(headers);
    //                 console.log(config);
                // });

            // var spawn = require('child_process').spawn;
            // var child = spawn('openssl', ['dgst', '-sha1', file.]);
            // filehash=`openssl dgst -sha1 $filename | sed 's/^.*= //'`

            // child.stdout.on('data', function(chunk) {
              // output here
            // });
            // console.log(file.FileItem);
        }
    });
    // var assessment_ID = $routeParams.answer_ID.substring(0,2);
    rgiAnswerSrvc.get({answer_ID: $routeParams.answer_ID, assessment_ID: $routeParams.answer_ID.substring(0, 2)}, function (data) {
        $scope.answer = data;
        $scope.assessment = rgiAssessmentSrvc.get({assessment_ID: data.assessment_ID});
        $scope.question = rgiQuestionSrvc.get({_id: data.question_ID});
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.answer_start = angular.copy($scope.answer);
        $scope.answer_start = angular.copy($scope.answer);

    });

    $scope.answerClear = function () {
        $scope.answer = angular.copy($scope.answer_start);
    };

    $scope.answerSave = function () {
        var new_answer_data = $scope.answer;

        if (new_answer_data.status === 'assigned') {
            new_answer_data.status = 'saved';
        }

        rgiAnswerMethodSrvc.updateAnswer(new_answer_data).then(function () {
            rgiNotifier.notify('Answer saved');
        }, function (reason) {
            rgiNotifier.notify(reason);
        });
    };

    $scope.answerSubmit = function () {
        var new_answer_data, new_assessment_data;

        new_answer_data = $scope.answer;
        new_assessment_data = $scope.assessment;

        if (new_answer_data.status !== 'submitted') {
            new_answer_data.status = 'submitted';
        }
        new_assessment_data.questions_complete += 1;

        console.log(new_assessment_data);
        console.log(new_answer_data);

        rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
            .then(rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data))
            .then(function () {
                $location.path('/assessments/' + new_answer_data.assessment_ID);
                rgiNotifier.notify('Answer submitted');
            }, function (reason) {
                rgiNotifier.notify(reason);
            });
    };

    $scope.commentSubmit = function (current_user) {
        var new_comment_data = {
            content: $scope.answer.new_comment,
            author_name: current_user.firstName + ' ' + current_user.lastName,
            author: current_user._id,
            role: current_user.roles[0],
            date: new Date().toISOString()
        },
            new_answer_data = $scope.answer;

        new_answer_data.comments.push(new_comment_data);

        if (new_answer_data.status === 'assigned') {
            new_answer_data.status = 'saved';
        }

        rgiAnswerMethodSrvc.updateAnswer(new_answer_data).then(function () {
            rgiNotifier.notify('Comment added');
        }, function (reason) {
            rgiNotifier.notify(reason);
        });
    };
});