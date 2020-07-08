/**
 * @file version/version.js
 * @summary Tasks to version files prior to a release.
 */
const execa = require('execa');
const path = require('path');
const wpdtrtPluginBump = require('gulp-wpdtrt-plugin-bump');

const formatLog = require('../helpers/format-log.js').default;
const packageJson = require(`${path.resolve('../../')}/package.json`);

// const wordpressChildTheme = packageJson.keywords.includes('wordpress-child-theme');
const wordpressPlugin = packageJson.keywords.includes('wordpress-plugin');
const wordpressPluginBoilerplate = packageJson.name === 'wpdtrt-plugin-boilerplate';
const wordpressPluginBoilerplatePath = packageJson.keywords.includes('wordpress-plugin') ? 'vendor/dotherightthing/wpdtrt-plugin-boilerplate/' : '';

/* eslint-disable no-console */

/**
 * @function autoloadUpdatedDependencies (3/3)
 * @summary Regenerate the list of PHP classes to be autoloaded.
 */
async function autoloadUpdatedDependencies() {
    formatLog([
        'version',
        'autoloadUpdatedDependencies',
        'Regenerate the list of PHP classes to be autoloaded'
    ]);

    try {
        const { stdout, stderr } = await execa.commandSync('composer dump-autoload --no-interaction');
        console.log(stdout);
        console.log(stderr);
    } catch (error) {
        console.error(error.stdout);
    }
}

/**
 * @function replaceVersions (2/3)
 * @summary Replace version strings, using the version set in package.json.
 */
function replaceVersions() {
    formatLog([
        'version',
        'replaceVersions',
        'Replace version strings'
    ]);

    if (wordpressPluginBoilerplate) {
        try {
            wpdtrtPluginBump({
                inputPathRoot: `../../`, // path from wpdtrtPluginBump's index.js to project root (package.json)
                inputPathBoilerplate: `../../` // path from wpdtrtPluginBump's index.js to boilerplate root (package.json)
            });
        } catch (error) {
            console.error(error);
        }
    } else if (wordpressPlugin) {
        try {
            wpdtrtPluginBump({
                inputPathRoot: '../../',
                inputPathBoilerplate: `./${wordpressPluginBoilerplatePath}`
            });
        } catch (error) {
            console.error(error);
        }
    } else {
        console.log('This repository is not a plugin.');
        console.log('Skipping..\n\n');
    }
}

/**
 * @function updateDependencies (1/3)
 * @summary Update the boilerplate dependency to the latest version.
 * @description
 * Note:
 * - If wpdtrt-plugin-boilerplate is loaded as a dependency,
 *   get the latest release of wpdtrt-plugin-boilerplate.
 * - This has to run before replaceVersions,
 *   so that the correct version information is available
 */
async function updateDependencies() {
    formatLog([
        'version',
        'updateDependencies',
        'Update Composer dependencies'
    ]);

    if (wordpressPluginBoilerplatePath.length) {
        try {
            const { stdout, stderr } = await execa.commandSync('composer update dotherightthing/wpdtrt-plugin-boilerplate --no-interaction --no-suggest');
            console.log(stdout);
            console.log(stderr);
        } catch (error) {
            console.error(error.stdout);
        }
    }
}

updateDependencies();
replaceVersions();
autoloadUpdatedDependencies();
