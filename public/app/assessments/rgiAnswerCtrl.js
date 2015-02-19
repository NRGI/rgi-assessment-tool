angular.module('app').controller('rgiAnswerCtrl', function ($scope, $routeParams, rgiAnswerSrvc, rgiIdentitySrvc, rgiAssessmentSrvc, rgiQuestionSrvc, rgiAnswerMethodSrvc, rgiNotifier) {
    // var assessment_ID = $routeParams.answer_ID.substring(0,2);
    rgiAnswerSrvc.get({answer_ID: $routeParams.answer_ID, assessment_ID: $routeParams.answer_ID.substring(0, 2)}, function (data) {
        $scope.answer = data;
        $scope.assessment = rgiAssessmentSrvc.get({assessment_ID: data.assessment_ID});
        $scope.question = rgiQuestionSrvc.get({_id: data.question_ID});
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.answer_start = angular.copy($scope.answer);
        // $scope.$watch('files', function () {
        //     $scope.upload($scope.files);
        // });
        // // $scope.upload = function (files) {
        //     if (files && files.length) {
        //         var i = 0;
        //         for (i; i < files.length; i++) {
        //             var file = files[i];
        //             $upload.upload({
        //                 url: $'https://s3.amazonaws.com/rgi-upload-test/',
        //                 method: 'POST',
        //                 key: file.name,
        //                 AWSAccessKeyId:


        //                 url: 'upload/url',
        //                 fields: {'username': $scope.username},
        //                 file: file
        //             }).progress(function (evt) {
        //                 var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        //                 console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
        //             }).success(function (data, status, headers, config) {
        //                 console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
        //             });
        //         }
        //     }
        // };
        // $scope.uploader = new rgiFileUploader();
        // console.log($scope.uploader);
    });

    // var uploader = $scope.uploader = new FileUploader({
    //         url: 'upload'
    //     });
    // uploader.filters.push({
    //     name: 'customFilter',
    //     fn: function (item /*{File|FileLikeObject}*/, options) {
    //         return this.queue.length < 10;
    //     }
    // });

    $scope.answerClear = function () {
        $scope.answer_choice_form.$setPristine(true);
        $scope.new_comment_form.$setPristine(true);

        $scope.answer = angular.copy($scope.answer_start);
    };

    // $scope.answerSave = function () {

    // };

    // $scope.answerSubmit = function () {

    // };

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
// var commentSchema = new mongoose.Schema({
//     date: {type: Date, default: Date.now},
//     content: String,
//     author: ObjectId, // Pull from curretn user _id value
//     author_name: String,
//     // ACTUAL CHANGE
//     role: String
// });
    // $scope.documentUpload = function () {

    // };



    // $scope.userCreate = function () {
    //     var newUserData = {
    //       firstName: $scope.fname,
    //       lastName: $scope.lname,
    //       username: $scope.username,
    //       email: $scope.email,
    //       password: $scope.password,
    //       // ADD ROLE IN CREATION EVENT
    //       roles: [$scope.roleSelect],
    //       address: [$scope.address],
    //       language: [$scope.language]
    //     };

    //     rgiUserMethodSrvc.createUser(newUserData).then(function () {
    //       // rgiMailer.send($scope.email);
    //       rgiNotifier.notify('User account created!' + $scope.email);
    //       $location.path('/admin/user-admin');
    //     }, function (reason) {
    //       rgiNotifier.error(reason);
    //     })
    //   }



});






// angular.module('app').controller('rgiAssessmentDetailCtrl', function ($scope, $routeParams, rgiAssessmentSrvc, rgiUserListSrvc, rgiAnswerSrvc, rgiQuestionSrvc, rgiQuestionTextSrvc) {

//     rgiAssessmentSrvc.get({assessment_ID:$routeParams.assessment_ID},function (assessment_data) {
//         $scope.assessment = assessment_data;
//         $scope.assessment.reviewer = rgiUserListSrvc.get({_id:assessment_data.reviewer_ID});
//         $scope.assessment.researcher = rgiUserListSrvc.get({_id:assessment_data.researcher_ID});
//         $scope.answers = [];
//         rgiAnswerSrvc.query({assessment_ID:assessment_data.assessment_ID}, function (answer_data) {
//             for (var i = 0; i < answer_data.length; i++) {
//                 answer = answer_data[i];
//                 answer.question_text = rgiQuestionTextSrvc.get({_id:answer.question_ID});
//                 $scope.answers.push(answer);
//             };
//         });
//     });
// })