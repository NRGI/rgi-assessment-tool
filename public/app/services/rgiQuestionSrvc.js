// query base questions or get base question by id
angular.module('app').factory('rgiQuestionSrvc', function ($resource) {
    var QuestionResource = $resource('/api/questions/:_id', {_id: '@id'}, {
        update: {method: 'PUT', isArray: false},
    });

    return QuestionResource;
});