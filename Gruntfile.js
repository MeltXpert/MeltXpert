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
