'use strict';

angular.module('app')
    .controller('rgiDeleteReferenceDialogCtrl', function (
        $scope,
        $rootScope,
        $q,
        rgiAnswerMethodSrvc,
        rgiIntervieweeSrvc,
        rgiIntervieweeMethodSrvc,
        rgiNotifier
    ) {
        var
            answer = $scope.$parent.$parent.answer,
            currentReference = answer.references[$scope.$parent.$parent.ref_index],
            isAnotherReferenceFound = function(userField) {
                var anotherReferenceFound = false;

                answer.references.forEach(function(reference) {
                    if((getUserId(reference, userField) === getUserId(currentReference, userField)) && !reference.hidden &&
                        (reference.citation_type === currentReference.citation_type) && (reference._id !== currentReference._id)) {
                        anotherReferenceFound = true;
                    }
                });

                return anotherReferenceFound;
            },
            isAssessmentReferenceFound = function(assessmentId, answerIdCollection) {
                var belongingAnswerFound = false;

                answerIdCollection.forEach(function(answerId) {
                    if(answerId.indexOf(assessmentId) === 0) {
                        belongingAnswerFound = true;
                    }
                });

                return belongingAnswerFound;
            },
            getUserId = function(reference, userField) {
                return reference[userField]._id ? reference[userField]._id : reference[userField];
            },
            removeIntervieweeAnswer = function(interviewee) {
                var answerIndex = interviewee.answers.indexOf(answer.answer_ID);

                if(answerIndex > -1) {
                    interviewee.answers.splice(answerIndex, 1);
                }
            },
            cleanUpIntervieweeAssessments = function(interviewee) {
                var assessmentIdCollection = [];

                interviewee.assessments.forEach(function(assessmentId) {
                    if(!isAssessmentReferenceFound(assessmentId, interviewee.answers)) {
                        assessmentIdCollection.push(assessmentId);
                    }
                });

                assessmentIdCollection.forEach(function(assessmentId) {
                    interviewee.assessments.splice(interviewee.assessments.indexOf(assessmentId), 1);
                });
            };

        $scope.deleteReference = function() {
            var promises = [];

            if(currentReference.citation_type === 'interview') {
                if(!isAnotherReferenceFound('interviewee_ID')) {
                    rgiIntervieweeSrvc.get({_id: getUserId(currentReference, 'interviewee_ID')}, function (interviewee) {
                        removeIntervieweeAnswer(interviewee);
                        cleanUpIntervieweeAssessments(interviewee);
                        promises.push(rgiIntervieweeMethodSrvc.updateInterviewee(interviewee).$promise);
                    });
                }
            }

            currentReference.hidden = true;
            promises.push(rgiAnswerMethodSrvc.updateAnswer(answer).$promise);

            $q.all(promises).then(function() {
                $scope.closeThisDialog();
                $rootScope.$broadcast('RESET_REFERENCE_ACTION');
                rgiNotifier.notify('The reference has been deleted');
            }, function (reason) {
                rgiNotifier.error(reason);
            });
        };
    });
