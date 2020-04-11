/**
 * @file ./scripts/release/copy-files.js
 * @summary Copy files to release directory.
 */

const cpy = require('cpy');
const formatLog = require('../helpers/format-log.js').default;
const numeral = require('numeral');
const package = require('../../../../package.json');
const releaseName = require('../helpers/release-name.js').default;

const ci = (typeof process.env.CI !== 'undefined');
const folderName = releaseName();

if ( !ci ) {
    formatLog([
        'release',
        'copy files',
        'skipping - not CI'
    ]);

    return;
} else {
    formatLog([
        'release',
        'copy files',
        `to /${folderName}`
    ]);
}

// Release files are those that are required
// to use the package as a WP Parent Theme
let releaseFiles = [
    // Theme Cheatsheets
    './cheatsheets/**/*.php',
    // Theme Config
    './config/**/*',
    // Theme CSS
    './css/*.css',
    // Theme Icons
    './icons/**/*',
    // Theme Images
    './images/**/*',
    // Theme JS
    './js/twentysixteen.js',
    './js/*-es5.js',
    // Theme Logic
    './library/**/*.php',
    // Theme Read Me
    './README.md',
    // Theme Screenshot
    './screenshot.png',
    // Theme Stylesheet
    './style.css',
    // Theme WP Read Me
    './README.txt',
    // Theme Templates
    './*.php',
    './templates/**/*.php',
    './template-parts/**/*.php',
    // Any Tiny MCE (WYSIWYG) mods
    './tiny-mce/**/*',
    // Any useful PHP dependencies
    './vendor/**/*',
    '!./vendor/**/bin',
    '!./vendor/**/*.json',
    '!./vendor/**/*.less',
    '!./vendor/**/AUTHORS*',
    '!./vendor/**/CHANGES*',
    '!./vendor/**/license*',
    '!./vendor/**/LICENSE*',
    '!./vendor/**/README*',
    '!./vendor/**/*.md',
    '!./vendor/**/*example*.php',
    '!./vendor/**/*.scss',
    '!./vendor/**/*/scss',
    '!./vendor/**/test/**/*',
    '!./vendor/**/tests/**/*',
    '!./vendor/**/*.xml',
    '!./vendor/**/*.zip',
    // Not CSS source maps
    '!./css/maps/**/*',
    // Not demo files
    '!./icons/icomoon/demo-files/**/*'
];

// copy FE dependencies
// npm prune --production would remove all devDependencies
// but we're still left with wpdtrt-npm-scripts
// which uses other libraries.
const dependencies = package.dependencies;
const dependencyNames = Object.keys(dependencies);
const dependencyNamesFiltered = dependencyNames.filter(name => name !== 'wpdtrt-npm-scripts');

dependencyNamesFiltered.forEach((name, index) => {
    releaseFiles.push(`./node_modules/${name}/**/*`);
    releaseFiles.push(`!./node_modules/${name}/package.json`),
    releaseFiles.push(`!./node_modules/${name}/**/src`),
    releaseFiles.push(`!./node_modules/${name}/**/AUTHORS*`),
    releaseFiles.push(`!./node_modules/${name}/**/CHANGE*`),
    releaseFiles.push(`!./node_modules/${name}/**/LICENSE*`),
    releaseFiles.push(`!./node_modules/${name}/**/README*`),
    releaseFiles.push(`!./node_modules/${name}/**/changelog*`),
    releaseFiles.push(`!./node_modules/${name}/**/*.map`)
});

(async () => {
    await cpy(releaseFiles, folderName, {
        cwd: '../../',
        parents: true
    }).on('progress', progress => {
        if (progress === 1) {
            const size = numeral(progress.completedSize).format('0.0 b');
    
            formatLog([
                'release',
                'copy files',
                `complete: ${folderName}.zip contains ${progress.totalFiles} files and is ${size}`
            ]);
        }
    });
})();
