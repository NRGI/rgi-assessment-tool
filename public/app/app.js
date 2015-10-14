'use strict';
angular.module('app', [
    //'720kb.datepicker',
    'angular.filter',
    'angularFileUpload',
    'angular-redactor',
    'angucomplete',
    'infinite-scroll',
    'ng-form-group',
    'ngCsv',
    'ngDialog',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ui.bootstrap'
]);

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
        .when('/admin/user-admin-view/:id', {
            templateUrl: '/partials/admin/users/user-admin-view',
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
            controller: 'rgiDocumentAdminCtrl',
            resolve: routeRoleChecks.supervisor
        })
        .when('/admin/documents-admin/:document_ID', {
            templateUrl: '/partials/admin/documents/document-admin-detail',
            controller: 'rgiDocumentAdminDetailCtrl',
            resolve: routeRoleChecks.supervisor
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
            resolve: routeRoleChecks.supervisor
        })
        // INTERVIEWEES
        .when('/admin/interviewees-admin', {
            templateUrl: '/partials/admin/interviewees/interviewee-admin',
            controller: 'rgiIntervieweeAdminCtrl',
            resolve: routeRoleChecks.supervisor
        })
        .when('/admin/interviewees-admin/:interviewee_ID', {
            templateUrl: '/partials/admin/interviewees/interviewee-admin-detail',
            controller: 'rgiIntervieweeAdminDetailCtrl',
            resolve: routeRoleChecks.supervisor
        })
        ///// GENERAL ROUTES
        // Assessments
        .when('/assessments', {
            templateUrl: '/partials/assessments/assessments-list',
            controller:  'rgiAssessmentsListCtrl',
            resolve: routeRoleChecks.user
        })
        .when('/assessments/:assessment_ID', {
            templateUrl: '/partials/assessments/assessment-detail',
            controller:  'rgiAssessmentDetailCtrl',
            resolve: routeRoleChecks.user
        })

        .when('/assessments-review/:assessment_ID', {
            templateUrl: '/partials/researchers/assessments/assessment-review',
            controller:  'rgiAssessmentDetailCtrl',
            resolve: routeRoleChecks.user
        })

        // Answers
        .when('/admin/assessments-admin/answer/:answer_ID', {
            templateUrl: '/partials/answers/answer',
            controller: 'rgiAnswerAltCtrl',
            resolve: routeRoleChecks.supervisor
        })
        .when('/assessments/answer/:answer_ID', {
            templateUrl: '/partials/answers/answer',
            controller: 'rgiAnswerAltCtrl',
            resolve: routeRoleChecks.user
        })



        // Answers
        .when('/admin/assessment-review/:assessment_ID', {
            templateUrl: '/partials/admin/assessments/review/assessment-review',
            controller: 'rgiAssessmentAdminDetailCtrl',
            resolve: routeRoleChecks.supervisor
        })
        .when('/admin/assessment-review/answer-review-edit/:answer_ID', {
            templateUrl: '/partials/admin/assessments/review/answer-page-review',
            controller: 'rgiAnswerCtrl'
        })
        //.when('/assessments', {
        //    templateUrl: '/partials/researchers/assessments/assessments-list',
        //    controller:  'rgiAssessmentsListCtrl',
        //    resolve: routeRoleChecks.user
        //})
        //.when('/assessments/:assessment_ID', {
        //    templateUrl: '/partials/researchers/assessments/assessment-detail',
        //    controller:  'rgiAssessmentDetailCtrl',
        //    resolve: routeRoleChecks.user
        //})
        //////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////
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
