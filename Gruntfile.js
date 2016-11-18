#!/usr/bin/env node


/*!
 * MeltXpert®
 * Improved Nucleic Acid homo & hetero duplexes thermal behavior analysis program.
 * ________________________________________________________________________________
 *
 * Grunt, http://gruntjs.com/.
 * The JavaScript Task Runner.
 * ________________________________________________________________________________
 *
 * Architecture and Code Handcrafted by Prabhat Kumar.
 * Architectuur en Code handgemaakt door Prabhat Kumar.
 * @author    : Prabhat Kumar [http://prabhatkumar.org/].
 * @copyright : Prabhat Kumar [http://prabhatkumar.org/].
 * @copyright : Sequømics Research [http://research.sequomics.com/].
 * @copyright : Sequømics Corporation [http://sequomics.com/].
 * ________________________________________________________________________________
 *
 * @date      : 11-Nov-2016
 * @license   : Apache, version 2.0
 * @require   : Node.js®
 * @require   : NPM
 * @require   : grunt-cli
 * @build     : SEED™ — Umeå
 *              └────── A Sequømics Product — http://sequomics.com/.
 * ________________________________________________________________________________
 *
 * --/The Heart of Build System/-- of "MeltXpert®".
 * ________________________________________________________________________________
 */

// "disallowMultipleSpaces": {"allowEOLComments": true}
// "disallowSemicolons": false
// "requireSemicolons": true
// "requireSpaceAfterLineComment": { "allExcept": ["#", "="] }

// global __dirname: true
// global require: true

//# Usage: $ node -v
//# Usage: $ npm -v
//# Usage: $ grunt -version

// Invoking strict mode.
// @purpose: Strict mode applies to entire scripts or to individual functions.
"use strict";

// To load required Node module.
//=-----------------------------
var fs          = require('fs');
var os          = require('os');
var path        = require('path');

// To load required NPM modules.
//=-----------------------------
var chalk       = require('chalk');
// Check if our code is running on Travis.
var isTravis    = require('is-travis');

// Global variables.
//=~~~~~~~~~~~~~~~~~
var rootPath    = './';
var appsPath    = './app/';
var docsPath    = './docs/';
var libsPath    = './libs/';
// A destination directory.
var buildPath   = './build/';

// Default color defined.
//=----------------------
var noop        = chalk.red;
var yeep        = chalk.green;
var okay        = chalk.blue;
var boop        = chalk.gray;

var message     = "SEED™ — Supported under Mac OS X and Linux only!";
// To use inside grunt task.
var pkg         = require('./package.json');
var bkg         = require('./bower.json');
var version     = process.env.VERSION || require('./package.json').version;

// ----------------------------------------------------------------------------------------------------------
var banner      =
    '/*!\n' +
    ' * ———————————\n' +
    ' * MeltXpert®: v' + version + '\n' +
    ' * ———————————\n' +
    ' * Improved Nucleic Acid homo & hetero duplexes thermal behavior analysis program.\n' +
    ' * Copyright © 2006 - ' + new Date().getFullYear() + ', Prabhat Kumar, All rights reserved.\n' +
    ' * Copyright © 2014 - ' + new Date().getFullYear() + ', Sequømics Corporation, All rights reserved.\n' +
    ' * Released under the Apache License (http://www.apache.org/licenses/).\n' +
    ' */';
// ----------------------------------------------------------------------------------------------------------
// All Grunt Operations Defined... |--------------------------------------------| 11/Nov/2016 | SEED™ — Umeå.
// ----------------------------------------------------------------------------------------------------------

