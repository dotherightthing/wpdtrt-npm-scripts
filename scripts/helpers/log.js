/**
 * @file scripts/helpers/log.js
 * @summary Format a log message
 * @return Log message
 * @example
 *  node scripts/helpers/log.js 'Preinstall' 'Composer' 'Install PHP dependencies'
 *  => preinstall: composer (install php dependencies)
 */

// first arg is path to nodejs
// second arg is the location of the script being executed
const args = process.argv.slice(2);
const category = args[0] ? `Script: ${args[0]}` : '';
const task = args[1] ? `: ${args[1]}` : '';
const description = args[2] ? ` (${args[2]})` : '';
const msg = (`${category}${task}${description}`).toLowerCase();

console.log(msg);
