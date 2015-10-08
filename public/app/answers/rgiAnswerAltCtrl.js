function zeroFill(number, width) {
    'use strict';
    width -= number.toString().length;
    if (width > 0) {
        return new Array( width + (/\./.test(number) ? 2 : 1) ).join('0') + number;
    }
    return number + ""; // always return a string
}
// Review functions
function flagCheck(flags) {
    'use strict';
    var disabled = false;
    if (flags.length !== 0) {
        flags.forEach(function (el) {
            if (el.addressed === false) {
                disabled = true;
            }
        });
    }
    return disabled;
}
angular
    .module('app')
    .controller('rgiAnswerAltCtrl', function (
        $scope,
        $routeParams,
        $q,
        rgiAnswerSrvc,
        rgiDocumentSrvc,
        rgiIdentitySrvc,
        rgiAssessmentSrvc,
        rgiQuestionSrvc
    ) {
        'use strict';
        $scope.identity = rgiIdentitySrvc;
        $scope.ref_type = [
            {text: 'Add Document', value: 'document'},
            {text: 'Add Webpage', value: 'webpage'},
            {text: 'Add Interview', value: 'interview'}
        ];

        rgiAnswerSrvc.get({answer_ID: $routeParams.answer_ID, assessment_ID: $routeParams.answer_ID.substring(0, 2)}, function (data) {
            $scope.answer = data;
            $scope.assessment = rgiAssessmentSrvc.get({assessment_ID: data.assessment_ID});
            $scope.question = rgiQuestionSrvc.get({_id: data.question_ID});
            $scope.current_user = rgiIdentitySrvc.currentUser;
            $scope.answer_start = angular.copy($scope.answer);

            var citations = [];

            data.references.citation.forEach(function (el) {
                rgiDocumentSrvc.get({_id: el.document_ID}, function (doc) {
                    doc.comment = el;
                    citations.push(doc);
                });
            });
            $scope.citations = citations;

        });
    });