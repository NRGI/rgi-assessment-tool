/*jslint node: true */
'use strict';

var testEnvironment = 'test';
var config = require('./server/config/config')[testEnvironment];

var fs = require('fs'),
    crypto = require('crypto');

var appFileList = [
    'public/app/app.js',
    'public/app/common/rgiLogger.js',
    'public/app/common/rgiNotifier.js',
    'public/app/common/rgiFilters.js',
    'public/app/common/rgiUtilsSrvc.js',
    'public/app/main/rgiMainCtrl.js',
    'public/app/main/rgiContactTechCtrl.js',
    'public/app/main/rgiResourcesCtrl.js',

    'public/app/services/rgiAnswerSrvc.js',
    'public/app/services/rgiAnswerRawSrvc.js',
    'public/app/services/rgiAssessmentSrvc.js',
    'public/app/services/rgiAuthSrvc.js',
    'public/app/services/rgiAuthLogsSrvc.js',
    'public/app/services/rgiContactTechSrvc.js',
    'public/app/services/rgiCountrySrvc.js',
    'public/app/services/rgiDocumentSrvc.js',
    'public/app/services/rgiIdentitySrvc.js',
    'public/app/services/rgiIntervieweeSrvc.js',
    'public/app/services/rgiIntervieweeAnswerSrvc.js',
    'public/app/services/rgiPreceptGuideSrvc.js',
    'public/app/services/rgiQuestionSrvc.js',
    'public/app/services/rgiQuestionRawSrvc.js',
    'public/app/services/rgiResetPasswordSrvc.js',
    'public/app/services/rgiResourcesSrvc.js',
    'public/app/services/rgiUserSrvc.js',

    'public/app/services/utils/rgiAllowedFileExtensionGuideSrvc.js',
    'public/app/services/utils/rgiAnswerFilterSrvc.js',
    'public/app/services/utils/rgiAssessmentStatisticsGuideSrvc.js',
    'public/app/services/utils/rgiFileUploaderSrvc.js',
    'public/app/services/utils/rgiHttpResponseProcessorSrvc.js',
    'public/app/services/utils/rgiQuestionSetSrvc.js',
    'public/app/services/utils/rgiReferenceListSrvc.js',
    'public/app/services/utils/rgiResourceProcessorSrvc.js',
    'public/app/services/utils/rgiSortableGuideSrvc.js',
    'public/app/services/utils/rgiUrlGuideSrvc.js',
    'public/app/services/utils/rgiUserAssessmentsSrvc.js',

    'public/app/services/methods/rgiAnswerMethodSrvc.js',
    'public/app/services/methods/rgiAssessmentMethodSrvc.js',
    'public/app/services/methods/rgiContactMethodSrvc.js',
    'public/app/services/methods/rgiDocumentMethodSrvc.js',
    'public/app/services/methods/rgiIntervieweeMethodSrvc.js',
    'public/app/services/methods/rgiQuestionMethodSrvc.js',
    'public/app/services/methods/rgiResourcesMethodSrvc.js',
    'public/app/services/methods/rgiUserMethodSrvc.js',

    'public/app/services/constants/_.js',
    'public/app/services/constants/rgiAvailableRolesSet.js',
    'public/app/services/constants/rgiFileSizeLimit.js',
    'public/app/services/constants/rgiMineralTagsSet.js',
    'public/app/services/constants/rgiPatternSet.js',

    'public/app/directives/directives/rgi-active-answer-buttons.js',
    'public/app/directives/directives/rgi-answer-form.js',
    'public/app/directives/directives/rgi-answer-nav.js',
    'public/app/directives/directives/rgi-assessment-detail-table.js',
    'public/app/directives/directives/rgi-assessments-list-table.js',
    'public/app/directives/directives/rgi-auth-logs.js',
    'public/app/directives/directives/rgi-references.js',
    'public/app/directives/directives/rgi-calendar.js',
    'public/app/directives/directives/rgi-comments.js',
    'public/app/directives/directives/rgi-document-table.js',
    'public/app/directives/directives/rgi-flag-tabs.js',
    'public/app/directives/directives/rgi-external-answer-tabs.js',
    'public/app/directives/directives/rgi-interviewee-table.js',
    'public/app/directives/directives/rgi-prev-answers.js',
    'public/app/directives/directives/rgi-question-table.js',
    'public/app/directives/directives/rgi-user-table.js',
    'public/app/directives/directives/rgi-draggable-dialog.js',
    'public/app/directives/directives/rgi-wysiwyg.js',

    'public/app/directives/controllers/rgiActiveAnswerButtonsCtrl.js',
    'public/app/directives/controllers/rgiAnswerNavCtrl.js',
    'public/app/directives/controllers/rgiAssessmentsListTableCtrl.js',
    'public/app/directives/controllers/rgiAssessmentDetailTableCtrl.js',
    'public/app/directives/controllers/rgiAuthLogsCtrl.js',
    'public/app/directives/controllers/rgiReferencesCtrl.js',
    'public/app/directives/controllers/rgiCalendarCtrl.js',
    'public/app/directives/controllers/rgiCommentsCtrl.js',
    'public/app/directives/controllers/rgiDocumentTableCtrl.js',
    'public/app/directives/controllers/rgiFlagTabsCtrl.js',
    'public/app/directives/controllers/rgiExternalAnswerTabsCtrl.js',
    'public/app/directives/controllers/rgiIntervieweeTableCtrl.js',
    'public/app/directives/controllers/rgiQuestionTableCtrl.js',
    'public/app/directives/controllers/rgiUserTableCtrl.js',
    'public/app/directives/controllers/rgiWysiwygCtrl.js',

    'public/app/account/rgiNavBarLoginCtrl.js',
    'public/app/account/rgiProfileCtrl.js',
    'public/app/account/rgiRecoverPasswordCtrl.js',
    'public/app/account/rgiResetPasswordCtrl.js',

    'public/app/admin/users/rgiUserCreateCtrl.js',
    'public/app/admin/users/rgiUserAdminCtrl.js',
    'public/app/admin/users/rgiUserAdminDetailCtrl.js',
    'public/app/admin/questions/rgiQuestionAdminCtrl.js',
    'public/app/admin/questions/rgiQuestionAdminDetailCtrl.js',
    'public/app/admin/questions/rgiQuestionRawListCtrl.js',
    'public/app/admin/questions/rgiReorderQuestionsAdminCtrl.js',
    'public/app/admin/documents/rgiDocumentAdminCtrl.js',
    'public/app/admin/documents/rgiDocumentAdminDetailCtrl.js',
    'public/app/admin/answers/rgiAnswerRawListCtrl.js',
    'public/app/admin/interviewees/rgiIntervieweeAdminCtrl.js',
    'public/app/admin/interviewees/rgiIntervieweeAdminDetailCtrl.js',
    'public/app/admin/resources/rgiResourcesAdminCtrl.js',

    'public/app/assessments/rgiAssessmentsListCtrl.js',
    'public/app/assessments/rgiAssessmentDetailCtrl.js',
    'public/app/answers/rgiAnswerCtrl.js',

    'public/app/dialogs/rgiDialogFactory.js',
    'public/app/dialogs/assessments/rgiAssessmentStatusDialogCtrl.js',
    'public/app/dialogs/assessments/rgiAssignAssessmentDialogCtrl.js',
    'public/app/dialogs/assessments/rgiAssignAssessmentMultipleAssigneeDialogCtrl.js',
    'public/app/dialogs/assessments/rgiDeleteAssessmentDialogCtrl.js',
    'public/app/dialogs/assessments/rgiMoveAssessmentDialogCtrl.js',
    'public/app/dialogs/assessments/rgiMoveAssessmentConfirmationDialogCtrl.js',
    'public/app/dialogs/assessments/rgiNewAssessmentDialogCtrl.js',
    'public/app/dialogs/assessments/rgiSubmitAssessmentConfirmationDialogCtrl.js',
    'public/app/dialogs/assessments/rgiResubmitAssessmentConfirmationDialogCtrl.js',
    'public/app/dialogs/answers/rgiEditAnswerJustificationDialogCtrl.js',
    'public/app/dialogs/answers/rgiFinalChoiceDialogCtrl.js',
    'public/app/dialogs/answers/rgiGuidanceDialogCtrl.js',
    'public/app/dialogs/comments/rgiEditCommentDialogCtrl.js',
    'public/app/dialogs/comments/rgiDeleteCommentDialogCtrl.js',
    'public/app/dialogs/documents/rgiDeleteDocumentDialogCtrl.js',
    'public/app/dialogs/flags/rgiFlagAnswerDialogCtrl.js',
    'public/app/dialogs/flags/rgiFlagEditDialogCtrl.js',
    'public/app/dialogs/interviewees/rgiDeleteIntervieweeDialogCtrl.js',
    'public/app/dialogs/questions/rgiNewQuestionDialogCtrl.js',
    'public/app/dialogs/questions/rgiDeleteQuestionDialogCtrl.js',
    'public/app/dialogs/references/rgiEditReferenceDialogCtrl.js',
    'public/app/dialogs/references/rgiEditDocumentDialogCtrl.js',
    'public/app/dialogs/references/rgiEditIntervieweeDialogCtrl.js',
    'public/app/dialogs/references/rgiNewRefDialogCtrl.js',
    'public/app/dialogs/references/rgiDeleteReferenceDialogCtrl.js',
    'public/app/dialogs/references/rgiNewDocumentDialogCtrl.js',
    'public/app/dialogs/references/rgiNewWebpageDialogCtrl.js',
    'public/app/dialogs/resources/rgiDeleteResourceDialogCtrl.js',
    'public/app/dialogs/resources/rgiNewResourceDialogCtrl.js',
    'public/app/dialogs/documents/rgiUnlinkDocumentDialogCtrl.js',
    'public/app/dialogs/users/rgiDeleteUserDialogCtrl.js',
    'public/app/dialogs/users/rgiEditUserDialogCtrl.js'
];

