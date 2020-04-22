/**
 * @file ./scripts/test/install-wpunit.js
 * @summary Replace template $placeholders with project specific values
 */

const execa = require('execa');

const formatLog = require('../helpers/format-log.js').default;
const pluginName = process.cwd().split('/').pop();
const pluginNameSafe = pluginName.replace(/-/g, '_');
const dbName = `${pluginNameSafe}_wpunit_${Date.now()}`;
const wpVersion = 'latest';

formatLog([
    'test',
    'install wpunit',
    'install test suite and create database'
]);

const installWpUnit = async function () {
    const shellScript = 'install-wp-tests.sh';

    try {
        const { stdout, stderr } = await execa.commandSync(`bash ${shellScript} ${dbName} ${wpVersion}`, { shell: true });
        console.log(stdout); // eslint-disable-line no-console
        console.log(stderr); // eslint-disable-line no-console
    } catch (error) {
        console.error(error.stdout); // eslint-disable-line no-console
    }
};

installWpUnit();
