define(function() {

    'use strict';
    var levelClass = {
        debug: 0,
        info: 1000,
        warn: 2000,
        error: 3000
    };
    var notifications = {
        startInfo: {
            code: 1001,
            level: 'info',
            message: 'Request Start : $0 $1'
        },
        redirectInfo: {
            code: 1002,
            level: 'info',
            message: 'Redirection followed'
        },
        successInfo: {
            code: 1003,
            level: 'info',
            message: 'Request Success'
        },
        uploadSuccessInfo: {
            code: 1004,
            level: 'info',
            message: 'Upload Success'
        },

        commWarning: {
            code: 2001,
            level: 'warn',
            message: 'Communication error (status code $0). Retrying ($1/$2).'
        },
        authWarning: {
            code: 2002,
            level: 'warn',
            message: 'Authentication error (status code $0). Refreshing access token ($1/$2).'
        },

        reqError: {
            code: 3001,
            level: 'error',
            message: 'Request error (status code $0).'
        },
        commError: {
            code: 3002,
            level: 'error',
            message: 'Communication error (status code $0).  Maximun number of retries reached ($1).'
        },
        authError: {
            code: 3003,
            level: 'error',
            message: 'Authentication error (status code $0).  Maximun number of retries reached ($1).'
        },
        refreshNotConfigured: {
            code: 3004,
            level: 'error',
            message: 'Refresh token error. Refresh flow not configured.'
        },
        refreshError: {
            code: 3005,
            level: 'error',
            message: 'Refresh token error. Request failed (status code $0).'
        },
        tokenError: {
            code: 3006,
            level: 'error',
            message: 'Missing access token.'
        },
        parseError: {
            code: 3007,
            level: 'error',
            message: 'JSON Parsing error.'
        },
        uploadError: {
            code: 3008,
            level: 'error',
            message: 'Upload $0 ($1 %)'
        }
    };

    function createMessage(notificationId, notificationData, request, response) {
        var notification = $.extend({}, notifications[notificationId] || {});

        if (notificationData) {
            notification.message =  notification.message.replace(/\$(\d+)/g, function(m, key) {
                return '' + (notificationData[+key] !== undefined ? notificationData[+key] : '');
            });
        }
        if (request) {
            notification.request = request;
        }
        if (response) {
            notification.response = response;
        }
        return notification;
    }

    function createNotifier(logger, minLogLevel) {
        if (!logger || typeof logger !== 'function') {
            return false;
        }
        var minCode = levelClass[minLogLevel] || 0;

        return {
            notify: function notify(notificationId, notificationData, request, response) {
                var notification = createMessage(notificationId, notificationData, request, response);
                if(notification.code > minCode) {
                    logger(notification);
                }

            }
        };
    }

    return {
        createNotifier: createNotifier
        };
});