var vendorsFileList = [
    'public/vendor/cryptojslib/rollups/sha1.js',
    'public/vendor/jquery/dist/jquery.js',
    'public/vendor/jquery-ui/jquery-ui.min.js',
    'public/vendor/jquery-truncate-html/jquery.truncate.js',
    'public/vendor/angular/angular.js',
    'public/vendor/bootstrap/dist/js/bootstrap.js',
    'public/vendor/angucomplete/angucomplete.js',
    'public/vendor/angular-bootstrap/ui-bootstrap.js',
    'public/vendor/angular-bootstrap/ui-bootstrap-tpls.js',
    'public/vendor/angular-file-upload/angular-file-upload.js',
    'public/vendor/angular-filter/dist/angular-filter.js',
    'public/vendor/angular-loading-bar/build/loading-bar.js',
    'public/vendor/angular-resource/angular-resource.js',
    'public/vendor/angular-route/angular-route.js',
    'public/vendor/angular-sanitize/angular-sanitize.js',
    'public/vendor/angular-tablesort/js/angular-tablesort.js',
    'public/vendor/angular-ui-mask/dist/mask.min.js',

    'public/vendor/ng-csv/build/ng-csv.js',
    'public/vendor/ng-form-group/index.js',
    'public/vendor/ngDialog/js/ngDialog.js',
    'public/vendor/ngInfiniteScroll/build/ng-infinite-scroll.js',
    'public/vendor/ng-sortable/dist/ng-sortable.min.js',
    'public/vendor/ta-maxlength/ta-maxlength.js',
    'public/vendor/toastr/toastr.js',
    'public/vendor/textAngular/dist/textAngular-rangy.min.js',
    'public/vendor/textAngular/dist/textAngular-sanitize.min.js',
    'public/vendor/textAngular/dist/textAngular.min.js',
    'public/vendor/underscore/underscore.js',
    'public/vendor/angular-underscore/angular-underscore.min.js'
];

