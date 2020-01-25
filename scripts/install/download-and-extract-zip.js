const https = require('https'); // node https module ?
const fs = require('fs'); // node file system module
const AdmZip = require('adm-zip'); // javascript zip implementation
const argv = require('yargs').argv; // parses named CLI arguments

/**
 * @function downloadAndExtractZip
 * @summary Download a zip file then extract it.
 *
 * @param {string} name - Filename for saved zip
 * @param {string} url - Download URL of zip file
 *
 * @see https://rajiev.com/download-an-extract-a-zip-file-with-node-js
 *
 * @example
 *  echo "Download and extract Natural Docs" \
 *  && cd $INIT_CWD \
 *  && mkdir tmp \
 *  && node ../../../scripts/install/download-and-extract-zip.js --extractdir='./bin' --tmpdir='./tmp' --url=https://naturaldocs.org/download/natural_docs/2.0.2/Natural_Docs_2.0.2.zip \
 *  && rm -r tmp
 *
 * @todo https://medium.com/netscape/a-guide-to-create-a-nodejs-command-line-package-c2166ad0452e
 */
const downloadAndExtractZip = function (tmpdir, extractdir, url) {
    // console.log(argv);

    const downloadTo = tmpdir + '/tmp.zip';

    // as the zip also contains a name named 'Natural Docs'
    // this results in 'Natural Docs/Natural Docs'
    const extractTo = extractdir;

    // Use https to get the url to the zip file
    https.get(url, function (response) {

        // https://nodejs.org/api/https.html
        // console.log('statusCode:', response.statusCode);
        // console.log('headers:', response.headers);

        response.on('data', function (data) {
            // synchronously append chunks of data to the temporary file path
            fs.appendFileSync(downloadTo, data);
        });
        
        response.on('end', function () {
            // extract the zip to another directory
            const zip = new AdmZip(downloadTo);
            zip.extractAllTo(extractTo);
        });
    }).on('error', (e) => {
        console.error(e);
    });
};

downloadAndExtractZip(argv.tmpdir, argv.extractdir, argv.url);
