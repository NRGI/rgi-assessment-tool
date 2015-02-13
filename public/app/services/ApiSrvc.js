// Experiment in wrappin all the api services into a single service
/*global angular */
'use strict';

var app = angular.module('app').factory('rgiApiSrvc', function ($resource) {

    // function

    // var UserResource = $resource('/api/users/:_id', {_id: "@id"}, {
    // update: {method: 'PUT', isArray:false}
    // });

    // services.factory('Api', ['$resource',
    //  function($resource) {
    //   return {
    //     Recipe: $resource('/recipes/:id', {id: '@id'}),
    //     Users:  $resource('/users/:id', {id: '@id'}),
    //     Group:  $resource('/groups/:id', {id: '@id'})
    //   };
    // }]);

    // function myCtrl($scope, Api){
    //   $scope.recipe = Api.Recipe.get({id: 1});
    //   $scope.users = Api.Users.query();
    //   ...
    // }


});