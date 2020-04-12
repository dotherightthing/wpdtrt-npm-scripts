const replaceInFiles = require('replace-in-files');
const formatLog = require('../helpers/format-log.js').default;
const package = require('../../../../package.json');

const options = {
    files: [
        '../../../../config/naturaldocs/Project.txt'
    ]
};

const customiseConfig = async function () {
    try {
        const {
            changedFiles,
            countOfMatchesByPaths,
            replaceInFilesOptions
        } = await replaceInFiles(options)
            .pipe({ from: '$packageName', to: package.name })
            .pipe({ from: '$packageVersion', to: package.version });

            // const suffix = (changedFiles > 1 ? 's' : '');

            console.log('Modified files:', changedFiles);
            console.log('Count of matches by paths:', countOfMatchesByPaths);
            console.log('was called with:', replaceInFilesOptions);

            // formatLog([
            //     'postinstall',
            //     'customise config',
            //     `${countOfMatchesByPaths} strings replaced in ${changedFiles} file${suffix}`
            // ]);
        } catch (error) {
            formatLog([
                'postinstall',
                'customise config',
                `${error}`
            ]);
        }
}
   
customiseConfig();
