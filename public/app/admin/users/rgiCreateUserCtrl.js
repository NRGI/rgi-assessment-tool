angular.module('app').controller('rgiCreateUserCtrl', function($scope, rgiUserSrvc, rgiNotifier, $location, rgiAuthSrvc) {

  $scope.createUser = function() {
    var newUserData = {
      firstName: $scope.fname,
      lastName: $scope.lname,
      username: $scope.username,
      email: $scope.email,
      password: $scope.password,
      roles: [$scope.roles],
      // // Need to create creation event
      // creation: {createdBy: user id, createdDate: Date.now},
      address: [$scope.address],
      language: [$scope.language]
    };

    rgiAuthSrvc.createUser(newUserData).then(function() {
      rgiNotifier.notify('User account created!');
      $location.path('/');
    }, function(reason) {
      rgiNotifier.error(reason);
    })
  }
})


// angular.module('app').controller('mvSignupCtrl', function($scope, mvUser, mvNotifier, $location, mvAuth) {

//   $scope.signup = function() {
//     var newUserData = {
//       username: $scope.email,
//       password: $scope.password,
//       firstName: $scope.fname,
//       lastName: $scope.lname
//     };

//     mvAuth.createUser(newUserData).then(function() {
//       mvNotifier.notify('User account created!');
//       $location.path('/');
//     }, function(reason) {
//       mvNotifier.error(reason);
//     })
//   }
// })