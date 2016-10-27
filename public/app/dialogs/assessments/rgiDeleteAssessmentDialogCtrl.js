'use strict';

angular.module('app')
    .controller('rgiDeleteAssessmentDialogCtrl', [
        '_',
        '$scope',
        '$location',
        '$q',
        'rgiAssessmentMethodSrvc',
        'rgiHttpResponseProcessorSrvc',
        'rgiLogger',
        'rgiNotifier',
        'rgiUserSrvc',
        'rgiUserMethodSrvc',
        'ASSESSMENT_ROLES_SET',
        'AVAILABLE_ROLES_SET',
        function (
            _,
            $scope,
            $location,
            $q,
            rgiAssessmentMethodSrvc,
            rgiHttpResponseProcessorSrvc,
            rgiLogger,
            rgiNotifier,
            rgiUserSrvc,
            rgiUserMethodSrvc,
            ASSESSMENT_ROLES_SET,
            AVAILABLE_ROLES_SET
        ) {
            var
                getUserByRole = function(role) {
                    return $scope.assessment[role + '_ID'];
                },
                getAssessmentIndex = function(user) {
                    var assessmentIndex = -1;

                    user.assessments.forEach(function(assessment, index) {
                        if(assessment.assessment_ID === $scope.assessment.assessment_ID) {
                            assessmentIndex = index;
                        }
                    });

                    return assessmentIndex;
                };

            $scope.remove = function() {
                var assignedUsersData = [], promises = [], users = [];

                AVAILABLE_ROLES_SET.forEach(function(role) {
                    if(getUserByRole(role) !== undefined) {
                        if(_.without(ASSESSMENT_ROLES_SET, 'ext_reviewer').indexOf(role) === -1) {
                            assignedUsersData = assignedUsersData.concat(getUserByRole(role));
                        } else {
                            assignedUsersData.push(getUserByRole(role));
                        }
                    }
                });

                assignedUsersData.forEach(function(userData) {
                    promises.push(rgiUserSrvc.getCached({_id: userData._id}, function(user) {
                        users.push(user);
                    }).$promise);
                });

                $q.all(promises).then(function() {
                    promises = [];
                    $scope.assessment.deleted = true;
                    promises.push(rgiAssessmentMethodSrvc.updateAssessment($scope.assessment).$promise);

                    users.forEach(function(user) {
                        var assessmentIndex = getAssessmentIndex(user);

                        if(assessmentIndex !== -1) {
                            user.assessments.splice(assessmentIndex, 1);
                            promises.push(rgiUserMethodSrvc.updateUser(user).$promise);
                        }
                    });

                    $q.all(promises).then(function() {
                        rgiNotifier.notify('The assessment has been deleted');
                        $location.path('/admin/assessment-admin');
                    }, function(reason) {
                        $scope.assessment.deleted = false;
                        rgiNotifier.error('The assessment removal has been failed');
                        rgiLogger.log(reason);
                    }).finally($scope.closeThisDialog);
                }, rgiHttpResponseProcessorSrvc.getNotRepeatedHandler('Load user data failure'));
            };
        }]);
