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

    let _args = args;

    if (!_args) {
        _args = process.argv.slice(2);
    }

    // first arg is path to nodejs
    // second arg is the location of the script being executed
    const category = _args[0] ? `${args[0]}` : '';
    const task = _args[1] ? `: ${args[1]}` : '';
    const description = _args[2] ? ` (${args[2]})` : '';

    // const packageJson = require(`${path.resolve( process.cwd() )}/package.json`);
    // const hostName = packageJson.name;
    const msg = (`wpdtrt-npm-scripts - ${hostName} - ${category}${task}${description}`).toLowerCase();

    console.log(' ');
    console.log('--------------------------------------------------------------------------------');
    console.log(msg);
    console.log('--------------------------------------------------------------------------------');
    console.log(' ');
};

exports.log = log;
