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
            prod: {
                files: {
                    'build/<%= pkg.name%>-<%= pkg.version %>/site/': 'site/**', // variables in destination
                    'build/<%= pkg.name%>-<%= pkg.version %>/app/': 'app/**', // variables in destination
                }
            }
        },
        compress: {
            prod: {
                files: {
                    'build/<%= pkg.name%>-<%= pkg.version %>.tgz': 'build/<%= pkg.name%>-<%= pkg.version %>/**'
                }
            }
        },
        shell: {
            _options: {
                failOnError: true,
                stdout: true,
                stderr: true
            },
            runDev: {
                execOptions: {
                    env: {
                        'NODE_ENV' : 'development',
                        'PORT': 8000
                    }
                },
                command: 'cd app; supervisor app.js'
            },
            runProd: {
                execOptions: {
                    env: {
                        'NODE_ENV' : 'production',
                        'PORT': 8000
                    }
                },
                command: 'cd build/<%= pkg.name%>-<%= pkg.version %>/app; node app.js'
            }
        }
    });

    // Load NPM tasks
    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-shell');

    // Load task-related files from the tasks directory, relative to the grunt.js gruntfile.
    grunt.loadTasks('tasks');

    // Development tasks
    grunt.registerTask('build:dev', 'Make development build', function() {
        grunt.task.run('lint test');
    });
    grunt.registerTask('run:dev', 'Run a development build', function() {
        grunt.task.run('shell:runDev');
    });

    // Production tasks
    grunt.registerTask('build:prod', 'Make production build', function() {
        grunt.task.run('clean:prod lint test');
    });
    grunt.registerTask('run:prod', 'Run a production build', function() {
        grunt.task.run('shell:runProd');
    });

    // Default tasks
    grunt.registerTask('default', 'build:dev');
    grunt.registerTask('dev', 'build:dev');
    grunt.registerTask('prod', 'build:prod');

};
