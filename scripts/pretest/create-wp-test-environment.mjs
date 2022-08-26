/**
 * @file ./scripts/pretest/create-wp-test-environment.mjs
 * @summary Install test library and create a test database.
 */

import { execaCommandSync } from 'execa';
import formatLog from '../helpers/format-log.mjs';

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

    const command = `bash ./scripts/pretest/install-wp-tests.sh ${dbName} ${wpVersion}`;

    try {
        // eslint-disable-next-line no-unused-vars
        const installDependenciesAndCreateDatabase = await execaCommandSync(command, { shell: true });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log('error', err);
    }
};

createWpTestEnvironment();
