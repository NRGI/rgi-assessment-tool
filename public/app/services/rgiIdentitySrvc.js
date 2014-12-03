angular.module('app').factory('rgiIdentitySrvc', function($window, rgiUserSrvc) {
  var currentUser;
  if(!!$window.bootstrappedUserObject) {
    currentUser = new rgiUserSrvc();
    angular.extend(currentUser, $window.bootstrappedUserObject);
  }
  return {
    currentUser: currentUser,
    isAuthenticated: function() {
      return !!this.currentUser;
    },
    isAuthorized: function(role) {
      return !!this.currentUser && this.currentUser.roles.indexOf(role) > -1;
    }
  }
})