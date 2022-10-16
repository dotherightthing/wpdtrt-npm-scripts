/**
 * @file ./scripts/release/copy-files.mjs
 * @summary Copy files to release directory.
 */

var totalSet = false;

// require for modules that don't support ESM
// and JSON (see https://nodejs.org/docs/latest-v18.x/api/esm.html#import-assertions)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import * as fs from 'node:fs';
import * as path from 'path';

// if not loaded as a dependency
if (!fs.existsSync(`${path.resolve()}/package.json`)) {
    /* eslint-disable no-console */
    console.error('copy-files.mjs: package.json not found, exiting');
    /* eslint-enable no-console */
}

const Bar = require('progress-barjs');
import cpy from 'cpy';
import formatLog from '../helpers/format-log.mjs';
const numeral = require('numeral');
const packageJson = require(`${path.resolve('../../')}/package.json`);
let composerJson;

try {
    composerJson = require(`${path.resolve('../../')}/composer.json`); // eslint-disable-line global-require
} catch (err) {
    composerJson = false;
}

const folderName = 'release';

formatLog([
    'release',
    'copy files',
    `to /${folderName}`
]);

// Release files are those that are required
// to use the package as a WP Parent Theme
let releaseFiles = [
    // Plugin/Theme Config
    './config/**/*',
    // Plugin/Theme CSS
    './css/*.css',
    // Plugin Data
    './data/**/*',
    // Plugin/Theme Fonts
    './fonts/**/*',
    // Plugin/Theme Icons
    './icons/**/*',
    // Plugin/Theme Images
    './images/**/*',
    // Plugin/Theme JS
    './js/twentysixteen.js',
    './js/*-es5.js',
    // Theme JS
    './js/inline_scripts_hook.js',
    // Plugin/Theme i18n
    './languages/*.pot',
    // Plugin/Theme Logic/Templates
    './*.php',
    './functions/**/*.php',
    './src/**/*.php',
    './template-parts/**/*.php',
    './templates/**/*.php',
    './views/**/*.php',
    // Theme Screenshot
    './screenshot.png',
    // Theme Stylesheet
    './style.css',
    // Plugin/Theme WP Read Me
    './readme.txt',
    './README.txt',
    // Tiny MCE (WYSIWYG) mods
    './tiny-mce/**/*',
    // Not release changelog
    '!./CHANGELOG.md',
    // Not CSS source maps
    '!./css/maps/**/*',
    // Not demo files
    '!./icons/icomoon/demo-files/**/*'
];

// copy BE Composer dependencies and FE NPM dependencies
// npm prune --production would remove all devDependencies
// but we can't remove wpdtrt-npm-scripts
// which is a dependency as it's still needed
// - and it uses other libraries.
if (composerJson) {
    const boilerplatePath = packageJson.keywords.includes('wordpress-plugin') ? 'vendor/dotherightthing/wpdtrt-plugin-boilerplate/' : '';
    let composerDependencies = {};
    const composerDependenciesLocal = composerJson.require;

    if (typeof composerDependenciesLocal === 'object') {
        composerDependencies = { ...composerDependencies, ...composerDependenciesLocal };

        releaseFiles.push('./vendor/autoload.php');
        releaseFiles.push('./vendor/composer/**/*');

        if (boilerplatePath.length) {
            // extends and variables shared with child plugins
            releaseFiles.push('./scss/**/*.scss');

            // eslint-disable-next-line global-require
            const boilerplateComposerJson = require(`${path.resolve('../../')}/vendor/dotherightthing/wpdtrt-plugin-boilerplate/composer.json`);
            const composerDependenciesBoilerplate = boilerplateComposerJson.require;

            if (typeof composerDependenciesBoilerplate === 'object') {
                composerDependencies = { ...composerDependencies, ...composerDependenciesBoilerplate };
            }
        }
    }

    const composerDependencyNames = Object.keys(composerDependencies);

    composerDependencyNames.forEach(name => {
        releaseFiles.push(`./vendor/${name}/**/*`);
        releaseFiles.push(`!./vendor/${name}/composer.json`);
        releaseFiles.push(`!./vendor/${name}/package.json`);
        releaseFiles.push(`!./vendor/${name}/**/AUTHORS*`);
        releaseFiles.push(`!./vendor/${name}/**/bin*`);
        releaseFiles.push(`!./vendor/${name}/**/CHANGELOG*`);
        releaseFiles.push(`!./vendor/${name}/**/changelog*`);
        releaseFiles.push(`!./vendor/${name}/**/LICENSE*`);
        releaseFiles.push(`!./vendor/${name}/**/README*`);
        releaseFiles.push(`!./vendor/${name}/**/*.json`);
        releaseFiles.push(`!./vendor/${name}/**/*.less`);
        releaseFiles.push(`!./vendor/${name}/**/*.map`);
        releaseFiles.push(`!./vendor/${name}/**/*.md`);
        releaseFiles.push(`!./vendor/${name}/**/*.scss`);
        releaseFiles.push(`!./vendor/${name}/**/*.txt`);
        releaseFiles.push(`!./vendor/${name}/**/*.xml`);
        releaseFiles.push(`!./vendor/${name}/**/*.zip`);
        releaseFiles.push(`!./vendor/${name}/**/test/**/*`);
        releaseFiles.push(`!./vendor/${name}/**/tests/**/*`);
    });
}

