/**
 * @file ./scripts/release/create-zip.js
 * @summary Create a zip file from the release directory.
 */

const JSZip = require('jszip');
const formatLog = require('./scripts/helpers/format-log.js');
const releaseName = require('./scripts/helpers/release-name.js');

const ci = (typeof process.env.CI !== 'undefined');
const folderName = releaseName.getReleaseName();

if ( !ci ) {
    formatLog.log([
        'release',
        'create zip',
        'skipping - not CI'
    ]);

    return;
} else {
    formatLog.log([
        'release',
        'create zip'
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

let zip = new JSZip();
zip.folder(folderName);

zip
.generateNodeStream({
    type: 'nodebuffer',
    streamFiles: true
})
.pipe(fs.createWriteStream(`${folderName}.zip`))
.on('finish', function () {
    // JSZip generates a readable stream with a "end" event,
    // but is piped here in a writable stream which emits a "finish" event.

    formatLog.log([
        'release',
        'created zip'
        `/${folderName}.zip`
    ]);
});
