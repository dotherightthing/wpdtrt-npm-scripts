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
            countOfMatchesByPaths
        } = await replaceInFiles(options)
            .pipe({ from: '$packageName', to: package.name })
            .pipe({ from: '$packageVersion', to: package.version });

            const suffix = (changedFiles > 1 ? 's' : '');

            formatLog([
                'postinstall',
                'customise config',
                `${countOfMatchesByPaths} strings replaced in ${changedFiles} file${suffix}`
            ]);
        } catch (error) {
            formatLog([
                'postinstall',
                'customise config',
                `${error}`
            ]);
        }
}
   
customiseConfig();