const npmDependencies = packageJson.dependencies;

if (typeof npmDependencies === 'object') {
    const npmDependencyNames = Object.keys(npmDependencies);
    const npmDependencyNamesFiltered = npmDependencyNames.filter(name => name !== 'wpdtrt-npm-scripts');

    npmDependencyNamesFiltered.forEach(name => {
        releaseFiles.push(`./node_modules/${name}/**/*`);
        releaseFiles.push(`!./node_modules/${name}/package.json`);
        releaseFiles.push(`!./node_modules/${name}/**/AUTHORS*`);
        releaseFiles.push(`!./node_modules/${name}/**/bin*`);
        releaseFiles.push(`!./node_modules/${name}/**/CHANGELOG*`);
        releaseFiles.push(`!./node_modules/${name}/**/changelog*`);
        releaseFiles.push(`!./node_modules/${name}/**/LICENSE*`);
        releaseFiles.push(`!./node_modules/${name}/**/README*`);
        releaseFiles.push(`!./node_modules/${name}/**/*.json`);
        releaseFiles.push(`!./node_modules/${name}/**/*.less`);
        releaseFiles.push(`!./node_modules/${name}/**/*.map`);
        releaseFiles.push(`!./node_modules/${name}/**/*.md`);
        releaseFiles.push(`!./node_modules/${name}/**/*.scss`);
        releaseFiles.push(`!./node_modules/${name}/**/*.txt`);
        releaseFiles.push(`!./node_modules/${name}/**/*.xml`);
        releaseFiles.push(`!./node_modules/${name}/**/*.zip`);
        releaseFiles.push(`!./node_modules/${name}/**/test/**/*`);
        releaseFiles.push(`!./node_modules/${name}/**/tests/**/*`);
    });
}

let bar = Bar({
    label: 'Copying files',
    info: '',
    append: false,
    show: {
        active: {
            date: false,
            bar: true,
            percent: true, // required for time
            count: false,
            time: true
        },
        overwrite: true,
        bar: {
            length: 20,
            completed: '=',
            incompleted: ' '
        },
        label: {
            color: '\x1b[0;37m' // white
        },
        info: {
            color: '\x1b[0;37m' // white
        },
        time: {
            color: '\x1b[0;37m' // white
        },
        percent: {
            color: '\x1b[0;37m' // white
        },
        count: {
            color: '\x1b[0;37m' // white
        },
        tick: {
            color: '\x1b[0;37m' // white
        }
    }
});

(async () => {
    await cpy(releaseFiles, folderName, {
        cwd: '../../',
        parents: true
    }).on('progress', progress => {
        const completedSize = numeral(progress.completedSize).format('0.0 b');

        if (!totalSet) {
            bar.setTotal(progress.totalFiles);
            totalSet = true;
        }

        // prevent a second bar from displaying the last few %
        // (this makes the file size slightly inaccurate)
        if (!bar.complete) {
            bar.tick(`[${completedSize}]`);
        }
    });
})();
