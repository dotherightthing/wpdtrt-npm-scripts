/**
 * @file ./helpers/helpers/exec.js
 * @summary Promisify the node exec function, to be notified when command line calls have completed.
 * @see [node-exec](https://gist.github.com/dotherightthing/3a1a33e87fcf3575b8a5b28c77784db2)
 * @example
 * async function execPromiseTest() {
 *   const { stdout, stderr } = await exec( 'echo "execPromise test"' );
 *   console.log( stdout );
 *   console.error( stderr );
 * }
 */

// const util = require( 'util' );
import util from 'util';
const { exec: execCallback } = require('child_process');
const exec = util.promisify(execCallback);

exports.default = exec;
