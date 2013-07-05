#!/usr/bin/env node

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var DEFAULT_INPUT = 'index.html';
var DEFAULT_CHECKS = 'checks.json';

var assertFileExists = function(inFile) {
  var inStr = inFile.toString();

  if(!fs.existsSync(inStr)) {
    console.err('%s does not exist. Exiting Program.', inStr);
    process.exit(1);
  }
  console.log("assertFile: " + inStr);

  return inStr;
};

var loadHtmlFile = function(htmlfile) {
  return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
  return JSON.parse(fs.readFileSync(checksfile)); 
};

var validate = function(htmlfile, checksfile) {
  $ = loadHtmlFile(htmlfile);
  var checks = loadChecks(checksfile);
  var outfile = {};

  for(var i = 0; i < checks.length; i++) {
    var elemExists = $(checks[i]).length > 0;
    outfile[checks[i]] = elemExists;
  }

    return outfile;
};

if(require.main == module) {
  program
    .option('-c, --checks', 'Path to checks.json', assertFileExists, DEFAULT_CHECKS)
    .option('-f, --file', 'Path to index.html', assertFileExists, DEFAULT_INPUT)
    .parse(process.argv);
  var checkJson = validate(program.file, program.checks);
  var outJson = JSON.stringify(checkJson, null, 4);
  console.log(outJson);
} else {
  exports.checkHtmlFile = checkHtmlFile;
}
