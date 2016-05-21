'use strict';

angular.module('app')
    .controller('rgiAuthLogsCtrl', function (
        $scope,
        rgiAuthLogsSrvc,
        rgiHttpResponseProcessorSrvc,
        rgiNotifier
    ) {
        var userId, totalPages, ITEMS_PER_PAGE = 20, currentPage = 0;
        $scope.logs = [];

        var processHttpFailure = rgiHttpResponseProcessorSrvc.getDefaultHandler('Auth logs loading failure');

        $scope.loadLogs = function() {
            if(currentPage < totalPages) {
                rgiAuthLogsSrvc.list(userId, ITEMS_PER_PAGE, currentPage++).then(function (logsResponse) {
                    if(logsResponse.data.error) {
                        rgiNotifier.error(logsResponse.data.error.message);
                    } else {
                        logsResponse.data.logs.forEach(function(log) {
                            $scope.logs.push(log);
                        });
                    }
                }, processHttpFailure);
            }
        };

        var stopWatch = $scope.$watchCollection('user', function(user) {
            if((user === undefined) || (user._id === undefined)) {
                return;
            }

            userId = user._id;
            stopWatch();

            rgiAuthLogsSrvc.getTotalNumber(userId).then(function (logsNumberResponse) {
                if(logsNumberResponse.data.error) {
                    rgiNotifier.error(logsNumberResponse.data.error.message);
                } else {
                    totalPages = Math.ceil(logsNumberResponse.data.number / ITEMS_PER_PAGE);
                    $scope.loadLogs();
                }
            }, processHttpFailure);
        });
    });
