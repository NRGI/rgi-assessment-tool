'use strict';
//var angular;
/*jslint unparam: true */

// angular.module('app', ['ngResource', 'ngRoute', 'ngDialog', 'ng-form-group', 'alasql', '']);
angular.module('app', ['ngResource', 'ngRoute', 'ngDialog', 'ng-form-group', 'ngSanitize', 'ngCsv', 'angularFileUpload', 'angular.filter', '720kb.datepicker', 'angucomplete']);

angular.module('app').config(function ($routeProvider, $locationProvider) {
  // role checks
    var routeRoleChecks = {
            supervisor: {auth: function (rgiAuthSrvc) {
                return rgiAuthSrvc.authorizeCurrentUserForRoute('supervisor');
            }},
            researcher: {auth: function (rgiAuthSrvc) {
                return rgiAuthSrvc.authorizeCurrentUserForRoute('researcher');
            }},
            reviewer: {auth: function (rgiAuthSrvc) {
                return rgiAuthSrvc.authorizeCurrentUserForRoute('reviewer');
            }},
            user: {auth: function (rgiAuthSrvc) {
                return rgiAuthSrvc.authorizeAuthenticatedUserForRoute();
            }}
        };

    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            templateUrl: '/partials/main/main',
            controller: 'rgiMainCtrl'
        })
        .when('/contact', {
            templateUrl: '/partials/main/contact',
            controller: 'rgiContactTechCtrl'
        })
        // User Account Routes
        .when('/profile', {
            templateUrl: '/partials/account/profile',
            controller:  'rgiProfileCtrl',
            resolve: routeRoleChecks.user
        })
        .when('/recover-password', {
            templateUrl: '/partials/account/recover-password',
            controller:  'rgiRecoverPasswordCtrl'
        })
        .when('/reset-password/:token', {
            templateUrl: '/partials/account/reset-password',
            controller:  'rgiResetPasswordCtrl'
        })

        ///// Admin Routes
        // USERS
        .when('/admin/user-create', {
            templateUrl: '/partials/admin/users/user-create',
            controller: 'rgiUserCreateCtrl',
            resolve: routeRoleChecks.supervisor
        })
        .when('/admin/user-admin', {
            templateUrl: '/partials/admin/users/user-admin',
            controller:  'rgiUserAdminCtrl',
            resolve: routeRoleChecks.supervisor
        })
        .when('/admin/user-admin/:id', {
            templateUrl: '/partials/admin/users/user-admin-update',
            controller:  'rgiUserAdminUpdateCtrl',
            resolve: routeRoleChecks.supervisor
        })
        .when('/admin/user-admin-edit/:id', {
            templateUrl: '/partials/admin/users/user-admin-edit',
            controller:  'rgiUserAdminDetailCtrl',
            resolve: routeRoleChecks.supervisor
        })
        // QUESTIONS
        .when('/admin/question-admin', {
            templateUrl: '/partials/admin/questions/question-admin',
            controller:  'rgiQuestionAdminCtrl',
            resolve: routeRoleChecks.supervisor
        })
        .when('/admin/question-admin-edit/:id', {
            templateUrl: '/partials/admin/questions/question-admin-edit',
            controller:  'rgiQuestionAdminDetailCtrl',
            resolve: routeRoleChecks.supervisor
        })
        // DOCUMENTS
        .when('/admin/documents-admin', {
            templateUrl: '/partials/admin/documents/document-admin',
            controller: 'rgiDocumentAdminCtrl'
        })
        .when('/admin/documents-admin/:document_ID', {
            templateUrl: '/partials/admin/documents/document-admin-detail',
            controller: 'rgiDocumentAdminDetailCtrl'
        })
        // ASSESSMENTS
        .when('/admin/assessment-admin', {
            templateUrl: '/partials/admin/assessments/assessment-admin',
            controller:  'rgiAssessmentAdminCtrl',
            resolve: routeRoleChecks.supervisor
        })
        .when('/admin/assessment-admin/subs/:version', {
            templateUrl: '/partials/admin/assessments/assessment-admin',
            controller:  'rgiAssessmentAdminCtrl',
            resolve: routeRoleChecks.supervisor
        })
        .when('/admin/assessments-admin/:assessment_ID', {
            templateUrl: '/partials/admin/assessments/assessment-admin-detail',
            controller:  'rgiAssessmentAdminDetailCtrl',
            resolve: routeRoleChecks.user
        })
        // INTERVIEWEES
        .when('/admin/interviewees-admin', {
            templateUrl: '/partials/admin/interviewees/interviewee-admin',
            controller: 'rgiIntervieweeAdminCtrl'
        })
        .when('/admin/interviewees-admin/:interviewee_ID', {
            templateUrl: '/partials/admin/interviewees/interviewee-admin-detail',
            controller: 'rgiIntervieweeAdminDetailCtrl'
        })
        //////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////
        .when('/admin/assessment-review/:assessment_ID', {
            templateUrl: '/partials/admin/assessments/review/assessment-review',
            controller: 'rgiAssessmentAdminDetailCtrl',
            resolve: routeRoleChecks.supervisor
        })
        .when('/admin/assessment-review/answer-review-edit/:answer_ID', {
            templateUrl: '/partials/admin/assessments/review/answer-page-review',
            controller: 'rgiAnswerCtrl'
        })
        //////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////
        ///// researcher Routes
        // Assessments
        .when('/assessments', {
            templateUrl: '/partials/researchers/assessments/assessments-list',
            controller:  'rgiAssessmentsListCtrl',
            resolve: routeRoleChecks.user
        })
        .when('/assessments/:assessment_ID', {
            templateUrl: '/partials/researchers/assessments/assessment-detail',
            controller:  'rgiAssessmentDetailCtrl',
            resolve: routeRoleChecks.user
        })
        .when('/assessments-review/:assessment_ID', {
            templateUrl: '/partials/researchers/assessments/assessment-review',
            controller:  'rgiAssessmentDetailCtrl',
            resolve: routeRoleChecks.user
        })
        // Answers
        .when('/assessments/assessment-view/:answer_ID', {
            templateUrl: '/partials/researchers/answers/answer-page-view',
            controller:  'rgiAnswerCtrl'
        })
        .when('/assessments/assessment-edit/:answer_ID', {
            templateUrl: '/partials/researchers/answers/answer-page-edit',
            controller:  'rgiAnswerCtrl'
        })
        .when('/assessment-review/answer-review/:answer_ID', {
            templateUrl: '/partials/researchers/answers/answer-page-review',
            controller:  'rgiAnswerCtrl'
        });

});

angular.module('app').run(function ($rootScope, $location) {
    $rootScope.$on('$routeChangeError', function (evt, current, previous, rejection) {
        if (rejection === 'not authorized') {
            $location.path('/');
        }
    });
});
