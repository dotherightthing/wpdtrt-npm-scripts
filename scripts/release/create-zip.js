/**
 * @file ./scripts/release/create-zip.js
 * @summary Create a zip file from the release directory.
 */

const formatLog = require('../helpers/format-log.js').default;
const releaseName = require('../helpers/release-name.js').default;
const trash = require('trash');
const zipFolder = require('zip-folder');

const createZip = () => {
    const ci = (typeof process.env.CI !== 'undefined');
    const folderName = releaseName();
    
    if ( !ci ) {
        formatLog([
            'release',
            'create zip',
            'skipping - not CI'
        ]);
    
        return;
    } else {
        formatLog([
            'release',
            'create zip',
            `from /${folderName}`
        ]);
    }
    
    let ci_package_release_tag = '';
    
    if (typeof process.env.TRAVIS !== 'undefined') {
        if (process.env.TRAVIS_TAG !== '') {
            ci_package_release_tag = `-${process.env.TRAVIS_TAG}`;
        }
    } else if (typeof process.env.BITBUCKET_TAG !== 'undefined') {
        ci_package_release_tag = `-${process.env.BITBUCKET_TAG}`;
    }

    zipFolder(`../../${folderName}`, `../../${folderName}.zip`, (err) => {
        if(err) {
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

            // send source folder to trash

            (async () => {
                await trash([`../../${folderName}`]);
            })();

            formatLog([
                'release',
                'deleted source folder',
                `/${folderName}`
            ]);
        }
    });
};

createZip();
