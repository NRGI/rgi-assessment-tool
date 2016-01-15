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






            //var new_assessment_ID,
            //    new_assessment_set = [],
            //    new_answer_set = [],
            //    new_assessment_year = String($scope.new_assessment.year),
            //    new_assessment_ver = $scope.new_assessment.version.slice(0, 2).toUpperCase(),
            //    timestamp = new Date().toISOString();
            //
            //rgiQuestionSrvc.query({assessments: new_assessment_year + "-" + new_assessment_ver}, function (d) {
            //    if (d.length > 0) {
            //        rgiNotifier.error('Assessment already deployed');
            //    } else {
            //        rgiQuestionSrvc.query({}, function (questions) {
            //            questions.forEach(function (question) {
            //                question.assessments.push(new_assessment_year + "-" + new_assessment_ver);
            //            });
            //
            //            $scope.new_assessment.assessment_countries.forEach(function (assessment_country) {
            //                new_assessment_ID = assessment_country.country.iso2 + "-" + new_assessment_year + "-" + new_assessment_ver;
            //
            //                new_assessment_set.push({
            //                    assessment_ID: new_assessment_ID,
            //                    ISO3: assessment_country.country.country_ID,
            //                    year: $scope.new_assessment.year,
            //                    version: $scope.new_assessment.version,
            //                    country: assessment_country.country.country,
            //                    created: {
            //                        created_by: current_user._id,
            //                        created_date: timestamp}
            //                });
            //
            //                questions.forEach(function (q) {
            //                    new_answer_set.push({
            //                        answer_ID: new_assessment_ID + '-' + String(rgiUtilsSrvc.zeroFill(q.question_order, 3)),
            //                        question_ID: q._id,
            //                        assessment_ID: new_assessment_ID,
            //                        year: new_assessment_year,
            //                        version: new_assessment_ver,
            //                        question_order: q.question_order,
            //                        question_v: q.question_v + 1,
            //                        last_modified: {modified_by: current_user._id}
            //                    });
            //                });
            //            });
            //            //send to mongo
            //            rgiAssessmentMethodSrvc.createAssessment(new_assessment_set)
            //                .then(rgiAnswerMethodSrvc.insertAnswerSet(new_answer_set))
            //                .then(rgiQuestionMethodSrvc.updateQuestionSet(questions))
            //                .then(function () {
            //                    rgiNotifier.notify('Assessment deployed!');
            //                    $scope.closeThisDialog();
            //                    $route.reload();
            //                    $location.path('admin/assessment-admin');
            //                }, function (reason) {
            //                    rgiNotifier.error(reason);
            //                });
            //        });
            //    }
            //});



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