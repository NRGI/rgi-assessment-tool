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
      templateUrl: '/partials/admin/create-user', 
      controller: 'rgiCreateUserCtrl', 
      resolve: routeRoleChecks.supervisor
    })
    .when('/admin/user-admin', {
      templateUrl: '/partials/admin/user-admin', 
      controller: 'rgiUserAdminCtrl', 
      resolve: routeRoleChecks.supervisor
    })
    .when('/admin/user-admin/:id', {
      templateUrl: '/partials/admin/user-admin-update', 
      controller: 'rgiUserAdminUpdateCtrl', 
      resolve: routeRoleChecks.supervisor
    })
    .when('/admin/question-edit', {
      templateUrl: '/partials/admin/question-edit', 
      controller: 'rgiQuestionEditCtrl', 
      resolve: routeRoleChecks.supervisor
    })
    .when('/admin/question-edit/:id', {
      templateUrl: '/partials/admin/question-edit-update', 
      controller: 'rgiQuestionEditUpdateCtrl', 
      resolve: routeRoleChecks.supervisor
    })
    .when('/admin/assessments', {
      templateUrl: '/partials/admin/assessment-admin-list', 
      controller: 'rgiAssessmentAdminListCtrl', 
      resolve: routeRoleChecks.supervisor
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
