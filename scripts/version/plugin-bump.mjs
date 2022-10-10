/**
 * @file version/version.js
 * @summary Tasks to version files prior to a release.
 */

// require for modules that don't support ESM
// and JSON (see https://nodejs.org/docs/latest-v18.x/api/esm.html#import-assertions)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { execaCommandSync } from 'execa';
import * as path from 'path';
import formatLog from '../helpers/format-log.mjs';
const replace = require('replace-in-file');

const packageJson = require(`${path.resolve('../../')}/package.json`);

// const wordpressChildTheme = packageJson.keywords.includes('wordpress-child-theme');
const wordpressPlugin = packageJson.keywords.includes('wordpress-plugin');
const wordpressPluginBoilerplate = packageJson.name === 'wpdtrt-plugin-boilerplate';
const wordpressPluginBoilerplatePath = packageJson.keywords.includes('wordpress-plugin') ? '../../vendor/dotherightthing/wpdtrt-plugin-boilerplate/' : '';

/* eslint-disable no-console */

/**
 * @function logFiles
 * @summary Print a message to the console.
 * Note: If files don't exist, the versioning functions will fail silently.
 * @param {Array} files - Files to version
 */
function logFiles(files) {
    let length = 1;
    let plural = '';
    let filesStr = files;

    if (Array.isArray(files)) {
        length = files.length;
        plural = 's';

        // remove [ and ] from output
        filesStr = files.toString();
        filesStr = filesStr.replace(/,/g, '\n');
    }

    console.log(`Versioning ${length} file${plural}:`);
    console.log(filesStr);
    console.log(' ');
}

/**
 * @function versionGeneratedPluginReadme
 * @summary Version the (WordPress) readme.txt
 * @param {string} inputPath - Path to wpdtrt-generated-plugin/
 * @param {object} packageRoot - A reference to the generated plugin's package.json file
 * @returns {Array} Replacement results: [{file: '/path/to/file1.ext', hasChanged: true},{file: '/path/to/file2.ext', hasChanged: true}]
 * @example
 * ./readme.txt
 * Stable tag: 1.2.3
 * == Changelog ==
 * = 1.2.3 =
 */
function versionGeneratedPluginReadme(inputPath, packageRoot) {
    const files = `${inputPath}readme.txt`;

    const re1 = new RegExp(
        /(Stable tag: )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
    );

    const re2 = new RegExp(
        /(== Changelog ==\s\s= )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})+( =\s)/
    );
    const { version } = packageRoot;

    logFiles(files);

    const replacements = replace.sync({
        files,
        from: [ re1, re2 ],
        to: [ `$1${version}`, `$1${version} =\n\n= $2$3` ]
    });

    return replacements;
}

/**
 * @function versionNamespaceSafe
 * @summary Get the version value from wpdtrt-plugin-boilerplate/package.json, in namespace format.
 * @param {string} packageVersionBoilerplate e.g. 1.2.34
 * @returns {string} The version in namespace format, e.g. 1_2_34
 */
function versionNamespaceSafe(packageVersionBoilerplate) {
    return packageVersionBoilerplate.split('.').join('_');
}

/**
 * @function versionGeneratedPluginSrc
 * @summary version the extended class name.
 * @param {string} inputPath - Path to wpdtrt-generated-plugin/
 * @param {object} packageRoot - A reference to the generated plugin's package.json file
 * @param {string} packageVersionBoilerplateNamespaced - The version in namespace format
 * @returns {Array} Replacement results: [{file: '/path/to/file1.ext', hasChanged: true},{file: '/path/to/file2.ext', hasChanged: true}]
 * @example
 * ./src/class-*.php:
 * extends DoTheRightThing\WPDTRT_Plugin_Boilerplate\r_1_2_3
 */
