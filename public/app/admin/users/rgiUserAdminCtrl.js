angular
    .module('app')
    .controller('rgiUserAdminCtrl', function (
        $scope,
        rgiUserSrvc,
        rgiAssessmentSrvc,
        rgiAuthLogsSrvc
    ) {
        'use strict';
        // filtering options
        $scope.sort_options = [
            {value: "firstName", text: "Sort by First Name"},
            {value: "lastName", text: "Sort by Last Name"},
            {value: "username", text: "Sort by Username"},
            {value: "role", text: "Sort by Role"},
            {value: "approved", text: "Sort by Approved"},
            {value: "submitted", text: "Sort by Submitted"}
        ];
        $scope.sort_order = $scope.sort_options[1].value;

        var ITEMS_PER_PAGE = 20, currentPage = 0;



        rgiUserSrvc.query({}, function (users) {
            $scope.users = [];
            users.forEach(function (user) {
                rgiAuthLogsSrvc.getMostRecent(user._id, 'sign-in')
                    .then(function (log) {
                        user.last_sign_in = log.data.logs[0];
                    });

                //get assessment info
                user.assessments.forEach(function(el, i) {
                    user.assessments[i].details = rgiAssessmentSrvc.get({assessment_ID: el.assessment_ID});
                });
                $scope.users.push(user);
            });
        });
    });




//$scope.logs = [];
//
//$scope.loadLogs = function() {
//    if(currentPage < totalPages) {
//        rgiAuthLogsSrvc.list(userId, ITEMS_PER_PAGE, currentPage++).then(function (logsResponse) {
//            if(logsResponse.data.error) {
//                rgiNotifier.error(logsResponse.data.error.message);
//            } else {
//                logsResponse.data.logs.forEach(function(log) {
//                    $scope.logs.push(log);
//                });
//            }
//        }, function() {
//            rgiNotifier.error('Auth logs loading failure');
//        });
//    }
//};