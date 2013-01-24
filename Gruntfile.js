/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
        },
        jshint: {
            options: {
                es5: true, // Tolerate ES5 syntax
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {
                    __dirname: true,
                    process: true,
                    exports: true,
                    module: true,
                    console: true,
                    define: true,
                    require: true,
                    requirejs: true
                }
            },
            all: [
                'Gruntfile.js',
                'app/**/*.js',
                'web/scripts/**/*.js'
            ]
        },
        nodeunit: {
            all: [
                'app/test/**/*.js'
            ]
        },
        clean: {
            prod: [
                'build'
            ]
        },
        copy: {
            prod: {
                options: {
                    processContent: false,
                    processContentExclude: [
                    ]
                },
                files: [
                    {
                        src: 'package.json',
                        dest: 'build/<%= pkg.name %>/'
                    },
                    {
                        expand: true,
                        cwd: 'app',
                        src: '**',
                        dest: 'build/<%= pkg.name %>/app/'
                    }
                ]
            }
        },
        compress: {
            prod: {
                options: {
                    archive: 'build/<%= pkg.name %>-<%= pkg.version %>.zip',
                    mode: 'zip'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'build/<%= pkg.name %>/',
                        src: '**',
                        dest: '<%= pkg.name %>-<%= pkg.version %>'
                    }
                ]
            }
        }
    });

    // Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Load task-related files from the tasks directory, relative to the grunt.js gruntfile.
    grunt.loadTasks('tasks');

    // Development tasks
    grunt.registerTask('build:dev', 'Make development build', function() {
        grunt.task.run(['jshint', 'nodeunit']);
    });

    // Production tasks
    grunt.registerTask('build:prod', 'Make production build', function() {
        grunt.task.run(['jshint', 'nodeunit', 'clean:prod', 'copy:prod', 'compress:prod']);
    });

    // Default tasks
    grunt.registerTask('default', 'build:dev');
    grunt.registerTask('dev', 'build:dev');
    grunt.registerTask('prod', 'build:prod');

};
