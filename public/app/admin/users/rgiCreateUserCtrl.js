angular.module('app').controller('rgiCreateUserCtrl', function($scope, $location, rgiNotifier, rgiIdentitySrvc, rgiUserSrvc, rgiUserMethodSrvc) {
  
  $scope.roleOptions = [
    {value:'admin',text:'Administrator'},
    {value:'supervisor',text:'Supervisor'},
    {value:'researcher',text:'Researcher'},
    {value:'reviewer',text:'Reviewer'}
    // {value:'external',text:'External Reviewer (i.e. company, national gov, etc.)'},
    // {value:'',text:''}
  ]

  // fix submit button functionality
  $scope.userCreate = function() {
    var newUserData = {
      firstName: $scope.fname,
      lastName: $scope.lname,
      username: $scope.username,
      email: $scope.email,
      password: $scope.password,
      // ADD ROLE IN CREATION EVENT
      roles: [$scope.roleSelect],
      createdBy: rgiIdentitySrvc.currentUser._id,
      address: [$scope.address],
      language: [$scope.language]
    };
    
    rgiUserMethodSrvc.createUser(newUserData).then(function() {
      rgiNotifier.notify('User account created!');
      $location.path('/admin/user-admin');
    }, function(reason) {
      rgiNotifier.error(reason);
    })
  };
});