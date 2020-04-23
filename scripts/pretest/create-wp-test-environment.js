/**
 * @file ./scripts/pretest/create-wp-test-environment.js
 * @summary Install test library and create a test database.
 */

const execa = require('execa');
const formatLog = require('../helpers/format-log.js').default;

formatLog([
    'test',
    'create wp test environment',
    'install wp test suite and create database'
]);

/**
 * createWpTestEnvironment
 *
 * @summary Install test library, create a test database.
 */
const createWpTestEnvironment = async function () {
    const pluginName = process.cwd().split('/').pop();
    const pluginNameSafe = pluginName.replace(/-/g, '_');
    const dbName = `${pluginNameSafe}_wpunit_${Date.now()}`;
    const wpVersion = 'latest';

    try {
        // eslint-disable-next-line no-unused-vars
        const installDependenciesAndCreateDatabase = await execa.commandSync(
            `bash ./scripts/pretest/install-wp-tests.sh ${dbName} ${wpVersion}`, {
                shell: true
            }
        );
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log('error', err);
    }
};

createWpTestEnvironment();
