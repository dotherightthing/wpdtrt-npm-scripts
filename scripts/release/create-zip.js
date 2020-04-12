/**
 * @file ./scripts/release/create-zip.js
 * @summary Create a zip file from the release directory.
 */

const formatLog = require('../helpers/format-log.js').default;
const releaseName = require('../helpers/release-name.js').default;
const zipFolder = require('zip-folder');

const ci = (typeof process.env.CI !== 'undefined');
const folderName = releaseName();

if (!ci) {
    formatLog([
        'release',
        'create zip',
        'skipping - not CI'
    ]);

    return;
}

formatLog([
    'release',
    'create zip',
    `from /${folderName}`
]);

let ciPackageReleaseTag = '';

if (typeof process.env.TRAVIS !== 'undefined') {
    if (process.env.TRAVIS_TAG !== '') {
        ciPackageReleaseTag = `-${process.env.TRAVIS_TAG}`;
    }
} else if (typeof process.env.BITBUCKET_TAG !== 'undefined') {
    ciPackageReleaseTag = `-${process.env.BITBUCKET_TAG}`;
}

if (ciPackageReleaseTag) {
    zipFolder(`../../${folderName}`, `../../${folderName}.zip`, (err) => {
        if (err) {
            formatLog([
                'release',
                'zip creation failed',
                err
            ]);
        } else {
            formatLog([
                'release',
                'created zip',
                `/${folderName}.zip`
            ]);
        }
    });
}
