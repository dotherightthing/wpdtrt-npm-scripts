const { renderTemplateFile } = require('template-file');
const package = require('../../../../package.json');

const data = {
    packageName: package.name,
    packageVersion: package.version
};

const templateFiles = [
    '../../config/config/naturaldocs/Project.txt'
]

templateFiles.forEach(templateFile => {
    renderTemplateFile(templateFile, data);
});
