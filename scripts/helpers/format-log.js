/**
 * @file scripts/helpers/format-log.js
 * @summary Format a log message
 * @return Log message
 * @example
 *  node scripts/helpers/log-task.js 'Preinstall' 'Composer' 'Install PHP dependencies'
 *  => wpdtrt-npm-scripts - preinstall: composer (install php dependencies)
 */

/**
 * log
 * 
 * @param {array} args 
 */
const log = (args) => {

    // first arg is path to nodejs
    // second arg is the location of the script being executed
    const dateTime = `~ ${new Date().toLocaleString()} ~ `;
    const category = args[0] ? `${args[0]}` : '';
    const task = args[1] ? `: ${args[1]}` : '';
    const description = args[2] ? ` (${args[2]})` : '';
    const msg = (`wpdtrt-npm-scripts ${dateTime}${category}${task}${description}`).toLowerCase();

    console.log(' ');
    console.log('--------------------------------------------------------------------------------');
    console.log(msg);
    console.log('--------------------------------------------------------------------------------');
    console.log(' ');
};

exports.default = log;

const shellArgs = process.argv.slice(2);

if (shellArgs.length) {
    log(shellArgs);
}
