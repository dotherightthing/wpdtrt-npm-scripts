/**
 * @file ./scripts/postinstall/require-composer-dependencies.js
 * @summary Install wpdtrt-npm-scripts composer dependencies into the host.
 */

const execa = require('execa');
const formatLog = require('../helpers/format-log.js').default;
const fs = require('fs');

formatLog([
    'postinstall',
    'require composer dependencies',
    'add wpdtrt-npm-scripts dependencies to host\'s dependencies'
]);

/**
 * requireComposerDependencies
 *
 * @summary Install wpdtrt-npm-scripts composer dependencies into the host.
 * @description
 *  This library is installed as a node dependency not a composer dependency.
 *  This means that composer packages listed in composer's 'require' object
 *  are not automatically installed or available to the host.
 *
 * {@link https://stackoverflow.com/a/37576787/6850747|using-async-await-with-a-foreach-loop}
 * {@link https://stackoverflow.com/a/56913282/6850747|composer require --no-update}
 * {@link https://jakearchibald.com/2017/await-vs-return-vs-return-await/}
 */
const requireComposerDependencies = async function () {
    const composerObj = fs.readFileSync('composer.json'); // wpdtrt-npm-scripts/composer.json
    const devDependencies = composerObj.require;

    await Promise.all(
        // for..of is flagged by eslint as it stops each iteration
        // forEach/map makes requests parallel
        // map callback returns a promise
        // eslint-disable-next-line func-names
        devDependencies.map(async function (devDependency) {
            const thepackage = Object.keys(devDependency)[0];
            const version = devDependency[thepackage];

            // execa returns a child_process instance
            // which is also a Promise
            // resolving or rejecting with a childProcessResult
            return execa.commandSync(
                // dependencies are not installed
                // until composer install or composer update are run
                `composer require '${thepackage}:${version}' --no-update`, {
                    shell: true
                }
            ).stdout.pipe(process.stdout);
        })
    );
};

requireComposerDependencies();
