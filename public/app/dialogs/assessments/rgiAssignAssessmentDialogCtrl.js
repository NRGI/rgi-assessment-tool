'use strict';

angular
    .module('app')
    .controller('rgiAssignAssessmentDialogCtrl', function (
        $scope,
        $location,
        ngDialog,
        rgiUtilsSrvc,
        rgiNotifier,
        rgiIdentitySrvc,
        rgiAssessmentSrvc,
        rgiAssessmentMethodSrvc,
        rgiUserSrvc,
        rgiUserMethodSrvc,
        rgiAnswerMethodSrvc,
        rgiQuestionSrvc
    ) {

        // get all researchers
        $scope.researchers = rgiUserSrvc.query({role: 'researcher'});
        // get all reviewers
        $scope.reviewers = rgiUserSrvc.query({role: 'reviewer'});

        // get assessment that needs to be updated
        $scope.assessment = rgiAssessmentSrvc.get({assessment_ID: $scope.$parent.assessment_update_ID});

        //// get questions for insertion into answers collection
        //$scope.questions = rgiQuestionSrvc.query({assessments: $scope.$parent.assessment_update_ID.substr(3)});

        $scope.assessmentAssign = function (researcherSelect, reviewerSelect) {
            // update users
            var new_researcher_data = new rgiUserSrvc(JSON.parse(researcherSelect)),
                new_assessment_data = $scope.assessment;

            //MAIL NOTIFICATION
            new_assessment_data.mail = true;

            // UPDATE ASSESSMENT AND ASSIGN ALL SCENERIOS
            new_assessment_data.status = 'assigned';
            new_assessment_data.researcher_ID = new_researcher_data._id;
            new_assessment_data.edit_control = new_researcher_data._id;
            new_researcher_data.assessments.push({assessment_ID: $scope.$parent.assessment_update_ID, country_name: $scope.assessment.country, year: $scope.assessment.year, version: $scope.assessment.version});

            //IF REVIEWER SELECTED
            if (reviewerSelect) {
                var new_reviewer_data = new rgiUserSrvc(JSON.parse(reviewerSelect));

                new_assessment_data.reviewer_ID = new_reviewer_data._id;
                new_reviewer_data.assessments.push({assessment_ID: $scope.$parent.assessment_update_ID, country_name: $scope.assessment.country, year: $scope.assessment.year, version: $scope.assessment.version});
                rgiUserMethodSrvc.updateUser(new_researcher_data)
                    .then(rgiUserMethodSrvc.updateUser(new_reviewer_data))
                    .then(rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data))
                    //.then(rgiAnswerMethodSrvc.insertAnswerSet(new_answer_set))
                    .then(function () {
                        rgiNotifier.notify('Assessment assigned!');
                        $location.path('/');
                        //$route.reload();
                        $scope.closeThisDialog();
                    }, function (reason) {
                        rgiNotifier.error(reason);
                    });
            } else if (!reviewerSelect) {
                rgiUserMethodSrvc.updateUser(new_researcher_data)
                    .then(rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data))
                    //.then(rgiAnswerMethodSrvc.insertAnswerSet(new_answer_set))
                    .then(function () {
                        rgiNotifier.notify('Assessment assigned!');
                        $location.path('/');
                        //$route.reload();
                        $scope.closeThisDialog();
                    }, function (reason) {
                        rgiNotifier.error(reason);
                    });
            } else {
                rgiNotifier.error('No researcher data!');
            }

            ////////TODO DEAL WITH RELOADING NOT ALWAYS WORKING  - DUPLICATE ANSWER SETS
            ////if (new_reviewer_data) {
            //
            ////} else if (!new_reviewer_data) {
            //
            //}
        };

        $scope.assessmentReassign = function () {

        };

        $scope.closeDialog = function () {
            ngDialog.close();
        };
    });