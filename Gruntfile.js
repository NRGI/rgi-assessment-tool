/*jslint node: true */
'use strict';
module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
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
                    'test/**/*.js'
                ]
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        watch: {
            jade: {
                files: ['public/app/**/*.jade'],
                tasks: ['jade'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // Default task(s).
    grunt.registerTask('default', ['uglify']);
};