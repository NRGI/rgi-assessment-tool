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
            isAnotherReferenceFound = function(field) {
                var anotherReferenceFound = false;

                answer.references.forEach(function(reference) {
                    if((reference.citation_type === currentReference.citation_type) && (reference._id !== currentReference._id) &&
                        (getReferencedObjectId(reference, field) === getReferencedObjectId(currentReference, field)) && !reference.hidden) {
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
            getReferencedObjectId = function(reference, field) {
                var referencedObjectData = reference[field];
                return referencedObjectData._id ? referencedObjectData._id : referencedObjectData;
            },
            removeReferencedObjectAnswer = function(referencedObject) {
                var answerIndex = referencedObject.answers.indexOf(answer.answer_ID);

                if(answerIndex > -1) {
                    referencedObject.answers.splice(answerIndex, 1);
                }
            },
            cleanUpReferencedObjectAssessments = function(referencedObject) {
                var assessmentIdCollection = [];

                referencedObject.assessments.forEach(function(assessmentId) {
                    if(!isAssessmentReferenceFound(assessmentId, referencedObject.answers)) {
                        assessmentIdCollection.push(assessmentId);
                    }
                });

                assessmentIdCollection.forEach(function(assessmentId) {
                    referencedObject.assessments.splice(referencedObject.assessments.indexOf(assessmentId), 1);
                });
            },
            cleanUpReferencedObject = function(field, storage, saveObject, promiseList) {
                if(!isAnotherReferenceFound(field)) {
                    storage.get({_id: getReferencedObjectId(currentReference, field)}, function (referencedObject) {
                        removeReferencedObjectAnswer(referencedObject);
                        cleanUpReferencedObjectAssessments(referencedObject);
                        promiseList.push(saveObject(referencedObject).$promise);
                    });
                }
            };

        $scope.deleteReference = function() {
            var promises = [];

            if(currentReference.citation_type === 'interview') {
                cleanUpReferencedObject('interviewee_ID', rgiIntervieweeSrvc, rgiIntervieweeMethodSrvc.updateInterviewee, promises);
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
