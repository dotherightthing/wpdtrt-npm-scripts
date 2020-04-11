/**
 * @file ./scripts/release/copy-files.js
 * @summary Copy files to release directory.
 */

const cpy = require('cpy');
const formatLog = require('../helpers/format-log.js').default;
const numeral = require('numeral');
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
const releaseFiles = [
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
    // NPM dependencies
    './node_modules/**/*',
    // Theme template partials
    './template-parts/**/*',
    // Any Tiny MCE (WYSIWYG) mods
    './tiny-mce/**/*',
    // Any PHP dependencies
    './vendor/**/*',
    // Not wpdtrt 'file'
    '!./node_modules/wpdtrt',
    // Not binary executables
    '!./node_modules/.bin',
    '!./node_modules/**/.bin',
    '!./node_modules/**/bin',
    '!./vendor/**/bin',
    // Not JSON files
    '!./node_modules/**/*.json',
    '!./vendor/**/*.json',
    // Not Less files
    '!./node_modules/**/*.less',
    '!./vendor/**/*.less',
    // Not Authors files
    '!./node_modules/**/AUTHORS',
    '!./vendor/**/AUTHORS',
    // Not Changes files
    '!./node_modules/**/CHANGES',
    '!./vendor/**/CHANGES',
    // Not License files
    '!./node_modules/**/license',
    '!./vendor/**/license',
    '!./node_modules/**/LICENSE',
    '!./vendor/**/LICENSE',
    // Not Markdown files
    '!./node_modules/**/*.md',
    '!./vendor/**/*.md',
    // Not Makefile files
    '!./node_modules/**/Makefile',
    // Not PHP sample files
    '!./node_modules/**/*example*.php',
    '!./vendor/**/*example*.php',
    // Not Sass files
    '!./node_modules/**/*.scss',
    '!./vendor/**/*.scss',
    // Not SCSS folders
    '!./node_modules/**/*/scss',
    '!./vendor/**/*/scss',
    // Not test files
    '!./node_modules/**/test/**/*',
    '!./vendor/**/test/**/*',
    // Not tests files
    '!./node_modules/**/tests/**/*',
    '!./vendor/**/tests/**/*',
    // Not XML files
    '!./node_modules/**/*.xml',
    '!./vendor/**/*.xml',
    // Not Zip files
    '!./node_modules/**/*.zip',
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
    // Not Source files
    '!./node_modules/**/src/**/*',
];

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
