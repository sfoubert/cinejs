'use strict';

module.exports = function(grunt) {
    // Load all npm grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.loadNpmTasks('grunt-bowercopy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-open');

    grunt.initConfig({
        bowercopy: {
            options: {
                srcPrefix: 'bower_components',
                runBower: true
            },
            scripts: {
                options: {
                    destPrefix: 'public/javascripts'
                },
                files: {
                    'jquery.min.js': 'jquery/dist/jquery.min.js',
                    'angular.min.js': 'angular/angular.min.js',
                    'angular-animate.min.js': 'angular-animate/angular-animate.min.js',
                    'angular-route.min.js': 'angular-route/angular-route.min.js',
                    '../bootstrap': 'bootstrap/dist',
                    'modernizr.js': 'modernizr/modernizr.js',
                    'bootstrap-slider.min.js': 'seiyria-bootstrap-slider/dist/bootstrap-slider.min.js',
                    '../bootstrap/css/bootstrap-slider.min.css': 'seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css',
                    'typeahead.js': 'typeahead.js/dist'
                    
                }
            }
        },
        jshint: {
            options: {
                undef: false,
                unused: false,
                asi: true,
                eqnull: true,
                node: true
            },
            all: ['app.js', 
            'Gruntfile.js', 
            'routes/*.js'
            ]
        },
        watch: {
            all: {
                files: ['views/*.jade',
                 'public/**'
                 ],
                options: {
                    livereload: 9090
                }
            },
            js: {
                files: ['<%= jshint.all %>'],
                tasks: ['jshint:all'],
                options: {
                    livereload: 9090
                }
            }
        },
        open: {
            all: {
                path: 'http://localhost:3000'
            }
        }

    });

    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });

    grunt.registerTask('bcopy', ['bowercopy']);
    grunt.registerTask('livereload', ['open', 'watch']);
}