module.exports = function(grunt) {
    
    // Force use of Unix newlines.
    grunt.util.linefeed = '\n';
    
    // A regular expression.
    RegExp.quote = function(string) {
        return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    };
    
    // Date objects.
    var today    = new Date();
    var timems   = Date.now();
    
    // Advanced Grunt API.
    /// -->> A mode defaults to `0777`.
    var mode     = '0777';
    /// -->> A file globbing pattern.
    var pattern  = '**/*.js';
    // Exclude: remove from consideration.
    // grunt.file.expand([options, ] patterns)
    var excludes  = grunt.file.expand([
        '!/libs/assembly/assembly.js',
        '!/libs/assembly/convert.js'
    ]);
    // Includes: make part of a whole or set.
    // grunt.file.expand([options, ] patterns)
    var includes = grunt.file.expand([
        __dirname + '/core/source/script/' + pattern,
        __dirname + '/core/source/engine/' + pattern
    ]);
    // To write process log(s).
    var contents = null;
    
    // To generate data of nucleic acid(s).
    // ./pub/data/raw/ ——> ./pub/data/gold/
    var generateData = require('./pub/data/datagenerator.js');
    // A configuration bridge.
    var configBridge = grunt.file.readJSON('./grunt/configBridge.json', {
        encoding: 'utf8'
    });
    
    // A configuration bridge function.
    Object.keys(configBridge.paths).forEach(function(key) {
        configBridge.paths[key].forEach(function(val, i, arr) {
            arr[i] = path.join('./docs/', val);
        });
    });
    
    // 1. time-grunt
    // Display the elapsed execution time of grunt tasks.
    require('time-grunt')(grunt);
    
    // 2. load-grunt-tasks
    // Load multiple grunt tasks using globbing patterns.
    require('load-grunt-tasks')(grunt, {
        scope: ['devDependencies', 'dependencies']
    });
    
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Project configuration for -//MeltXpert®//- |-----------------------------| 11/Nov/2016 | SEED™ — Umeå.
    //                  Copyright © 2014 - 2016, Sequømics Corporation, All rights reserved.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    
    // Grunt project configuration.
    grunt.initConfig({
        
        /* reading 'package.json' for sync package(s) updates, mainly. */
        //= manipulation in build.py
        pkg: grunt.file.readJSON('package.json'),
        
        /* Do not store credentials in the git repo, store them separately and read from a secret file. */
        secret: grunt.file.readJSON('secret.json'),
        
        /* To loads the AWS credentials from a JSON file (DO NOT forget to exclude it from the commits). */
        aws: grunt.file.readJSON('aws.json'),
        
        /* To get banner information. */
        banner: banner,
        
        // ———————————————————————————————————————————————————————————————————————————|
        // Primary Task(s) for SEED™ — Umeå — Building System ||                      |
        // -----------------------------------------------------                      |
        // 1. Asset(s) Preparation                                                    |
        // 2. Build Asset(s) Verification                                             |
        // -‡-----------------------------------------------------------------------‡-|
        // 3. Assembly of Documentation + Application                                 |
        // 4. Build of Sass using Compass and Lint                                    |
        // 5. Linting + Minification (HTML + CSS + JavaScript)                        |
        // 6. Concatenation (CSS + JavaScript)                                        |
        // 7. Data Build + Lint                                                       |
        // 8. Cleaning of temporary files or directories                              |
        // 9. Localhost Server + Watch                                                |
        // -‡-----------------------------------------------------------------------‡-|
        // -> How to: https://github.com/MeltXpert/MeltXpert/blob/master/BUILDING.md  |
        // ———————————————————————————————————————————————————————————————————————————|
        // Task configuration.
        // -----------------------
        // 1. Asset(s) Preparation
        // -----------------------
        // Bower Components Installation
        'bower-install-simple': {
            options: {
                color: true,
                command: 'update',
                interactive: true,
                forceLatest: false,
                directory: __dirname + '/docs/source/libs/' // library i.e, downloaded by Bower.
            },
            'prod': {
                options: {
                    production: true // Install project Dependencies.
                }
            },
            'dev': {
                options: {
                    production: false // Install project devDependencies.
                }
            }
        },
        // ------------------------------
        // 2. Build Asset(s) Verification
        // ------------------------------
        // Bower Components Syncing
        bowersync: {
            taskName: {
                files: {
                    // Target directory : Source directory
                    './docs/source/libs/': './bower_components'
                },
                options: {
                    // The path to the file. Default: 'bower.json'.
                    bowerFile: './bower.json',
                    // Use when copying `dependencies` section. Default: true.
                    dependencies: true,
                    // Use when copying `devDpendencies` section. Default: false.
                    devDependencies: true,
                    // Use when copying `peerDependencies` section. Default: false.
                    peerDependencies: false,
                    // Remove all files from dest that are not found in src. Default: true.
                    updateAndDelete: true,
                    // Create symlinks to dependencies, instead of copying them. Default: false.
                    symlink: true
                }
            }
        },
        // -------------------------------------------
        /// 3. Assembly of Documentation + Application
        // -------------------------------------------
        /// 3. Assembly --> 3.1 HTML Hint
        /// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        htmlhint: {
            options: {
                htmlhintrc: './config/rules/.htmlhintrc'
            },
            html1: {
                options: {
                    'attr-lowercase': false
                },
                /// Application
                src: ['./app/*.html', './app/en/**/*.html']
            },
            html2: {
                options: {
                    'attr-lowercase': true
                },
                /// Documentation + Definitions + Example
                src: ['./docs/source/*.html', './docs/source/definitions/*.html', './docs/source/example/**/*.html']
            }
        },
        /// 3. Assembly --> 3.2 HTML Minify
        /// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        htmlmin: {
            dist: {
                options: {
                    html5: true,
                    collapseWhitespace: true,
                    conservativeCollapse: false,
                    minifyCSS: true,
                    minifyJS: true,
                    removeAttributeQuotes: true,
                    removeComments: true
                },
                expand: true,
                cwd: '.',
                dest: buildPath,
                src: [
                    /// for all files in `app` directory.
                    './app/**/*.html',
                    './docs/**/*.html'
                ]
            }
        },
        // -------------------------------
        /// 4. Build of Sass using Compass
        // -------------------------------
        /// 4. Sass Build --> 4.1 Compass
        /// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        compass: {
            /// T:1 [cacheDir: .sass-cache]
            dist: {
                options: {
                    config: './config.rb',
                    environment: 'production',
                    raw: 'preferred_syntax = :sass\n' // Use `raw` since it's not directly available.
                }
            },
            /// T:2
            dev: {
                options: {
                    assetCacheBuster: true,
                    fontsPath: './core/source/font',
                    sassDir: './core/source/scss',
                    cssDir: './app/en/assets/style',
                    sourcemap: true
                }
            }
        },
        /// 4. Sass Build --> 4.2 Scss Lint
        /// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        scsslint: {
            options: {
                bundleExec: true,
                config: './core/source/scss/.scss-lint.yml',
                reporterOutput: null
            },
            core: {
                src: ['./core/source/scss/**/*.scss', '!./core/source/scss/**/_normalize.scss']
            }
        },
        // ---------------------------------------------
        /// 5. Linting + Minification (CSS + JavaScript)
        // ---------------------------------------------
        /// 5. CSS --> 5.1 Lint
        /// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // To update '.csslintrc' list, run this:
        // node -e "require('csslint').CSSLint.getRules().forEach(function(x) { console.log(x.id) })".
