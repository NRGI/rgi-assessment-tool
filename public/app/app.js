angular.module('app', ['ngResource', 'ngRoute', 'ngDialog', 'ng-form-group', 'flow']);

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
        // User Account Routes
        .when('/profile', {
            templateUrl: '/partials/account/profile',
            controller: 'rgiProfileCtrl',
            resolve: routeRoleChecks.user
        })

        ///// Admin Routes
        // USERS
        .when('/admin/create-user', {
            templateUrl: '/partials/admin/users/create-user',
            controller: 'rgiCreateUserCtrl',
            resolve: routeRoleChecks.supervisor
        })
        .when('/admin/user-admin', {
            templateUrl: '/partials/admin/users/user-admin',
            controller: 'rgiUserAdminCtrl',
            resolve: routeRoleChecks.supervisor
        })
        .when('/admin/user-admin/:id', {
            templateUrl: '/partials/admin/users/user-admin-update',
            controller: 'rgiUserAdminUpdateCtrl',
            resolve: routeRoleChecks.supervisor
        })
        .when('/admin/user-admin-view/:id', {
            templateUrl: '/partials/admin/users/user-admin-view',
            controller: 'rgiUserAdminDetailCtrl',
            resolve: routeRoleChecks.supervisor
        })
        .when('/admin/user-admin-edit/:id', {
            templateUrl: '/partials/admin/users/user-admin-edit',
            controller: 'rgiUserAdminDetailCtrl',
            resolve: routeRoleChecks.supervisor
        })
    // QUESTIONS
        .when('/admin/question-admin', {
            templateUrl: '/partials/admin/questions/question-admin',
            controller: 'rgiQuestionAdminCtrl',
            resolve: routeRoleChecks.supervisor
        })
        .when('/admin/question-admin-view/:id', {
            templateUrl: '/partials/admin/questions/question-admin-view',
            controller: 'rgiQuestionAdminDetailCtrl',
            resolve: routeRoleChecks.supervisor
        })
        .when('/admin/question-admin-edit/:id', {
            templateUrl: '/partials/admin/questions/question-admin-edit',
            controller: 'rgiQuestionAdminDetailCtrl',
            resolve: routeRoleChecks.supervisor
        })
    // ASSESSMENTS
        .when('/admin/assessment-admin', {
            templateUrl: '/partials/admin/assessments/assessment-admin',
            controller: 'rgiAssessmentAdminCtrl',
            resolve: routeRoleChecks.supervisor
        })
        .when('/admin/assessment-assign/:assessment_ID', {
            templateUrl: '/partials/admin/assessments/assessment-admin-assign',
            controller: 'rgiAssessmentAdminAssignCtrl',
            resolve: routeRoleChecks.supervisor
        })
        .when('/admin/assessments-admin/:assessment_ID', {
            templateUrl: '/partials/admin/assessments/assessment-admin-detail',
            controller: 'rgiAssessmentAdminDetailCtrl',
            resolve: routeRoleChecks.user
        })

    // Assessment overview routes
        .when('/assessments', {
            templateUrl: '/partials/assessments/assessments-list',
            controller: 'rgiAssessmentsListCtrl',
            resolve: routeRoleChecks.user
        })
        .when('/assessments/:assessment_ID', {
            templateUrl: '/partials/assessments/assessment-detail',
      // controller: '',
            controller: 'rgiAssessmentDetailCtrl',
            resolve: routeRoleChecks.user
        })


        .when('/assessments/assessment-view/:answer_ID', {
            templateUrl: '/partials/assessments/answer-page-view',
            controller: 'rgiAnswerCtrl'
        })
          .when('/assessments/assessment-edit/:answer_ID', {
            templateUrl: '/partials/assessments/answer-page-edit',
            controller: 'rgiAnswerCtrl'
        })

        .when('/answer-page', {
            templateUrl: '/partials/answer-page',
            constant: 'rgiAnswerCtrl'
        })
        .when('/answer-page-bolivia', {
            templateUrl: '/partials/bolivia-answer-page',
            constant: 'boliviaCtrl'
        });
    // .when('/reporting', {
    //   templateUrl: '/partials/questions/reporting',
    //   controller: 'rgiReportingCtrl'
    // })
    // .when('/assessment/:nav_ID', {
    //   templateUrl:'/partials/assessments/assessment-details',
    //   controller: 'rgiAssessmentDetailCtrl'
    // });
});

angular.module('app').run(function ($rootScope, $location) {
    $rootScope.$on('$routeChangeError', function (evt, current, previous, rejection) {
        if (rejection === 'not authorized') {
            $location.path('/');
        }
    });
});
