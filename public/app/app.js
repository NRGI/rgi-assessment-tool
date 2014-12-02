angular.module('app', ['ngResource', 'ngRoute']);

angular.module('app').config(function($routeProvider, $locationProvider) {
  var routeRoleChecks = {
    supervisor: {auth: function(rgiAuth) {
      return rgiAuth.authorizeCurrentUserForRoute('supervisor')
    }},
    researcher: {auth: function(rgiAuth) {
      return rgiAuth.authorizeCurrentUserForRoute('researcher')
    }},
    reviewer: {auth: function(rgiAuth) {
      return rgiAuth.authorizeCurrentUserForRoute('reviewer')
    }},
    user: {auth: function(rgiAuth) {
      return rgiAuth.authorizeAuthenticatedUserForRoute()
    }}
  }

  $locationProvider.html5Mode(true);
  $routeProvider
    .when('/', { 
      templateUrl: '/partials/main/main', 
      controller: 'rgiMainCtrl'
    })
    // Admin Routes
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
    .when('/admin/question-admin', {
      templateUrl: '/partials/admin/questions/question-admin', 
      controller: 'rgiQuestionAdminCtrl', 
      resolve: routeRoleChecks.supervisor
    })
    .when('/admin/question-admin/:id', {
      templateUrl: '/partials/admin/questions/question-admin-update', 
      controller: 'rgiQuestionAdminUpdateCtrl', 
      resolve: routeRoleChecks.supervisor
    })
    .when('/admin/assessment-admin', {
      templateUrl: '/partials/admin/assessments/assessment-admin', 
      controller: 'rgiAssessmentAdminCtrl', 
      resolve: routeRoleChecks.supervisor
    })

    .when('/admin/assessment-admin/:assessment_ID', {
      templateUrl: '/partials/admin/assessments/assessment-admin-assign', 
      controller: 'rgiAssessmentAdminAssignCtrl', 
      resolve: routeRoleChecks.supervisor
    })
    .when('admin/assessments', {
      templateUrl: '/partials/admin/assessments/assessment-dashboard',
      controller: 'rgiAssessmentDashboardCtrl', 
      resolve: routeRoleChecks.user
    })
    .when('admin/assessments/:assessment_ID', {
      templateUrl: '/partials/admin/assessments/assessment-dashboard-detail',
      controller: 'rgiAssessmentDashboardDetailCtrl', 
      resolve: routeRoleChecks.user
    })
    // User Account Routes
    .when('/profile', {
      templateUrl: '/partials/account/profile',
      controller: 'rgiProfileCtrl', 
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
      controller: 'rgiAssessmentDetailCtrl', 
      resolve: routeRoleChecks.user
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

angular.module('app').run(function($rootScope, $location) {
  $rootScope.$on('$routeChangeError', function(evt, current, previous, rejection) {
    if(rejection === 'not authorized') {
      $location.path('/');
    }
  })
})