function versionGeneratedPluginSrc(inputPath, packageRoot, packageVersionBoilerplateNamespaced) {
    const categories = [
        'plugin',
        'rewrite',
        'shortcode',
        'taxonomy',
        'widget'
    ];

    const files = [];

    const re = new RegExp(
        /(extends DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/
    );

    const { name } = packageRoot;

    categories.forEach(category => {
        files.push(
            `${inputPath}src/class-${name}-${category}.php`
        );
    });

    logFiles(files);

    const replacements = replace.sync({
        files,
        from: re,
        to: `$1${packageVersionBoilerplateNamespaced}`
    });

    return replacements;
}

/**
 * @function versionGeneratedPluginDocs
 * @summary version the Natural Docs' Project.txt.
 * @param {string} inputPath - Path to wpdtrt-generated-plugin/
 * @param {object} packageRoot - A reference to the generated plugin's package.json file
 * @returns {Array} Replacement results: [{file: '/path/to/file1.ext', hasChanged: true},{file: '/path/to/file2.ext', hasChanged: true}]
 * @example
 * ./config/naturaldocs/Project.txt
 * Subtitle: DTRT Foo (1.2.3)
 */
function versionGeneratedPluginDocs(inputPath, packageRoot) {
    const files = `${inputPath}config/naturaldocs/Project.txt`;

    const re = new RegExp(
        /(Subtitle: [A-Za-z0-9( ]+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
    );

    const { version } = packageRoot;

    logFiles(files);

    const replacements = replace.sync({
        files,
        from: re,
        to: `$1${version}`
    });

    return replacements;
}

/**
 * @function versionGeneratedPluginWpRoot
 * @summary version the child root file.
 * @param {string} inputPath - Path to wpdtrt-generated-plugin/
 * @param {object} packageRoot - A reference to the generated plugin's package.json file
 * @returns {Array} Replacement results: [{file: '/path/to/file1.ext', hasChanged: true},{file: '/path/to/file2.ext', hasChanged: true}]
 * @example
 * ./wpdtrt-generated-plugin.php ?
 * * Version: 1.2.3
 * define( 'WPDTRT_PLUGIN_VERSION', '1.2.3' );
 */
function versionGeneratedPluginWpRoot(inputPath, packageRoot) {
    const { name, version } = packageRoot;

    const files = `${inputPath}${name}.php`;

    const re1 = new RegExp(
        /(\* Version:\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
    );

    const re2 = new RegExp(
        /(define\( '(?:[A-Z_]+)', ')([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(' \);)/
    );

    logFiles(files);

    const replacements = replace.sync({
        files,
        from: [ re1, re2 ],
        to: [ `$1${version}`, `$1${version}$3` ]
    });

    return replacements;
}

/**
 * @function versionBoilerplateAutoloader
 * @summary version the autoloader (index) file.
 * @param {string} inputPath - Path to wpdtrt-plugin-boilerplate/
 * @param {object} packageBoilerplate - A reference to the package.json file
 * @returns {Array} Replacement results: [{file: '/path/to/file1.ext', hasChanged: true},{file: '/path/to/file2.ext', hasChanged: true}]
 * @example
 * ./index.php
 * * @version 1.2.3
 */
function versionBoilerplateAutoloader(inputPath, packageBoilerplate) {
    const files = `${inputPath}index.php`;

    const { version } = packageBoilerplate;

    const re = new RegExp(
        /(\* @version\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
    );

    logFiles(files);

    const replacements = replace.sync({
        files,
        from: re,
        to: `$1${version}`
    });

    return replacements;
}

/**
 * @function versionBoilerplateComposer
 * @summary version the composer file.
 * @param {string} inputPath - Path to wpdtrt-plugin-boilerplate/
 * @param {string} packageVersionBoilerplateNamespaced - The version in namespace format
 * @returns {Array} Replacement results: [{file: '/path/to/file1.ext', hasChanged: true},{file: '/path/to/file2.ext', hasChanged: true}]
 * @example
 * ./composer.json
 * "DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\r_1_2_3\\": "src"
 */
function versionBoilerplateComposer(inputPath, packageVersionBoilerplateNamespaced) {
    const files = `${inputPath}composer.json`;

    const re = new RegExp(
        /("DoTheRightThing\\\\WPDTRT_Plugin_Boilerplate\\\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})(\\\\")/
    );

    logFiles(files);

    const replacements = replace.sync({
        files,
        from: re,
        to: `$1${packageVersionBoilerplateNamespaced}$3`
    });

    return replacements;
}

/**
 * @function versionBoilerplateNaturalDocs
 * @summary version the Natural Docs' Project.txt.
 * @param {string} inputPath - Path to wpdtrt-plugin-boilerplate/
 * @param {object} packageBoilerplate - A reference to the package.json file
 * @returns {Array} Replacement results: [{file: '/path/to/file1.ext', hasChanged: true},{file: '/path/to/file2.ext', hasChanged: true}]
 * @example
 * ./config/naturaldocs/Project.txt
 * Subtitle: DTRT WordPress Plugin Boilerplate (1.2.3)
 */
function versionBoilerplateNaturalDocs(inputPath, packageBoilerplate) {
    const files = `${inputPath}config/naturaldocs/Project.txt`;

    const re = new RegExp(
        /(Subtitle: DTRT WordPress Plugin Boilerplate \(+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
    );

    const { version } = packageBoilerplate;

    logFiles(files);

    const replacements = replace.sync({
        files,
        from: re,
        to: `$1${version}`
    });

    return replacements;
}

/**
 * @function versionBoilerplateSrc
 * @summary version the namespaced src files.
 * @param {string} inputPath - Path to wpdtrt-plugin-boilerplate/
 * @param {string} packageVersionBoilerplateNamespaced - The version in namespace format
 * @returns {Array} Replacement results: [{file: '/path/to/file1.ext', hasChanged: true},{file: '/path/to/file2.ext', hasChanged: true}]
 * @example
 * ./src/*.php
 * DoTheRightThing\WPDTRT_Plugin_Boilerplate\r_1_2_3
 */
function versionBoilerplateSrc(inputPath, packageVersionBoilerplateNamespaced) {
    const categories = [
        'Rewrite',
        'Shortcode',
        'Taxonomy',
        'TemplateLoader',
        'Widget'
    ];

    const files = [];

    const re = new RegExp(
        /(DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/gm
    );

    categories.forEach(category => {
        files.push(`${inputPath}src/${category}.php`);
    });

    logFiles(files);

    const replacements = replace.sync({
        files,
        from: re,
        to: `$1${packageVersionBoilerplateNamespaced}`
    });

    return replacements;
}

/**
 * @function versionBoilerplateSrcPlugin
 * @summary version the namespaced src/Plugin.php file.
 * @param {string} inputPath - Path to wpdtrt-plugin-boilerplate/
 * @param {object} packageBoilerplate - A reference to the package.json file
 * @param {string} packageVersionBoilerplateNamespaced - The version in namespace format
 * @returns {Array} Replacement results: [{file: '/path/to/file1.ext', hasChanged: true},{file: '/path/to/file2.ext', hasChanged: true}]
 * @example
 * ./src/Plugin.php
 * DoTheRightThing\WPDTRT_Plugin_Boilerplate\r_1_2_3
 * const WPDTRT_PLUGIN_VERSION = "1.2.3";
 */
function versionBoilerplateSrcPlugin(inputPath, packageBoilerplate, packageVersionBoilerplateNamespaced) {
    const files = `${inputPath}src/Plugin.php`;

    const { version } = packageBoilerplate;

    const versionNamespaceSafeStr = packageVersionBoilerplateNamespaced;

    const re1 = new RegExp(
        /(DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/gm
    );

    const re2 = new RegExp(
        /(const WPDTRT_PLUGIN_VERSION = ')([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(';)/
    );

    logFiles(files);

    const replacements = replace.sync({
        files,
        from: [ re1, re2 ],
        to: [ `$1${versionNamespaceSafeStr}`, `$1${version}$3` ]
    });

    return replacements;
}

/**
 * @function versionBoilerplateTestNaturalDocs
 * @summary version Natural Docs' Project.txt.
 * @param {string} inputPath - Path to wpdtrt-plugin-boilerplate/
 * @param {object} packageRoot - A reference to the package.json file
 * @returns {Array} src files
 * @example
 * ./config/naturaldocs/Project.txt
 * Subtitle: DTRT Foo (1.2.3)
 */
function versionBoilerplateTestNaturalDocs(inputPath, packageRoot) {
    const files = `${inputPath}tests/generated-plugin/config/naturaldocs/Project.txt`;

    const re = new RegExp(
        /(Subtitle: [A-Za-z0-9( ]+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
    );

    const { version } = packageRoot;

    logFiles(files);

    const replacements = replace.sync({
        files,
        from: re,
        to: `$1${version}`
    });

    return replacements;
}

/**
 * @function versionBoilerplateTestReadme
 * @summary version the (WordPress) readme.
 * @param {string} inputPath - Path to wpdtrt-plugin-boilerplate/
 * @param {object} packageBoilerplate - A reference to the package.json file
 * @returns {Array} src files
 * @example
 * ./tests/generated-plugin/readme.txt
 * Stable tag: 1.2.3
 * // == Changelog ==
 * //
 * // = 1.2.3 =
 * //
 */
function versionBoilerplateTestReadme(inputPath, packageBoilerplate) {
    const files = `${inputPath}tests/generated-plugin/readme.txt`;

    const { version } = packageBoilerplate;

    const re1 = new RegExp(
        /(Stable tag: )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
    );

    const re2 = new RegExp(
        /(== Changelog ==\s\s= )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})+( =\s)/
    );

    logFiles(files);

    const replacements = replace.sync({
        files,
        from: [ re1, re2 ],
        to: [ `$1${version}`, `$1${version} =\n\n= $2$3` ]
    });

    return replacements;
}

/**
 * @function versionBoilerplateTestWpRoot
 * @summary version the root (WordPress) file.
 * @param {string} inputPath - Path to wpdtrt-plugin-boilerplate/
 * @param {object} packageBoilerplate - A reference to the package.json file
 * @returns {Array} src files
 * @example
 * ./tests/generated-plugin/index.php
 * * Version: 1.2.3
 * define( 'WPDTRT_TEST_VERSION', '1.2.3' );
 */
function versionBoilerplateTestWpRoot(inputPath, packageBoilerplate) {
    const files = `${inputPath}tests/generated-plugin/wpdtrt-test.php`;

    const { version } = packageBoilerplate;

    const re1 = new RegExp(
        /(\* Version:\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
    );

    const re2 = new RegExp(
        /(define\( 'WPDTRT_TEST_VERSION', ')([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(' \);)/
    );

    logFiles(files);

    const replacements = replace.sync({
        files,
        from: [ re1, re2 ],
        to: [ `$1${version}`, `$1${version}$3` ]
    });

    return replacements;
}

/**
 * @function versionBoilerplateTestSrc
 * @summary version the namespaced src files.
 * @param {string} inputPath - Path to wpdtrt-plugin-boilerplate/
 * @param {string} packageVersionBoilerplateNamespaced - The version in namespace format
 * @returns {Array} src files
 * @example
 * ./tests/generated-plugin/src/*.php
 * DoTheRightThing\WPDTRT_Plugin_Boilerplate\r_1_2_3
 */
function versionBoilerplateTestSrc(inputPath, packageVersionBoilerplateNamespaced) {
    const categories = [
        'plugin',
        'rewrite',
        'shortcode',
        'taxonomy',
        'widget'
    ];

    const files = [];

    const re = new RegExp(
        /(DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/
    );
    const versionNamespaceSafeStr = packageVersionBoilerplateNamespaced;

    categories.forEach(category => {
        files.push(
            `${inputPath}tests/generated-plugin/src/class-wpdtrt-test-${category}.php`
        );
    });

    logFiles(files);

    const replacements = replace.sync({
        files,
        from: re,
        to: `$1${versionNamespaceSafeStr}`
    });

    return replacements;
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
        const command = 'composer update dotherightthing/wpdtrt-plugin-boilerplate --no-interaction --no-suggest';
        console.log(command);

        try {
            const { stdout, stderr } = await execaCommandSync(command, { shell: true });
            console.log(stdout);
            console.log(stderr);
        } catch (error) {
            console.error(error.stdout);
        }
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

    /**
     * @summary
     * - Location of the plugin root directory
     * - Used to load package.json
     * - Relative to the active gulpfile, not to the CWD
     * - This is the directory containing the Gulpfile
     */
    let inputPathRoot;

    /**
     * @summary
     * - Used to load package.json
     * - This is the root directory if the boilerplate is not a dependency
     * - This is Composer's install location if the boilerplate is a dependency
     */
    let inputPathBoilerplate;

    if (wordpressPluginBoilerplate) {
        inputPathRoot = '../../'; // path from wpdtrtPluginBump's index.js to project root (package.json)
        inputPathBoilerplate = '../../'; // path from wpdtrtPluginBump's index.js to boilerplate root (package.json)
    } else if (wordpressPlugin) {
        inputPathRoot = '../../';
        inputPathBoilerplate = `./${wordpressPluginBoilerplatePath}`;
    } else {
        console.log('This repository is not a plugin.');
        console.log('Skipping..\n\n');
    }

    let packageRoot;
    let packageBoilerplate;
    let packageVersionBoilerplateNamespaced;

    // boilerplate as root
    if (inputPathRoot === inputPathBoilerplate) {
        /* eslint-disable global-require */
        packageRoot = require(`${process.cwd()}/${inputPathBoilerplate}package.json`);
        packageBoilerplate = require(`${process.cwd()}/${inputPathBoilerplate}package.json`);
        /* eslint-enable global-require */

        const {
            name: nameBoilerplate,
            version: versionBoilerplate
        } = packageBoilerplate;

        packageVersionBoilerplateNamespaced = versionNamespaceSafe(versionBoilerplate);

        // get the latest release number
        console.log(`Bump ${nameBoilerplate} to ${versionBoilerplate} using package.json`);

        versionBoilerplateAutoloader(inputPathBoilerplate, packageBoilerplate);

        versionBoilerplateComposer(inputPathBoilerplate, packageVersionBoilerplateNamespaced);

        versionBoilerplateSrc(inputPathBoilerplate, packageVersionBoilerplateNamespaced);

        versionBoilerplateSrcPlugin(inputPathBoilerplate, packageBoilerplate, packageVersionBoilerplateNamespaced);

        versionBoilerplateNaturalDocs(inputPathBoilerplate, packageBoilerplate);

        versionBoilerplateTestReadme(inputPathBoilerplate, packageBoilerplate);

        versionBoilerplateTestWpRoot(inputPathBoilerplate, packageBoilerplate);

        versionBoilerplateTestSrc(inputPathBoilerplate, packageVersionBoilerplateNamespaced);

        versionBoilerplateTestNaturalDocs(inputPathBoilerplate, packageBoilerplate);
    } else {
        // parent installed as a dependency of child
        /* eslint-disable global-require */
        packageRoot = require(`${process.cwd()}/${inputPathRoot}package.json`);
        packageBoilerplate = require(
            `${process.cwd()}/${inputPathBoilerplate}package.json`
        );
        /* eslint-enable global-require */

        const {
            name: nameRoot,
            version: versionRoot
        } = packageRoot;

        const {
            name: nameBoilerplate,
            version: versionBoilerplate
        } = packageBoilerplate;

        packageVersionBoilerplateNamespaced = versionNamespaceSafe(versionBoilerplate);

        console.log(
            // bump wpdtrt-foo to 0.1.2 and wpdtrt-plugin-boilerplate 1.2.3 using package.json
            `Bump ${nameRoot} to ${versionRoot} and ${nameBoilerplate} ${versionBoilerplate} using package.json`
        );

        versionGeneratedPluginSrc(inputPathRoot, packageRoot, packageVersionBoilerplateNamespaced);

        versionGeneratedPluginReadme(inputPathRoot, packageRoot);

        versionGeneratedPluginWpRoot(inputPathRoot, packageRoot);

        versionGeneratedPluginDocs(inputPathRoot, packageRoot);
    }
}

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

    const command = 'composer dump-autoload --no-interaction';
    console.log(command);

    try {
        const { stdout, stderr } = await execaCommandSync(command, { shell: true });
        console.log(stdout);
        console.log(stderr);
    } catch (error) {
        console.error(error.stdout);
    }
}

updateDependencies();
replaceVersions();
autoloadUpdatedDependencies();
