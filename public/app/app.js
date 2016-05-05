'use strict';
angular.module('app', [
    'angular.filter',
    'angularFileUpload',
    'angular-underscore',
    'angucomplete',
    'as.sortable',
    'infinite-scroll',
    'ng-form-group',
    'ngCsv',
    'ngDialog',
    //'ngPopup',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ta-maxlength',
    'tableSort',
    'textAngular',
    'ui.bootstrap',
    'ui.mask'
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
        // FAQ/RESOURCES
        .when('/faq', {
            templateUrl: '/partials/main/resources',
            controller: 'rgiResourcesCtrl',
            resolve: routeRoleChecks.user
        })
        .when('/resource', {
            templateUrl: '/partials/main/resources',
            controller: 'rgiResourcesCtrl',
            resolve: routeRoleChecks.user
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
            templateUrl: '/partials/admin/users/user-admin-detail',
            controller:  'rgiUserAdminDetailCtrl',
            resolve: routeRoleChecks.supervisor
        })
        // QUESTIONS
        .when('/admin/question-admin', {
            templateUrl: '/partials/admin/questions/question-admin',
            controller:  'rgiQuestionAdminCtrl',
            resolve: routeRoleChecks.supervisor
        })
        .when('/admin/question-admin/:id', {
            templateUrl: '/partials/admin/questions/question-admin-detail',
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
        // RESOURCES
        .when('/admin/faq-admin', {
            templateUrl: '/partials/admin/resources/resources-admin',
            controller: 'rgiResourcesAdminCtrl',
            resolve: routeRoleChecks.supervisor
        })
        .when('/admin/resource-admin', {
            templateUrl: '/partials/admin/resources/resources-admin',
            controller: 'rgiResourcesAdminCtrl',
            resolve: routeRoleChecks.supervisor
        })
        //.when('/admin/faq-admin/:_id', {
        //    templateUrl: '/partials/admin/resources/resources-admin-detail',
        //    controller: 'rgiResourcesAdminDetailCtrl',
        //    resolve: routeRoleChecks.supervisor
        //})
        //.when('/admin/resource-admin/:_id', {
        //    templateUrl: '/partials/admin/resources/resources-admin-detail',
        //    controller: 'rgiResourcesAdminDetailCtrl',
        //    resolve: routeRoleChecks.supervisor
        //})

        ///// GENERAL ROUTES
        /// Assessments
        // User
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
        // Admin
        .when('/admin/assessment-admin', {
            templateUrl: '/partials/assessments/assessments-list',
            controller:  'rgiAssessmentsListCtrl',
            resolve: routeRoleChecks.supervisor
        })
        .when('/admin/assessment-admin/subs/:version', {
            templateUrl: '/partials/assessments/assessments-list',
            controller:  'rgiAssessmentsListCtrl',
            resolve: routeRoleChecks.supervisor
        })
        .when('/admin/assessments-admin/:assessment_ID', {
            templateUrl: '/partials/assessments/assessment-detail',
            controller:  'rgiAssessmentDetailCtrl',
            resolve: routeRoleChecks.supervisor
        })

        //.when('/assessments-review/:assessment_ID', {
        //    templateUrl: '/partials/researchers/assessments/assessment-review',
        //    controller:  'rgiAssessmentDetailCtrl',
        //    resolve: routeRoleChecks.user
        //})

        // Answers
        .when('/admin/assessments-admin/answer/:answer_ID', {
            templateUrl: '/partials/answers/answer',
            controller: 'rgiAnswerCtrl',
            resolve: routeRoleChecks.supervisor
        })
        .when('/assessments/answer/:answer_ID', {
            templateUrl: '/partials/answers/answer',
            controller: 'rgiAnswerCtrl',
            resolve: routeRoleChecks.user
        });



        // Answers
        //.when('/admin/assessment-review/:assessment_ID', {
        //    templateUrl: '/partials/admin/assessments/review/assessment-review',
        //    controller: 'rgiAssessmentAdminDetailCtrl',
        //    resolve: routeRoleChecks.supervisor
        //})
        //.when('/admin/assessment-review/answer-review-edit/:answer_ID', {
        //    templateUrl: '/partials/admin/assessments/review/answer-page-review',
        //    controller: 'rgiAnswerCtrl'
        //})
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
        //.when('/assessments/assessment-view/:answer_ID', {
        //    templateUrl: '/partials/researchers/answers/answer-page-view',
        //    controller:  'rgiAnswerCtrl'
        //})
        //.when('/assessments/assessment-edit/:answer_ID', {
        //    templateUrl: '/partials/researchers/answers/answer-page-edit',
        //    controller:  'rgiAnswerCtrl'
        //})
        //.when('/assessment-review/answer-review/:answer_ID', {
        //    templateUrl: '/partials/researchers/answers/answer-page-review',
        //    controller:  'rgiAnswerCtrl'
        //});

});

angular.module('app').run(function ($rootScope, $location, rgiIdentitySrvc) {
    $rootScope.$on('$routeChangeError', function (evt, current, previous, rejection) {
        if (rejection === 'not authorized') {
            $location.path('/');
        }
    });

    $rootScope.identity = rgiIdentitySrvc;
    $rootScope._ = _;
    $rootScope.externalThreshold = 0.8;
});
