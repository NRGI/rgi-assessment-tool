(function(root) {

    // Browser globals
    root.MendeleySDK = {};

    // Fake define maps dependencies to globals
    var define = function(deps, fun) {
        if (typeof deps !== 'function') {
            var args = [];
            deps.forEach(function(dep) {
                dep = dep.replace(/[^a-z\-]/g, '');
                dep = dep[0].toUpperCase() + dep.substring(1);
                args.push(root.MendeleySDK[dep]);
            });

            return fun.apply(this, args);
        }
        else {
            return deps();
        }
    }

    root.MendeleySDK.Notifier = define(function() {

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

    root.MendeleySDK.Auth = define(function() {

	'use strict';

    var defaults = {
		win: window,
        authenticateOnStart: true,
        apiAuthenticateUrl: 'https://api.mendeley.com/oauth/authorize',
        accessTokenCookieName: 'accessToken',
        scope: 'all'
    };

    var defaultsImplicitFlow = {
        clientId: false,
        redirectUrl: false
    };

    var defaultsAuthCodeFlow = {
        apiAuthenticateUrl: '/login',
        refreshAccessTokenUrl: false
    };

    var settings = {};

    return {
        implicitGrantFlow: implicitGrantFlow,
        authCodeFlow: authCodeFlow
    };

    function implicitGrantFlow(options) {

        settings = $.extend({}, defaults, defaultsImplicitFlow, options || {});

        if (!settings.clientId) {
            console.error('You must provide a clientId for implicit grant flow');
            return false;
        }

        // OAuth redirect url defaults to current url
        if (!settings.redirectUrl) {
            var loc = settings.win.location;
            settings.redirectUrl = loc.protocol + '//' + loc.host + loc.pathname;
        }

        settings.apiAuthenticateUrl = settings.apiAuthenticateUrl +
            '?client_id=' + settings.clientId +
            '&redirect_uri=' + settings.redirectUrl +
            '&scope=' + settings.scope +
            '&response_type=token';

        if (settings.authenticateOnStart && !getAccessTokenCookieOrUrl()) {
            authenticate();
        }

        return {
            authenticate: authenticate,
            getToken: getAccessTokenCookieOrUrl,
            refreshToken: noop()
        };
    }

    function authCodeFlow(options) {

        settings = $.extend({}, defaults, defaultsAuthCodeFlow, options || {});

        if (!settings.apiAuthenticateUrl) {
            console.error('You must provide an apiAuthenticateUrl for auth code flow');
            return false;
        }

        if (settings.authenticateOnStart && !getAccessTokenCookie()) {
            authenticate();
        }

        return {
            authenticate: authenticate,
            getToken: getAccessTokenCookie,
            refreshToken: refreshAccessTokenCookie
        };
    }

    function noop() {
        return function() { return false; };
    }

    function authenticate() {
        clearAccessTokenCookie();
        settings.win.location = settings.apiAuthenticateUrl;
    }

    function getAccessTokenCookieOrUrl() {
        var location = settings.win.location,
            hash = location.hash ? location.hash.split('=')[1] : '',
            cookie = getAccessTokenCookie();

        if (hash && !cookie) {
            setAccessTokenCookie(hash);
            return hash;
        }
        if (!hash && cookie) {
            return cookie;
        }
        if (hash && cookie) {
            if (hash !== cookie) {
                setAccessTokenCookie(hash);
                return hash;
            }
            return cookie;
        }

        return '';
    }

    function getAccessTokenCookie() {
        var name = settings.accessTokenCookieName + '=',
            ca = settings.win.document.cookie.split(';');

        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];

            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }

            if (c.indexOf(name) !== -1) {
                return c.substring(name.length, c.length);
            }
        }

        return '';
    }

    function setAccessTokenCookie(accessToken, expireHours) {
        var d = new Date();
        d.setTime(d.getTime() + ((expireHours || 1)*60*60*1000));
        var expires = 'expires=' + d.toUTCString();
        settings.win.document.cookie = settings.accessTokenCookieName + '=' + accessToken + '; ' + expires;
    }

    function clearAccessTokenCookie() {
        setAccessTokenCookie('', -1);
    }

    function refreshAccessTokenCookie() {
        if (settings.refreshAccessTokenUrl) {
            return $.get(settings.refreshAccessTokenUrl);
        }

        return false;
    }
});


    root.MendeleySDK.Request = define(function() {

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

    root.MendeleySDK.API = define(['./request'], function(Request) {

    'use strict';

    var apiBaseUrl = 'https://api.mendeley.com';
    var authFlow = false;
    var notifier = false;
    /**
     * API
     *
     * @namespace
     * @name api
     */
    return {
        setAuthFlow: setAuthFlow,
        setApiBaseUrl: setApiBaseUrl,
        setNotifier: setNotifier,
        profiles: profiles(),
        documents: documents(),
        folders: folders(),
        files: files(),
        metadata: metadata(),
        catalog: catalog(),
        trash: trash(),
        followers: followers(),
        groups: groups()
    };

    function setAuthFlow(auth) {
        authFlow = auth;
    }

    function setApiBaseUrl(url) {
        apiBaseUrl = url;
    }

    function setNotifier(newNotifier) {
        notifier = newNotifier;
    }
    /**
     * Profiles API
     *
     * @namespace
     * @name api.profiles
     */
    function profiles() {
        var dataHeaders = {
            'Content-Type': 'application/vnd.mendeley-profile-amendment.1+json'
        };

        return {

            /**
             * Retrieve the profile of the currently logged user
             *
             * @method
             * @memberof api.profiles
             * @returns {promise}
             */
            me: requestFun('GET', '/profiles/me'),

            /**
             * Update profiles
             *
             * @method
             * @memberof api.profiles
             * @param {object} data - The new profiles data
             * @returns {promise}
             */
            update: requestWithDataFun('PATCH', '/profiles/me', [], dataHeaders, true)

        };
    }

    /**
     * Documents API
     *
     * @namespace
     * @name api.documents
     */
    function documents() {
        var dataHeaders = {
            'Content-Type': 'application/vnd.mendeley-document.1+json'
        };

        var listDocuments = requestFun('GET', '/documents/');
        var listFolder = requestFun('GET', '/folders/{id}/documents', ['id']);
        return {

            /**
             * Create a new document
             *
             * @method
             * @memberof api.documents
             * @param {object} data - The document data
             * @returns {promise}
             */
            create: requestWithDataFun('POST', '/documents', false, dataHeaders, true),

            /**
             * Create a new document from a file
             *
             * @method
             * @memberof api.documents
             * @param {object} file - A file object
             * @returns {promise}
             */
            createFromFile: requestWithFileFun('POST', '/documents'),

            /**
             * Retrieve a document
             *
             * @method
             * @memberof api.documents
             * @param {string} id - A document UUID
             * @returns {promise}
             */
            retrieve: requestFun('GET', '/documents/{id}', ['id']),

            /**
             * Update document
             *
             * @method
             * @memberof api.documents
             * @param {object} data - The new document data
             * @returns {promise}
             */
            update: requestWithDataFun('PATCH', '/documents/{id}', ['id'], dataHeaders, true),

            /**
             * List documents
             *
             * @method
             * @memberof api.documents
             * @param {object} params - Query paramaters
             * @returns {promise}
             */
            list: function(params) {
                if(!params || typeof params.folderId === 'undefined') {
                    return listDocuments.call(this, params);
                } else {
                    var folderId = params.folderId,
                        callParams = {
                            limit: params.limit
                        };
                    delete params.folderId;
                    return listFolder.call(this, folderId, callParams);
                }
            },

            /**
             * Search documents
             *
             * @method
             * @memberof api.documents
             * @param {object} params - Search paramaters
             * @returns {promise}
             */
            search: requestFun('GET', '/search/documents'),

            /**
             * Move a document to the trash
             *
             * @method
             * @memberof api.documents
             * @param {object} id - A document UUID
             * @returns {promise}
             */
            trash: requestFun('POST', '/documents/{id}/trash', ['id'], dataHeaders),

            /**
             * The total number of documents - set after the first call to documents.list()
             *
             * @var
             * @memberof api.documents
             * @type {integer}
             */
            count: 0,

            /**
             * Get the next page of documents
             *
             * @method
             * @memberof api.documents
             * @returns {promise}
             */
            nextPage: requestPageFun('next'),

            /**
             * Get the previous page of documents
             *
             * @method
             * @memberof api.documents
             * @returns {promise}
             */
            previousPage: requestPageFun('previous'),

            /**
             * Get the last page of documents
             *
             * @method
             * @memberof api.documents
             * @returns {promise}
             */
            lastPage: requestPageFun('last'),

            /**
             * Get pagination links
             *
             * @method
             * @memberof api.documents
             * @returns {object}
             */
            paginationLinks: {
                last: false,
                next: false,
                previous: false
            },

            /**
             * Reset all pagination
             *
             * @method
             * @memberof api.documents
             */
            resetPagination: resetPaginationLinks
        };
    }

    /**
     * Folders API
     *
     * @namespace
     * @name api.folders
     */
    function folders() {
        var dataHeaders = {
            folder: { 'Content-Type': 'application/vnd.mendeley-folder.1+json' },
            'document': { 'Content-Type': 'application/vnd.mendeley-document.1+json' }
        };

        return {
            /**
             * Create a new folder
             *
             * @method
             * @memberof api.folders
             * @param {object} data - The folder data
             * @returns {promise}
             */
            create: requestWithDataFun('POST', '/folders', [], dataHeaders.folder, true),

            /**
             * Retrieve a folder
             *
             * @method
             * @memberof api.folders
             * @param {string} id - A folder UUID
             * @returns {promise}
             */
            retrieve: requestFun('GET', '/folders/{id}', ['id']),

            /**
             * Update a folder
             *
             * @method
             * @memberof api.folders
             * @param {object} data - The folder data
             * @returns {promise}
             */
            update: requestWithDataFun('PATCH', '/folders/{id}', ['id'], dataHeaders.folder, true),

            /**
             * Delete a folder
             *
             * @method
             * @memberof api.folders
             * @param {string} id - A folder UUID
             * @returns {promise}
             */
            delete: requestFun('DELETE', '/folders/{id}', ['id']),

            /**
             * Remove a document from a folder
             *
             * @method
             * @memberof api.folders
             * @param {string} id - A folder UUID
             * @param {string} documentId - A document UUID
             * @returns {promise}
             */
            removeDocument: requestFun('DELETE', '/folders/{id}/documents/{docId}', ['id', 'docId'], dataHeaders.folder),

            /**
             * Add a document to a folder
             *
             * @method
             * @memberof api.folders
             * @param {string} id - A folder UUID
             * @param {string} documentId - A document UUID
             * @returns {promise}
             */
            addDocument: requestWithDataFun('POST', '/folders/{id}/documents', ['id'], dataHeaders.document, false),

            /**
             * Get a list of folders
             *
             * @method
             * @memberof api.folders
             * @returns {promise}
             */
            list: requestFun('GET', '/folders/'),

            /**
             * The total number of folders - set after the first call to folders.list()
             *
             * @var
             * @memberof api.folders
             * @type {integer}
             */
            count: 0,

            /**
             * Get the next page of folders
             *
             * @method
             * @memberof api.folders
             * @returns {promise}
             */
            nextPage: requestPageFun('next'),

            /**
             * Get the previous page of folders
             *
             * @method
             * @memberof api.folders
             * @returns {promise}
             */
            previousPage: requestPageFun('previous'),

            /**
             * Get the last page of folders
             *
             * @method
             * @memberof api.folders
             * @returns {promise}
             */
            lastPage: requestPageFun('last'),

            /**
             * Get pagination links
             *
             * @method
             * @memberof api.folders
             * @returns {object}
             */
            paginationLinks: {
                last: false,
                next: false,
                previous: false
            },

            /**
             * Reset all pagination links
             *
             * @method
             * @memberof api.folders
             */
            resetPagination: resetPaginationLinks
        };
    }

    /**
     * Files API
     *
     * @namespace
     * @name api.files
     */
    function files() {

        return {
            /**
             * Create a new file
             *
             * @method
             * @memberof api.files
             * @param {object} file - A file object
             * @param {string} documentId - A document UUID
             * @returns {promise}
             */
            create: requestWithFileFun('POST', '/files'),

            /**
             * Get a list of files for a document
             *
             * @method
             * @memberof api.files
             * @param {string} id - A document UUID
             * @returns {promise}
             */
            list: requestFun('GET', '/files?document_id={id}', ['id']),

            /**
             * Delete a file
             *
             * @method
             * @memberof api.files
             * @param {string} id - A file UUID
             * @returns {promise}
             */
            remove: requestFun('DELETE', '/files/{id}', ['id'])
        };
    }

    /**
     * Metadata API
     *
     * @namespace
     * @name api.metadata
     */
    function metadata() {
        return {
            /**
             * Retrieve a document metadata
             *
             * @method
             * @memberof api.metadata
             * @param {object} params - A metadata search filter
             * @returns {promise}
             */
            retrieve: requestFun('GET', '/metadata')
        };
    }

    /**
     * Catalog API
     *
     * @namespace
     * @name api.catalog
     */
    function catalog() {
        return {
            /**
             * Search the catalog
             *
             * @method
             * @memberof api.catalog
             * @param {object} params - A catalogue search filter
             * @returns {promise}
             */
            search: requestFun('GET', '/catalog'),

            /**
             * Retrieve a document data from catalog
             *
             * @method
             * @memberof api.catalog
             * @param {string} id - A catalog UUID
             * @param {object} params - A catalog search filter
             * @returns {promise}
             */
            retrieve: requestFun('GET', '/catalog/{id}', ['id'])
        };
    }

    /**
     * Trash API
     *
     * @namespace
     * @name api.trash
     */
    function trash() {
        return {
            /**
             * Retrieve a document from the trash
             *
             * @method
             * @memberof api.trash
             * @param {string} id - A document UUID
             * @returns {promise}
             */
            retrieve: requestFun('GET', '/trash/{id}', ['id']),

            /**
             * List all documents in the trash
             *
             * @method
             * @memberof api.trash
             * @returns {promise}
             */
            list: requestFun('GET', '/trash/'),

            /**
             * Restore a trashed document
             *
             * @method
             * @memberof api.trash
             * @param {string} id - A document UUID
             * @returns {promise}
             */
            restore: requestFun('POST', '/trash/{id}/restore', ['id']),

            /**
             * Permanently delete a trashed document
             *
             * @method
             * @memberof api.trash
             * @param {string} id - A document UUID
             * @returns {promise}
             */
            destroy: requestFun('DELETE', '/trash/{id}', ['id']),

            /**
             * The total number of trashed documents - set after the first call to trash.list()
             *
             * @var
             * @memberof api.trash
             * @type {integer}
             */
            count: 0,

            /**
             * Get the next page of trash
             *
             * @method
             * @memberof api.trash
             * @returns {promise}
             */
            nextPage: requestPageFun('next'),

            /**
             * Get the previous page of trash
             *
             * @method
             * @memberof api.trash
             * @returns {promise}
             */
            previousPage: requestPageFun('previous'),

            /**
             * Get the last page of trash
             *
             * @method
             * @memberof api.trash
             * @returns {promise}
             */
            lastPage: requestPageFun('last'),


            /**
             * Get pagination links
             *
             * @method
             * @memberof api.trash
             * @returns {object}
             */
            paginationLinks: {
                last: false,
                next: false,
                previous: false
            },

            /**
             * Reset all pagination links
             *
             * @method
             * @memberof api.trash
             */
            resetPagination: resetPaginationLinks
        };
    }

    /**
     * Follwers API
     *
     * @namespace
     * @name api.followers
     */
    function followers() {
        var dataHeaders = {
            'Content-Type': 'application/vnd.mendeley-follow-request.1+json'
        };

        return {
            /**
             * Get a list of followers.
             *
             * @method
             * @memberof api.followers
             * @param {object} params - {
             *  follower: <profile_id>,
             *  followed: <profile_id>,
             *  status: <"following" or "pending">,
             *  limit: <int>
             * }
             * @returns {promise}
             */
            list: requestFun('GET', '/followers'),

            /**
             * Create a follower relationship.
             *
             * The follower id is inferred from whoever is logged in. The response
             * is a relationship that includes the status which might be "following" or
             * "pending" depending on the privacy settings of the profile being
             * followed.
             *
             * @method
             * @memberof api.followers
             * @param {object} data - { followed: <profile id> }
             * @returns {promise}
             */
            create: requestWithDataFun('POST', '/followers', false, dataHeaders, false),

            /**
             * Delete a follower relationship.
             *
             * This requires a relationship id which can be retrieved via the list() method.
             *
             * @param {string} id - The relationship id
             * @memberof api.followers
             * @returns {promise}
             */
            remove: requestFun('DELETE', '/followers/{id}', ['id'])
        };
    }

    /**
     * Groups API
     *
     * @namespace
     * @name api.groups
     */
    function groups() {

        return {
            /**
             * Retrieve a group
             *
             * @method
             * @memberof api.groups
             * @param {string} id - A group UUID
             * @returns {promise}
             */
            retrieve: requestFun('GET', '/groups/{id}', ['id']),

            /**
             * Get a list of groups
             *
             * @method
             * @memberof api.groups
             * @returns {promise}
             */
            list: requestFun('GET', '/groups/'),

            /**
             * The total number of groups - set after the first call to groups.list()
             *
             * @var
             * @memberof api.groups
             * @type {integer}
             */
            count: 0,

            /**
             * Get the next page of groups
             *
             * @method
             * @memberof api.groups
             * @returns {promise}
             */
            nextPage: requestPageFun('next'),

            /**
             * Get the previous page of groups
             *
             * @method
             * @memberof api.groups
             * @returns {promise}
             */
            previousPage: requestPageFun('previous'),

            /**
             * Get the last page of groups
             *
             * @method
             * @memberof api.groups
             * @returns {promise}
             */
            lastPage: requestPageFun('last'),

            /**
             * Get pagination links
             *
             * @method
             * @memberof api.groups
             * @returns {object}
             */
            paginationLinks: {
                last: false,
                next: false,
                previous: false
            },

            /**
             * Reset all pagination links
             *
             * @method
             * @memberof api.groups
             */
            resetPagination: resetPaginationLinks
        };
    }

    /**
     * Set the current pagination links for a given API by extracting
     * looking at the headers retruend with the response.
     *
     * @private
     * @param {object} headers
     */
    function setPaginationLinks(headers) {
        if (headers.hasOwnProperty('Mendeley-Count')) {
            this.count = parseInt(headers['Mendeley-Count'], 10);
        }

        if (!headers.hasOwnProperty('Link') || typeof headers.Link !== 'object') {
            return ;
        }

        for (var p in this.paginationLinks) {
            this.paginationLinks[p] = headers.Link.hasOwnProperty(p) ? headers.Link[p] : false;
        }
    }

    /**
     * Reset the pagination links
     *
     * @private
     */
    function resetPaginationLinks() {
        this.paginationLinks = {
            last: false,
            next: false,
            previous: false
        };
        this.count = 0;
    }

    /**
     * A general purpose request functions
     *
     * @private
     * @param {string} method
     * @param {string} uriTemplate
     * @param {array} uriVars
     * @param {array} headers
     * @returns {function}
     */
    function requestFun(method, uriTemplate, uriVars, headers) {

        uriVars = uriVars || [];

        return function() {
            var args = Array.prototype.slice.call(arguments, 0);
            var url = getUrl(uriTemplate, uriVars, args);
            var data = args[uriVars.length];
            var request = {
                type: method,
                dataType: 'json',
                url: url,
                headers: getRequestHeaders(headers),
                data: data
            };
            var settings = {
                authFlow: authFlow
            };

            if (method === 'GET') {
                settings.maxRetries = 1;
            }

            var promise = Request.create(request, settings, notifier).send();
            promise.done(function(response, headers) {
                setPaginationLinks.call(this, headers);
            }.bind(this));

            return promise;
        };
    }

    /**
     * Get a function for getting a pagination rel
     *
     * @private
     * @param {string} rel - One of "next", "prev" or "last"
     * @returns {function}
     */
    function requestPageFun(rel) {

        return function() {
            if (!this.paginationLinks[rel]) {
                return new $.Deferred().reject();
            }

            var request = {
                type: 'GET',
                dataType: 'json',
                url: this.paginationLinks[rel],
                headers: getRequestHeaders({})
            };

            var settings = {
                authFlow: authFlow,
                maxRetries: 1
            };

            var promise = Request.create(request, settings, notifier).send();
            promise.done(function(response, headers) {
                setPaginationLinks.call(this, headers);
            }.bind(this));

            return promise;
        };
    }

    /**
     * Get a request function that sends data i.e. for POST, PUT, PATCH
     * The data will be taken from the calling argument after any uriVar arguments.
     *
     * @private
     * @param {string} method - The HTTP method
     * @param {string} uriTemplate - A URI template e.g. /documents/{id}
     * @param {array} uriVars - The variables for the URI template in the order
     * they will be passed to the function e.g. ['id']
     * @param {object} headers - Any additional headers to send
     *  e.g. { 'Content-Type': 'application/vnd.mendeley-documents+1.json'}
     * @param {bool} followLocation - follow the returned location header? Default is false
     * @returns {function}
     */
    function requestWithDataFun(method, uriTemplate, uriVars, headers, followLocation) {
        uriVars = uriVars || [];

        return function() {
            var args = Array.prototype.slice.call(arguments, 0);
            var url = getUrl(uriTemplate, uriVars, args);
            var data = args[uriVars.length];
            var request = {
                type: method,
                url: url,
                headers: getRequestHeaders(headers, data),
                data: JSON.stringify(data),
                processData: false
            };

            var settings = {
                authFlow: authFlow,
                followLocation: followLocation
            };

            return Request.create(request, settings, notifier).send();
        };
    }

    /**
     * Get a request function that sends a file
     *
     * @private
     * @param {string} method
     * @param {string} uriTemplate
     * @returns {function}
     */
    function requestWithFileFun(method, uriTemplate) {

        return function() {

            var args = Array.prototype.slice.call(arguments, 0);
            var url = getUrl(uriTemplate, [], args);
            var file = args[0];
            var documentId = args[1];
            var request = {
                type: method,
                url: url,
                headers: getRequestHeaders(uploadHeaders(file, documentId), method),
                data: file,
                processData: false
            };

            var settings = {
                authFlow: authFlow,
                fileUpload: true
            };

            return Request.create(request, settings, notifier).send();
        };
    }

    /**
     * Provide the correct encoding for UTF-8 Content-Disposition header value.
     * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
     *
     * @private
     * @param {string} str
     * @returns {string}
     */
    function encodeRFC5987ValueChars(str) {
        return encodeURIComponent(str).
            replace(/'/g, '%27').
            replace(/\(/g, '%28').
            replace(/\)/g, '%29').
            replace(/\*/g, '%2A');
    }

    /**
     * Get headers for an upload
     *
     * @private
     * @param {object} file
     * @param {string} documentId
     * @returns {string}
     */
    function uploadHeaders(file, documentId) {
        var headers = {
            'Content-Type': !!file.type ? file.type : 'application/octet-stream',
            'Content-Disposition': 'attachment; filename*=UTF-8\'\'' + encodeRFC5987ValueChars(file.name)
        };
        if(documentId) {
            headers.Link = '<' + apiBaseUrl + '/documents/' + documentId +'>; rel="document"';
        }

        return headers;
    }

    /**
     * Generate a URL from a template with properties and values
     *
     * @private
     * @param {string} uriTemplate
     * @param {array} uriProps
     * @param {array} uriValues
     * @returns {string}
     */
    function getUrl(uriTemplate, uriProps, uriValues) {
        if (!uriProps.length) {
            return apiBaseUrl + uriTemplate;
        }
        var uriParams = {};
        uriProps.forEach(function(prop, i) {
            uriParams[prop] = uriValues[i];
        });

        return apiBaseUrl + expandUriTemplate(uriTemplate, uriParams);
    }

    /**
     * Get the headers for a request
     *
     * @private
     * @param {array} headers
     * @param {array} data
     * @returns {array}
     */
    function getRequestHeaders(headers, data) {
        for (var headerName in headers) {
            var val = headers[headerName];
            if (typeof val === 'function') {
                headers[headerName] = val(data);
            }
        }

        return headers;
    }

    /**
     * Populate a URI template with data
     *
     * @private
     * @param {string} template
     * @param {object} data
     * @returns {string}
     */
    function expandUriTemplate(template, data) {
        var matches = template.match(/\{[a-z]+\}/gi);
        matches.forEach(function(match) {
            var prop = match.replace(/[\{\}]/g, '');
            if (!data.hasOwnProperty(prop)) {
                throw new Error('Endpoint requires ' + prop);
            }
            template = template.replace(match, data[prop]);
        });

        return template;
    }
});


})(this);
