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
    .when('/admin/users', {
      templateUrl: '/partials/admin/user-list', 
      controller: 'rgiUserListCtrl', 
      resolve: routeRoleChecks.supervisor
    })
    .when('/signup', {
      templateUrl: '/partials/account/signup',
      controller: 'rgiSignupCtrl'
    })
    .when('/profile', {
      templateUrl: '/partials/account/profile',
      controller: 'rgiProfileCtrl', 
      resolve: routeRoleChecks.user
    })
    .when('/reporting', {
      templateUrl: '/partials/questions/reporting',
      controller: 'rgiReportingCtrl'
    })
    .when('/assessment', {
      templateUrl:'/partials/assessments/assessment-list',
      controller: 'rgiAssessmentCtrl'
    });
});

angular.module('app').run(function($rootScope, $location) {
  $rootScope.$on('$routeChangeError', function(evt, current, previous, rejection) {
    if(rejection === 'not authorized') {
      $location.path('/');
    }
  })
})
