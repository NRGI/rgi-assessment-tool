'use strict';

angular.module('app')
    .controller('rgiAnswerRawListCtrl', function (
        $scope,
        rgiAnswerRawSrvc,
        rgiIdentitySrvc) {

        $scope.current_user = rgiIdentitySrvc.currentUser;

        $scope.sort_options = [
            {value: 'assessment_ID', text: 'Sort by assessment'},
            {value: 'answer_ID', text: 'Sort by answer id'},
            {value: 'status', text: 'Sort by Status'},
            {value: 'researcher_score.letter', text: 'Researcher letter score'},
            {value: 'researcher_score.text', text: 'Researcher score text'},
            {value: 'researcher_score.value', text: 'Researcher score value'},
            {value: 'reviewer_score.letter', text: 'Reviewer letter score'},
            {value: 'reviewer_score.text', text: 'Reviewer score text'},
            {value: 'reviewer_score.value', text: 'Reviewer score value'}
        ];
        $scope.sort_order = $scope.sort_options[0].value;

        rgiAnswerRawSrvc.query({}, function (answer_data) {
            console.log(answer_data);
            $scope.raw_answer_header = answer_data.raw_answer_header;
            $scope.raw_answer_array = answer_data.raw_answer_array;
            // $scope.raw_answer_header = [
            //     'assessment_id',
            //     'answer_id',
            //     'status',
            //     'question_text',
            //     'researcher_score_letter',
            //     'researcher_score_text',
            //     'researcher_score_value',
            //     'reviewer_score_letter',
            //     'reviewer_score_text',
            //     'reviewer_score_value'
            // ];
            // // $scope.getArray = [{a: 1, b:2}, {a:3, b:4}];
            // $scope.raw_answer_array = []
            //
            // answers.forEach(function (answer) {
            //     $scope.raw_answer_array.push({
            //         assessment_id: answer.assessment_ID,
            //         answer_id: answer.answer_ID,
            //         status: answer.status,
            //         question_text: answer.question_ID.question_text
            //     });
            //     if (answer.researcher_score) {
            //         $scope.raw_answer_array[$scope.raw_answer_array.length-1].researcher_score_letter = answer.researcher_score.letter;
            //         $scope.raw_answer_array[$scope.raw_answer_array.length-1].researcher_score_text = answer.researcher_score.text;
            //         $scope.raw_answer_array[$scope.raw_answer_array.length-1].researcher_score_value = answer.researcher_score.value;
            //     }
            //     if (answer.reviewer_score) {
            //         $scope.raw_answer_array[$scope.raw_answer_array.length-1].reviewer_score_letter = answer.reviewer_score.letter;
            //         $scope.raw_answer_array[$scope.raw_answer_array.length-1].reviewer_score_text = answer.reviewer_score.text;
            //         $scope.raw_answer_array[$scope.raw_answer_array.length-1].reviewer_score_value = answer.reviewer_score.value;
            //     }
            // });

            //


            $scope.answers = answer_data.raw_answer_array;
        });
    });