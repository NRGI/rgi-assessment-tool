define(function() {

    'use strict';

    var defaults = {
        authFlow: false,
        maxRetries: 0,
        maxAuthRetries: 1,
        followLocation: false,
        fileUpload: false,
        extractHeaders: ['Mendeley-Count', 'Link']
    };
    var noopNotifier = { notify: function() {}};

    function create(request, settings, notifier) {
        return new Request(request, $.extend({}, defaults, settings), notifier);
    }

    function Request(request, settings, notifier) {
        if (!settings.authFlow) {
            throw new Error('Please provide an authentication interface');
        }
        this.request = request;
        this.settings = settings;
        this.retries = 0;
        this.authRetries = 0;
        this.notifier = notifier || noopNotifier;

        this.notifier.notify('startInfo', [this.request.type, this.request.url], this.request);
    }

    function send(dfd, request) {

        dfd = dfd || $.Deferred();
        request = request || this.request;
        request.headers = request.headers || {};
        var token = this.settings.authFlow.getToken();
        // If no token at all (maybe cookie deleted) then authenticate
        // because if you send 'Bearer ' you get a 400 rather than a 401 - is that a bug in the api?
        if (!token) {
            this.notifier.notify('tokenError', null, this.request);
            dfd.reject(this.request);
            this.settings.authFlow.authenticate(200);
            return dfd.promise();
        }
        request.headers.Authorization = 'Bearer ' + token;

        if (this.settings.fileUpload) {
            // Undocumented way to access XHR so we can add upload progress listeners
            var xhr = $.ajaxSettings.xhr();
            request.xhr = function() { return xhr; };

            // The response may have JSON Content-Type which makes jQuery invoke JSON.parse
            // on the reponse, but there isn't one so there's an error which causes the deferred
            // to be rejected. Specifying a dataType of 'text' prevents this.
            request.dataType = 'text';

            // Decorate the xhr with upload progress events
            ['loadstart', 'loadend', 'load', 'progress', 'abort', 'error', 'timeout']
                .forEach(function(uploadEvent) {
                    xhr.upload.addEventListener(uploadEvent, uploadProgressFun(dfd, request, xhr));
                });
        }

        $.ajax(request)
            .fail(onFail.bind(this, dfd))
            .done(onDone.bind(this, dfd));

        return dfd.promise();
    }

    function onFail(dfd, xhr) {
        switch (xhr.status) {
            case 0:
            case 504:
                // 504 Gateway timeout or communication error
                if (this.retries < this.settings.maxRetries) {
                    this.retries++;
                    this.notifier.notify('commWarning', [xhr.status, this.retries, this.settings.maxRetries], this.request, xhr);
                    this.send(dfd);
                } else {
                    this.notifier.notify('commError', [xhr.status, this.settings.maxRetries], this.request, xhr);
                    dfd.reject(this.request, xhr);
                }
                break;

            case 401:
                // 401 Unauthorized
                if (this.authRetries < this.settings.maxAuthRetries) {
                    this.authRetries++;
                    this.notifier.notify('authWarning', [xhr.status, this.authRetries, this.settings.maxAuthRetries], this.request, xhr);
                    refreshToken.call(this, dfd, xhr);
                } else {
                    this.notifier.notify('authError', [xhr.status, this.settings.maxAuthRetries], this.request, xhr);
                    dfd.reject(this.request, xhr);
                    this.settings.authFlow.authenticate(200);
                }
                break;

            default:
                this.notifier.notify('reqError', [xhr.status], this.request, xhr);
                dfd.reject(this.request, xhr);
        }
    }

    function onDone(dfd, response, success, xhr) {

        var locationHeader = getResponseHeader(xhr, 'Location'),
            headers;

        if (locationHeader && this.settings.followLocation && xhr.status === 201) {
            var redirect = {
                type: 'GET',
                url: locationHeader,
                dataType: 'json'
            };
            this.notifier.notify('redirectInfo', null, this.request, redirect);
            this.send(dfd, redirect);
        } else {
            if (this.settings.extractHeaders) {
                headers = extractHeaders.call(this, xhr);
            }

            // File uploads have type set to test, so if there is some JSON parse it manually
            if (this.settings.fileUpload) {
                try {
                    response = JSON.parse(response);
                    this.notifier.notify('uploadSuccessInfo', null, this.request, response);
                    dfd.resolve(response, xhr);
                } catch (error) {
                    this.notifier.notify('parseError', null, this.request, xhr);
                    dfd.reject(error);
                }
            } else {
                this.notifier.notify('successInfo', null, this.request, response);
                dfd.resolve(response, headers);
            }
        }
    }

    function refreshToken(dfd, xhr) {
        var refresh = this.settings.authFlow.refreshToken();
        if (refresh) {
            $.when(refresh)
                // If OK update the access token and re-send the request
                .done(function() {
                    this.send(dfd);
                }.bind(this))
                // If fails then we need to re-authenticate
                .fail(function(refreshxhr) {
                    this.notifier.notify('refreshError', [refreshxhr.status], this.request, refreshxhr);
                    dfd.reject(this.request, xhr);
                    this.settings.authFlow.authenticate(200);
                }.bind(this));
        } else {
            this.notifier.notify('refreshNotConfigured', []);
            dfd.reject(this.request, xhr);
            this.settings.authFlow.authenticate(200);
        }
    }

    /**
     * Get a function to monitor upload progress and emit notify events
     * on a deferred.
     *
     * @private
     * @param {object} dfd - Deferred
     * @param {object} request - The original request
     * @param {object} xhr The original XHR
     */
    function uploadProgressFun(dfd, request, xhr) {
        var progressPercent;
        var bytesTotal;
        var bytesSent;

        return function(progressEvent) {
            var eventType = progressEvent.type;

            if (progressEvent.lengthComputable) {
                bytesSent = progressEvent.loaded || progressEvent.position; // position is deprecated
                bytesTotal = progressEvent.total;
                progressPercent = Math.round(100 * bytesSent / bytesTotal);
                dfd.notify(progressEvent, progressPercent, bytesSent, bytesTotal);
            }
            if (eventType === 'abort' || eventType === 'timeout' || eventType === 'error') {
                this.notifier.notify('uploadError', [eventType, progressPercent], request, xhr);
                dfd.reject(request, xhr, { event: progressEvent, percent: progressPercent });
            }
        };
    }

    function getResponseHeader(xhr, name) {
        if (!xhr || !xhr.getResponseHeader) {
            return '';
        }

        return xhr.getResponseHeader(name);
    }

    function getAllResponseHeaders(xhr) {
        if (!xhr || !xhr.getAllResponseHeaders) {
            return '';
        }

        return xhr.getAllResponseHeaders();
    }

    function extractHeaders(xhr) {
        var headers = {}, headerValue;

        this.settings.extractHeaders.forEach(function(headerName) {
            headerValue = headerName === 'Link' ?
                extractLinkHeaders.call(this, xhr) : getResponseHeader(xhr, headerName);

            if (headerValue) {
                headers[headerName] = headerValue;
            }
        });

        return headers;
    }

    function extractLinkHeaders(xhr) {

        // Safe way to get multiple headers of same type in IE
        var headerName = 'Link';
        var links = getAllResponseHeaders(xhr).split('\n')
            .filter(function(row) {
                return row.match(new RegExp('^' + headerName + ':.*'));
            })
            .map(function(row) {
                return row.trim().substr(headerName.length + 1);
            })
            .join(',');

        if (!links) {
            return false;
        }
        // Tidy into nice object like {next: 'http://example.com/?p=1'}
        var tokens, url, rel, linksArray = links.split(','), value = {};
        for (var i = 0, l = linksArray.length; i < l; i++) {
            tokens = linksArray[i].split(';');
            url = tokens[0].replace(/[<>]/g, '').trim();
            rel = tokens[1].trim().split('=')[1].replace(/"/g, '');
            value[rel] = url;
        }

        return value;
    }

    Request.prototype = {
        send: send
    };

    return { create: create };

});
