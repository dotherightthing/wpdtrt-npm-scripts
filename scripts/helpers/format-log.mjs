/**
 * @file ./scripts/helpers/format-log.mjs
 * @summary Format a log message
 * @returns Log message
 * @example
 *  node scripts/helpers/log-task.js 'Preinstall' 'Composer' 'Install PHP dependencies'
 *  => wpdtrt-npm-scripts - preinstall: composer (install php dependencies)
 */

// require for modules that don't support ESM
// and JSON (see https://nodejs.org/docs/latest-v18.x/api/esm.html#import-assertions)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const wrap = require('wordwrap')(80);

/**
 * log
 *
 * @param {Array} args - Arguments
 */
const log = (args) => {
    // first arg is path to nodejs
    // second arg is the location of the script being executed
    const dateTime = new Date().toLocaleString();
    const category = args[0] ? `${args[0]}` : '';
    const task = args[1] ? `: ${args[1]}` : '';
    const description = args[2] ? ` (${args[2]})` : '';
    const msg = (`wpdtrt-npm-scripts: ${category}${task}${description}`).toLowerCase();

    /* eslint-disable no-console */
    console.log(' ');
    console.log('--------------------------------------------------------------------------------');
    console.log(dateTime);
    console.log(wrap(msg));
    console.log('--------------------------------------------------------------------------------');
    console.log(' ');
    /* eslint-enable no-console */
};

export { log as default };

const shellArgs = process.argv.slice(2);

if (shellArgs.length) {
    log(shellArgs);
}
