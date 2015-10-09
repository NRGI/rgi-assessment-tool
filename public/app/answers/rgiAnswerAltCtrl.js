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

        //$scope.test_guidance = "<p>'Machine-readable' data refers to data that can be 'read automatically by a web broswer or computer system' (excerpted from the White House Office of Management and Budget Circular No. A-11, 2015, Section 200-17).  <p>Machine-readable data can take a variety of formats.  For the purposes of RGI, the most 'readable' data describes that which is available via a public API (i.e. an 'application programming interface'), whereby users can query a database directly to return raw data.  <p>To be treated as 'public' for the purposes of the RGI, an API must be accompanied by a landing page and user documentation.  Aside from an API, other machine-readable data formats include non-proprietary formats (i.e. .csv, .tsv, and .JSON) and propriatery formats (e.g. Microsoft Access and Excel files).  For the purposes of the RGI, the latter are viewed as less 'readable' than the former in that they cannot always be read directly by programming languages or open source software.  For the purposes of the RGI, data contained in PDF and Microsoft Word files is viewed as less 'readable' in that data is mingled with text and formatting and cannot be easily extracted without transcription or data entry.";
        //$scope.test_guidance = "<p><ul><li>YEs</li><li>No</li></ul>"
        $scope.dynamicPopover = {
            content: 'Hello, World!',
            templateUrl: 'myPopoverTemplate.html',
            title: 'Title'
        };

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