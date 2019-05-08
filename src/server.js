#!/usr/bin/env node
"use strict";
/*eslint-disable no-console*/
/**
 * Run file-server web services
 * 
 * @author Todd King
 **/

const express    = require('express');
const serveIndex = require('./index');
const yargs = require('yargs');

var app = express();

// Configure the app
var options  = yargs
	.version('1.0.0')
	.usage('Run file-server web services\n\nRun the file-server web service.\n\nUsage:\n\nigpp-file-server [args]')
	.example('$0 .', 'load index into database')
	.epilog("Development funded by NASA's PDS project at UCLA.")
	.showHelpOnFail(false, 'Specify --help for available options')
	.help('h')
	
	// version
	.options({
		// help text
		'h' : {
			alias : 'help',
			description: 'Show information about the app.'
		},		
	
		// Verbose
		'v' : {
			alias : 'verbose',
			description: 'Show progress and other performance information.',
			type: 'boolean'			
		},

		// port
		'p' : {
			alias : 'port',
			description: 'port to run web server',
			type: 'string',
			default: "3000"
		},
		
		// directory
		'd' : {
			alias : 'directory',
			description: 'directory to serve',
			type: 'string',
			default: "."
		},
		
		// Root
		'r' : {
			alias : 'root',
			description: 'Root path on web server.',
			type: 'string',
			default: "data"
		},
		
		// Brand Name
		'b' : {
			alias : 'brand',
			description: 'Brand name for the service.',
			type: 'string',
			default: "File Server"
		},
	})
	.argv
	;

/**
 * Create HTTP server.
 */

// Check if environment variables are used to set options
if(process.env.PROJECT_NAME) {
	options.b = options.brand = process.env.PROJECT_NAME;
}
if(process.env.PROJECT_ROOT) {
	options.r = options.root = process.env.PROJECT_ROOT;
}
if(process.env.PROJECT_DIRECTORY) {
	options.d = options.directory = process.env.PROJECT_DIRECTORY;
}
if(process.env.PROJECT_PORT) {
	options.p = options.port = process.env.PROJECT_PORT;
}

if(options.verbose) {
	console.log(JSON.stringify(options, null, 3));
}

// Serve URLs like /data/thing as public/ftp/thing
// The express.static serves the file contents
// The serveIndex is this module serving the directory
app.use('/' + options.root, 
	express.static(options.directory),
	serveIndex(options.directory, {'icons': true, 'view': 'details', 'brand': options.brand})
	);

// Listen
app.listen(options.port);
console.log("Listening on http://localhost:" + options.port + "/" + options.root)
