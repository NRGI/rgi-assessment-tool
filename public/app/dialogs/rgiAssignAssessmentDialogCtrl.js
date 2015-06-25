'use strict';
/*jslint unparam: true nomen: true*/
//var angular;

angular.module('app').controller('rgiAssignAssessmentDialogCtrl', function ($scope, $route, ngDialog, rgiNotifier, rgiIdentitySrvc, rgiAssessmentSrvc, rgiAssessmentMethodSrvc, rgiUserSrvc, rgiUserMethodSrvc, rgiAnswerMethodSrvc, rgiQuestionSrvc) {
    function zeroFill(number, width) {
        width -= number.toString().length;
        if (width > 0) {
            return new Array( width + (/\./.test(number) ? 2 : 1) ).join('0') + number;
        }
        return number + ""; // always return a string
    }

    $scope.closeDialog = function () {
        ngDialog.close();
    };

    // get all researchers
    $scope.researchers = rgiUserSrvc.query({role: 'researcher'});
    // get all reviewers
    $scope.reviewers = rgiUserSrvc.query({role: 'reviewer'});

    // get assessment that needs to be updated
    $scope.assessment = rgiAssessmentSrvc.get({assessment_ID: $scope.$parent.assessment_update_ID});

    // get questions for insertion into answers collection
    $scope.questions = rgiQuestionSrvc.query({assessment_ID: $scope.$parent.assessment_update_ID.substr(3)});

    $scope.assessmentAssign = function () {
        // update users
        var new_researcher_data = $scope.researcherSelect,
            new_reviewer_data = $scope.reviewerSelect,
            new_assessment_data = $scope.assessment,
            new_answer_set = [],
            current_user = rgiIdentitySrvc.currentUser;
        new_researcher_data.assessments.push({assessment_ID: $scope.$parent.assessment_update_ID, country_name: $scope.assessment.country, year: $scope.assessment.year, version: $scope.assessment.version});

        // update assessment
        new_assessment_data.status = 'assigned';
        new_assessment_data.researcher_ID = $scope.researcherSelect._id;
        if ($scope.reviewerSelect !== undefined) {
            new_assessment_data.reviewer_ID = $scope.reviewerSelect._id;
            new_reviewer_data.assessments.push({assessment_ID: $scope.$parent.assessment_update_ID, country_name: $scope.assessment.country, year: $scope.assessment.year, version: $scope.assessment.version});
        } else {
            new_assessment_data.reviewer_ID = current_user._id;
        }

        new_assessment_data.edit_control = $scope.researcherSelect._id;

        // create new answer set
        $scope.questions.forEach(function (el, i) {
            new_answer_set.push({});

            if (el.hasOwnProperty('question_order')) {
                new_answer_set[i].answer_ID = $scope.$parent.assessment_update_ID + '-' + String(zeroFill(el.question_order, 3));
                new_answer_set[i].question_ID = el._id;
                new_answer_set[i].root_question_ID = el.root_question_ID;
                new_answer_set[i].assessment_ID = $scope.$parent.assessment_update_ID;
                new_answer_set[i].year = el.year;
                new_answer_set[i].version = el.version;
                new_answer_set[i].researcher_ID = $scope.researcherSelect._id;
                new_answer_set[i].edit_control = $scope.researcherSelect._id;
                new_answer_set[i].question_order = el.question_order;
                new_answer_set[i].component = el.component;
                new_answer_set[i].component_text = el.component_text;
                new_answer_set[i].nrc_precept = el.nrc_precept;
            }
            if ($scope.reviewerSelect !== undefined) {
                new_answer_set[i].reviewer_ID = $scope.reviewerSelect._id;
            } else {
                new_answer_set[i].reviewer_ID = current_user._id;
            }
        });
        //console.log(new_reviewer_data);
        //console.log(new_assessment_data);
        //console.log(new_answer_set);
        //console.log(current_user);
        //
        if (new_reviewer_data !== undefined) {
            rgiUserMethodSrvc.updateUser(new_researcher_data)
                .then(rgiUserMethodSrvc.updateUser(new_reviewer_data))
                .then(rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data))
                .then(rgiAnswerMethodSrvc.insertAnswerSet(new_answer_set))
                .then(function () {
                    rgiNotifier.notify('Assessment created and assigned!');
                    $scope.closeThisDialog();
                    $route.reload();
                }, function (reason) {
                    rgiNotifier.error(reason);
                });
        } else if (new_reviewer_data === undefined) {
            rgiUserMethodSrvc.updateUser(new_researcher_data)
                .then(rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data))
                .then(rgiAnswerMethodSrvc.insertAnswerSet(new_answer_set))
                .then(function () {
                    rgiNotifier.notify('Assessment created and assigned!');
                    $scope.closeThisDialog();
                    $route.reload();
                }, function (reason) {
                    rgiNotifier.error(reason);
                });
        }
    };
});




    //mgaUserSrvc.query({}, function (data) {
    //    $scope.assessment = mgaAssessmentSrvc.get({assessment_ID: $scope.$parent.assessment_ID});
    //    $scope.users = [];
    //    data.forEach(function (el) {
    //        var seen = false;
    //        if (el.role !== 'supervisor') {
    //            el.assessments.forEach(function (element) {
    //                if (element.assessment_ID === $scope.$parent.assessment_ID) {
    //                    seen = true;
    //                }
    //            });
    //            if(!seen) {$scope.users.push(el)}
    //        }
    //    });
    //});
    //
    //$scope.closeDialog = function () {
    //    ngDialog.close();
    //};
    //
    //$scope.assessmentAssign = function () {
    //    var new_assessment_data, new_user_data;
    //
    //    mgaUserSrvc.get({_id: $scope.new_assignment}, function (data) {
    //        new_assessment_data = $scope.assessment;
    //        new_user_data = data;
    //
    //        new_assessment_data.users.push($scope.new_assignment);
    //        new_user_data.assessments.push({
    //            _id: $scope.assessment._id,
    //            assessment_ID: $scope.assessment.assessment_ID,
    //            country: $scope.assessment.country,
    //            year: $scope.assessment.year
    //        });
    //
    //        mgaUserMethodSrvc.updateUser(new_user_data)
    //            .then(mgaAssessmentMethodSrvc.updateAssessment(new_assessment_data))
    //            .then(function () {
    //                mgaNotifier.notify('Assessment assigned!');
    //                new_assessment_data = undefined;
    //                new_user_data = undefined;
    //                $scope.closeThisDialog();
    //                $route.reload();
    //            }, function (reason) {
    //                mgaNotifier.error(reason);
    //            });
//        });
//    };
//});
