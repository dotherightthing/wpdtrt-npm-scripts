/**
 * @file ./scripts/test/install-wpunit.js
 * @summary Replace template $placeholders with project specific values
 */

const execa = require('execa');
const fs = require('fs');
const path = require('path');

// if not loaded as a dependency
// if (!fs.existsSync('../../../../composer.json')) {
//     /* eslint-disable no-console */
//     console.error('install-wpunit.js: composer.json not found, exiting');
//     /* eslint-enable no-console */

//     return;
// }

// path.resolve:
// https://www.bennadel.com/blog/3244-non-module-file-paths-are-relative-to-the-working-directory-in-node-js.htm

const formatLog = require('../helpers/format-log.js').default;
const pluginName = process.cwd().split('/').pop();
const pluginNameSafe = pluginName.replace(/-/g, '_');
const dbName = `${pluginNameSafe}_wpunit_${Date.now()}`;
const wpVersion = 'latest';
let installerPath = `${path.resolve('../../')}/vendor/`;
const composerJson = require(`${path.resolve('../../')}/composer.json`);

formatLog([
    'test',
    'install wpunit',
    'install test suite and create database'
]);

const installWpUnit = async function () {
    if (composerJson.require) {
        const dependencies = Object.keys(composerJson.require);

        if (dependencies.includes('dotherightthing/wpdtrt-plugin-boilerplate')) {
            installerPath += 'dotherightthing/wpdtrt-plugin-boilerplate/';
        }
    }

    const shellScript = `${installerPath}bin/install-wp-tests.sh`;

    if (!fs.existsSync(shellScript)) {
        console.log(`${shellScript} does not exist.`); // eslint-disable-line no-console
        console.log('Skipping..\n\n'); // eslint-disable-line no-console
    }

    try {
        const { stdout, stderr } = await execa.commandSync(`bash ${shellScript} ${dbName} ${wpVersion}`, { shell: true });
        console.log(stdout); // eslint-disable-line no-console
        console.log(stderr); // eslint-disable-line no-console
    } catch (error) {
        console.error(error.stdout); // eslint-disable-line no-console
    }
};

installWpUnit();
