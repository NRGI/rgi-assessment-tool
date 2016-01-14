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
        rgiAssessmentSrvc.get({assessment_ID: $scope.$parent.assessment_update_ID}, function(assessment) {
            $scope.assessment = assessment;
            $scope.researcher_select = rgiUserSrvc.get({_id: assessment.researcher_ID});
            $scope.reviewer_select = rgiUserSrvc.get({_id: assessment.reviewer_ID});
        });


        //// get questions for insertion into answers collection
        //$scope.questions = rgiQuestionSrvc.query({assessments: $scope.$parent.assessment_update_ID.substr(3)});

        $scope.assessmentAssign = function (researcher_select, reviewer_select) {
            // update users
            var new_researcher_data = new rgiUserSrvc(JSON.parse(researcher_select)),
                new_assessment_data = $scope.assessment;

            //MAIL NOTIFICATION
            new_assessment_data.mail = true;

            // UPDATE ASSESSMENT AND ASSIGN ALL SCENERIOS
            new_assessment_data.status = 'assigned';
            new_assessment_data.researcher_ID = new_researcher_data._id;
            new_assessment_data.edit_control = new_researcher_data._id;
            new_researcher_data.assessments.push({assessment_ID: $scope.$parent.assessment_update_ID, country_name: $scope.assessment.country, year: $scope.assessment.year, version: $scope.assessment.version});

            ////IF REVIEWER SELECTED
            if (reviewer_select) {
                var new_reviewer_data = new rgiUserSrvc(JSON.parse(reviewer_select));
                new_assessment_data.reviewer_ID = new_reviewer_data._id;
                new_reviewer_data.assessments.push({assessment_ID: $scope.$parent.assessment_update_ID, country_name: $scope.assessment.country, year: $scope.assessment.year, version: $scope.assessment.version});
                rgiUserMethodSrvc.updateUser(new_researcher_data)
                    .then(rgiUserMethodSrvc.updateUser(new_reviewer_data))
                    .then(rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data))
                    .then(function () {
                        rgiNotifier.notify('Assessment assigned!');
                        $location.path('/');
                        //$route.reload();
                        $scope.closeThisDialog();
                    }, function (reason) {
                        rgiNotifier.error(reason);
                    });
            } else if (!reviewer_select) {
                rgiUserMethodSrvc.updateUser(new_researcher_data)
                    .then(rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data))
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

        $scope.assessmentReassign = function (researcher_select, reviewer_select) {
            console.log(researcher_select);
            //if (!researcherSelect) {
            //    rgiNotifier.error('No researcher data!');
            //} else {
            //    var new_researcher_data = new rgiUserSrvc(JSON.parse(researcherSelect)),
            //        new_assessment_data = $scope.assessment;;
            //
            //    if (new_researcher_data._id===new_assessment_data.researcher_ID) {
            //        $scope.closeThisDialog();
            //    }
            //
            //}

        };

        $scope.closeDialog = function () {
            ngDialog.close();
        };
    });