angular.module('app', ['ngResource', 'ngRoute']);

angular.module('app').config(function($routeProvider, $locationProvider) {
  var routeRoleChecks = {
    supervisor: {auth: function(rgiAuth) {
      return rgiAuth.authorizeCurrentUserForRoute('supervisor')
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
    .when('/reporting', {
      templateUrl: '/partials/questions/reporting',
      controller: 'rgiReportingCtrl'
    });
    // .when('/institutional', {
    //   templateUrl: '/partials/questions/institutional',
    //   controller: 'rgiInstitutionalCtrl'
    // })
    // .when('/safeguards', {
    //   templateUrl: '/partials/questions/safeguards',
    //   controller: 'rgiSafeguardsCtrl'
    // });
});

angular.module('app').run(function($rootScope, $location) {
  $rootScope.$on('$routeChangeError', function(evt, current, previous, rejection) {
    if(rejection === 'not authorized') {
      $location.path('/');
    }
  })
})
