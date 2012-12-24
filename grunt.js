/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: '<json:package.json>',
        meta: {
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
        },
        test: {
            files: ['app/test/**/*.js']
        },
        // Checks your JavaScript against JSHint
        lint: {
            files: ['grunt.js', 'app/**/*.js']
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
                browser: true
            },
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
        // Concatenates your project files together and puts the new file in a dist folder
        //concat: {
        //    dist: {
        //        src: ['<banner:meta.banner>'].concat('web/scripts/**/*.js'),
        //        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>-all.js'
        //    }
        //},
        // Minifies the file concat put out
        //min: {
        //    dist: {
        //        src: 'dist/<%= pkg.name %>-<%= pkg.version %>-all.js',
        //        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>-min.js'
        //    }
        //},
        watch: {
            files: '<config:lint.files>',
            tasks: 'default'
        },
        clean: {
            prod: [
                'build/.tmp',
                'build/*'
            ]
        },
        copy: {
            pkg: {
                files: {
                    'build/<%= pkg.name%>-<%= pkg.version %>/': 'package.json' // variables in destination
                }
            },
            app: {
                options: {
                    basePath: 'app'
                },
                files: {
                    'build/<%= pkg.name%>-<%= pkg.version %>/app/': 'app/**' // variables in destination
                }
            },
            site: {
                files: {
                    'build/<%= pkg.name%>-<%= pkg.version %>/site/': 'site/*/build/**', // variables in destination
                }
            }
        },
        compress: {
            app: {
                files: {
                    'build/<%= pkg.name%>-<%= pkg.version %>-app.tgz': 'build/<%= pkg.name%>-<%= pkg.version %>/app/**'
                }
            },
            site: {
                files: {
                    'build/<%= pkg.name%>-<%= pkg.version %>-site.tgz': 'build/<%= pkg.name%>-<%= pkg.version %>/site/**'
                }
            }
        }
    });

    // Load NPM tasks
    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Load task-related files from the tasks directory, relative to the grunt.js gruntfile.
    grunt.loadTasks('tasks');

    // Development tasks
    grunt.registerTask('build:dev', 'Make development build', function() {
        grunt.task.run('lint test');
    });

    // Production tasks
    grunt.registerTask('build:prod', 'Make production build', function() {
        grunt.task.run('clean:prod lint test copy:pkg copy:app copy:site'); // compress:app compress:site');
    });

    // Default tasks
    grunt.registerTask('default', 'build:dev');
    grunt.registerTask('dev', 'build:dev');
    grunt.registerTask('prod', 'build:prod');

};
