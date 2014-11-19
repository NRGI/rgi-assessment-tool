angular.module('app').factory('rgiIdentity', function($window, rgiUser) {
  var currentUser;
  if(!!$window.bootstrappedUserObject) {
    currentUser = new rgiUser();
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