var vendorsBuildFilePath = 'public/assets/vendors.js';
var appBuildFilePath = 'public/assets/app.js';

var getSrcDestinationMapping = function(dest, files) {
    var mapping = {};
    mapping[dest] = files === undefined ? [dest] : files;
    return mapping;
};

module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {},
            vendors: {src: vendorsFileList, dest: vendorsBuildFilePath}
        },
        express: {
            options: {},
            test: {
                options: {
                    script: './server.js',
                    node_env: testEnvironment,
                    port: config.port
                }
            }
        },
        hash: {
            app: appBuildFilePath,
            vendors: vendorsBuildFilePath
        },
        jade: {
            compile: {
                options: {
                    client: false
                },
                files: [
                    {
                        cwd: "public/app",
                        src: "**/*.jade",
                        dest: "public/app",
                        expand: true,
                        ext: ".html"
                    },
                    {
                        cwd: "server",
                        src: "**/*.jade",
                        dest: "server",
                        expand: true,
                        ext: ".html"
                    }
                ]
            }
        },
        jshint: {
            all: {
                options: {
                    jshintrc: true,
                    reporter: require('jshint-stylish')
                },
                src: [
                    'Gruntfile.js',
                    'karma.conf.js',
                    'newrelic.js',
                    'server.js',
                    'public/app/**/*.js',
                    'server/**/*.js',
                    'tests/**/*.js'
                ]
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    require: 'server/models/Log.js'
                },
                src: ['tests/unit/server/**/*.spec.js']
            }
        },
        ngAnnotate: {
            options: {singleQuotes: true},
            vendors: {files: getSrcDestinationMapping(vendorsBuildFilePath)}
        },
        protractor_webdriver: {
            start: {
                options: {
                    path: '/home/alex/npm-global/bin/',
                    command: 'webdriver-manager start'
                }
            }
        },
        protractor: {
            options: {
                configFile: "protractor.conf.js", // Default config file
                keepAlive: true, // If false, the grunt process stops when the test fails.
                noColor: false, // If true, protractor will not use colors in its output.
                args: {
                    // Arguments passed to the command
                }
            },
            all: {}
        },
        shell: {
            clearDb: {
                command: 'node ./tests/e2e/clear-db.js'
            },
            loadFixtures: {
                command: 'node ./tests/e2e/load-fixtures.js'
            }
        },
        stylus: {
            compile: {
                options: {
                    compress: false
                },
                files: {
                    'public/css/site.css': 'public/css/site.styl'
                }
            }
        },
        uglify: {
            options: {report: 'min', mangle: false},
            app: {
                options: {sourceMap: true, sourceMapIncludeSources: true},
                files: getSrcDestinationMapping(appBuildFilePath, appFileList)
            },
            vendors: {
                files: getSrcDestinationMapping(vendorsBuildFilePath)
            }
        },
        watch: {
            jade: {
                files: ['public/app/**/*.jade'],
                tasks: ['jade'],
                options: {
                    spawn: false
                }
            },
            "js-app": {
                files: ['public/app/**/*.js'],
                tasks: ['uglify:app']
            },
            "js-vendors": {
                files: ['public/vendor/**/*.js'],
                tasks: ['build']
            },
            stylus: {
                files: ['public/css/*.styl'],
                tasks: ['stylus:compile'],
                options : {livereload: true}
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-karma');

    grunt.loadNpmTasks('grunt-ng-annotate');

    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-protractor-webdriver');

    grunt.loadNpmTasks('grunt-shell');
    // Default task(s).
    grunt.registerTask('default', ['uglify']);
    grunt.registerTask('build', ['concat', 'ngAnnotate', 'uglify']);
    grunt.registerTask('server', ['express', 'watch']);
    grunt.registerTask('test:e2e', ['protractor_webdriver', 'protractor']);
    grunt.registerTask('test:client', ['karma']);
    grunt.registerTask('test:server', ['mochaTest']);
    grunt.registerTask('test-server', ['shell']);

    grunt.registerMultiTask('hash', 'Rename the built JS files based on the file content', function() {
        var filePath = this.data;
        var done = this.async();
        var hash = crypto.createHash('sha1');
        var completed = {rename: false, linkChange: false};

        var setCompleted = function(field) {
            completed[field] = true;

            if(completed.rename && completed.linkChange) {
                done();
            }
        };

        fs.readFile(filePath, {encoding: 'utf8'}, function (err, fileContent) {
            if(err) {
                grunt.log.writeln('failed to read the file ' + filePath + '. The error is ' + err);
                done(false);
            } else {
                hash.update(fileContent);
                var newFileName = filePath.replace('.js', '-' + hash.digest('hex') + '.js');
                var scriptsFilePath = 'server/includes/scripts.jade';

                fs.readFile('server/includes/scripts.jade', {encoding: 'utf8'}, function (err, fileContent) {
                    if(err) {
                        grunt.log.writeln('failed to read the file `scripts.jade`. The error is ' + err);
                        done(false);
                    } else {
                        var updateContent = fileContent.replace(filePath.replace('public/', '/'),
                            newFileName.replace('public/', '/'));

                        fs.writeFile(scriptsFilePath, updateContent, function(err) {
                            if(err) {
                                grunt.log.writeln('failed to write the file `scripts.jade`. The error is ' + err);
                                done(false);
                            } else {
                                setCompleted('linkChange');
                            }
                        });
                    }

                });

                fs.rename(filePath, newFileName, function(err) {
                    if(err) {
                        grunt.log.writeln('unable to rename the file ' + filePath +' to ' + newFileName +
                            '. The error is ' + err);
                        done(false);
                    } else {
                        setCompleted('rename');
                    }
                });
            }
        });
    });


};