'use strict';

angular.module('app')
    .controller('rgiDeleteReferenceDialogCtrl', function (
        $scope,
        $rootScope,
        $q,
        rgiAnswerMethodSrvc,
        rgiDocumentSrvc,
        rgiDocumentMethodSrvc,
        rgiHttpResponseProcessorSrvc,
        rgiIntervieweeSrvc,
        rgiIntervieweeMethodSrvc,
        rgiNotifier
    ) {
        var
            answer = $scope.$parent.$parent.answer,
            currentReference = answer.references[$scope.$parent.$parent.ref_index],
            getHttpFailureHandler = function(alternativeMessage) {
                return rgiHttpResponseProcessorSrvc.getDefaultHandler(alternativeMessage);
            },
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
                var referencedObject = reference[field];
                return referencedObject && referencedObject._id ? referencedObject._id : referencedObject;
            },
            removeReferencedObjectAnswer = function(referencedObject) {
                if(referencedObject && referencedObject.answers) {
                    var answerIndex = referencedObject.answers.indexOf(answer.answer_ID);

                    if(answerIndex > -1) {
                        referencedObject.answers.splice(answerIndex, 1);
                    }
                }
            },
            supplementReferencedObjectAnswers = function(referencedObject) {
                if(referencedObject && referencedObject.answers && (referencedObject.answers.indexOf(answer.answer_ID) === -1)) {
                    referencedObject.answers.push(answer.answer_ID);
                }
            },
            cleanUpReferencedObjectAssessments = function(referencedObject) {
                if(referencedObject && referencedObject.answers && referencedObject.assessments) {
                    var assessmentIdCollection = [];

                    referencedObject.assessments.forEach(function(assessmentId) {
                        if(!isAssessmentReferenceFound(assessmentId, referencedObject.answers)) {
                            assessmentIdCollection.push(assessmentId);
                        }
                    });

                    assessmentIdCollection.forEach(function(assessmentId) {
                        referencedObject.assessments.splice(referencedObject.assessments.indexOf(assessmentId), 1);
                    });
                }
            },
            supplementReferencedObjectAssessments = function(referencedObject) {
                if(referencedObject && referencedObject.assessments && (referencedObject.assessments.indexOf(answer.assessment_ID) === -1)) {
                    referencedObject.assessments.push(answer.assessment_ID);
                }
            },
            cleanUpReferencedObject = function(field, storage, saveObject, promiseList) {
                if(!isAnotherReferenceFound(field) && (getReferencedObjectId(currentReference, field) !== null)) {
                    storage.get({_id: getReferencedObjectId(currentReference, field)}, function (referencedObject) {
                        removeReferencedObjectAnswer(referencedObject);
                        cleanUpReferencedObjectAssessments(referencedObject);
                        promiseList.push(saveObject(referencedObject).$promise);
                    }, getHttpFailureHandler('Load reference data failure'));
                }
            },
            supplementReferencedObject = function(field, storage, saveObject, promiseList) {
                if(!isAnotherReferenceFound(field) && (getReferencedObjectId(currentReference, field) !== null)) {
                    storage.get({_id: getReferencedObjectId(currentReference, field)}, function (referencedObject) {
                        supplementReferencedObjectAnswers(referencedObject);
                        supplementReferencedObjectAssessments(referencedObject);
                        promiseList.push(saveObject(referencedObject).$promise);
                    }, getHttpFailureHandler('Load reference data failure'));
                }
            },
            modifyHiddenFlag = function(modifyReferenceObject, hiddenStatus, notificationMessage) {
                var promises = [];

                if(currentReference.citation_type === 'interview') {
                    modifyReferenceObject('interviewee_ID', rgiIntervieweeSrvc, rgiIntervieweeMethodSrvc.updateInterviewee, promises);
                } else if(currentReference.citation_type === 'document') {
                    modifyReferenceObject('document_ID', rgiDocumentSrvc, rgiDocumentMethodSrvc.updateDocument, promises);
                }

                currentReference.hidden = hiddenStatus;
                promises.push(rgiAnswerMethodSrvc.updateAnswer(answer).$promise);

                $q.all(promises).then(function() {
                    $rootScope.$broadcast('RESET_REFERENCE_ACTION');
                    rgiNotifier.notify(notificationMessage);
                }, getHttpFailureHandler('Save reference failure')).finally($scope.closeThisDialog);
            };

        $scope.deleteReference = function() {
            modifyHiddenFlag(cleanUpReferencedObject, true, 'The reference has been deleted');
        };

        $scope.restoreReference = function() {
            modifyHiddenFlag(supplementReferencedObject, false, 'The reference has been restored');
        };
    });
