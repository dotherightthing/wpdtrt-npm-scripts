/**
 * @file ./scripts/postinstall/customise-config.js
 * @summary Replace template $placeholders with project specific values
 */

const replaceInFiles = require('replace-in-files');
const formatLog = require('../helpers/format-log.js').default;
const packageJson = require('../../../../package.json');

// from and to are required
// but are overridden in the pipes
const options = {
    files: [
        '../../config/naturaldocs/Project.txt'
    ],
    from: '$packageName',
    to: packageJson.name
};

const customiseConfig = async function () {
    try {
        const {
            countOfMatchesByPaths
        } = await replaceInFiles(options)
            .pipe({ from: '$packageName', to: packageJson.name })
            .pipe({ from: '$packageVersion', to: packageJson.version });

        // filter out empty objects
        const changedFiles = countOfMatchesByPaths
            .filter(path => Object.keys(path).length);

        const suffix = changedFiles.length > 1 ? 's' : '';

        formatLog([
            'postinstall',
            'customise config',
            `${changedFiles.length} string${suffix} replaced`
        ]);
    } catch (error) {
        formatLog([
            'postinstall',
            'customise config',
            `${error}`
        ]);
    }
};

customiseConfig();
