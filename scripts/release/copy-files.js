/**
 * @file ./scripts/release/copy-files.js
 * @summary Copy files to release directory.
 */

const cpy = require('cpy');
const formatLog = require('../helpers/format-log.js').default;
const numeral = require('numeral');
const package = require('../../../../package.json');
const releaseName = require('../helpers/release-name.js').default;

const ci = true; // (typeof process.env.CI !== 'undefined');
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
    './cheatsheets/**/*',
    // Theme Config
    './config/**/*',
    // Compiled Theme CSS
    './css/**/*',
    // Icons
    './icons/**/*',
    // Images
    './images/**/*',
    // Transpiled Theme JS
    './js/**/*-es5.js',
    // Theme Logic
    './library/**/*',
    // Theme template partials
    './template-parts/**/*',
    // Any Tiny MCE (WYSIWYG) mods
    './tiny-mce/**/*',
    // Any PHP dependencies
    './vendor/**/*',
    // Not NPM dependencies
    '!./node_modules/**/*',
    '!./vendor/**/bin',
    // Not JSON files
    '!./vendor/**/*.json',
    // Not Less files
    '!./vendor/**/*.less',
    // Not Authors files
    '!./vendor/**/AUTHORS',
    // Not Changes files
    '!./vendor/**/CHANGES',
    // Not License files
    '!./vendor/**/license',
    '!./vendor/**/LICENSE',
    // Not Markdown files
    '!./vendor/**/*.md',,
    '!./vendor/**/*example*.php',
    // Not Sass files
    '!./vendor/**/*.scss',
    // Not SCSS folders
    '!./vendor/**/*/scss',
    // Not test files
    '!./vendor/**/test/**/*',
    // Not tests files
    '!./vendor/**/tests/**/*',
    // Not XML files
    '!./vendor/**/*.xml',
    // Not Zip files
    '!./vendor/**/*.zip',
    // Theme search form
    './_searchform.php',
    // Theme archive page template
    './archive.php',
    // Theme comments partial
    './comments.php',
    // Theme footer partial
    './footer.php',
    // Theme functions
    './functions.php',
    // Theme header partial
    './header.php',
    // Theme post title and content template
    './index.php',
    // Theme maintenance page template
    './maintenance.php',
    // The template for displaying all pages
    './page.php',
    // Theme Read Me
    './README.md',
    // Theme WP Read Me
    './README.txt',
    // Theme Screenshot
    './screenshot.png',
    // Theme Search Template
    './search.php',
    // Theme widget-ready sidebar partials
    './sidebar-widget-tests.php',
    './sidebar.php',
    // Theme Single Post Template
    './single.php',
    // Theme Stylesheet
    './style.css',
    // wpdtrt-dbth child theme templates
    './archive-tourdiaries.php',
    './image.php',
    './page-search.php',
    './single-tourdiaries.php',
    './templates/**/*',
    './taxonomy-wpdtrt_tourdates_taxonomy_tour.php',
    // Not CSS source maps
    '!./css/maps/**/*',
    // Not demo files
    '!./icons/icomoon/demo-files/**/*',
    // Not docs
    '!./docs/**/*',
];

// copy FE dependencies
// npm prune --production would remove all devDependencies
// but we're still left with wpdtrt-npm-scripts
// which uses other libraries.
const dependencies = package.dependencies;
const dependencyNames = Object.keys(dependencies);

let dependencyNamesFiltered = dependencyNames.map(function(dependencyName) {
    return dependencyName !== 'wpdtrt-npm-scripts';
});

dependencyNamesFiltered.forEach((name, index) => {
    releaseFiles.push(`./node_modules/${dependencyName}/**/*`);
});

(async () => {
    await cpy(releaseFiles, folderName, {
        cwd: '../../',
        parents: true
    }).on('progress', progress => {

        const percent = numeral(progress.percent).format('0%');
        const size = numeral(progress.completedSize).format('0.0 b');

        formatLog([
            'release',
            'copying files',
            `${progress.completedFiles}/${progress.totalFiles} | ${percent} | ${size}`
        ]);
    });
})();
