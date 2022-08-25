/**
 * @file ./test/tasks/scripts.spec.js
 * @summary Test tasks which install.
 * @description
 * Note:
 * - uses are run in project root
 * - In tested code, console.error/warn Prints to stderr with newline, so will cause test to fail when checking against stderr
 * - In tested code, console.log Prints to stdout with newline, so won't cause test to fail when checking against stderr
 *
 * @see https://www.chaijs.com/api/bdd/
 * @see https://www.chaijs.com/api/assert/
 * @example
 * npm run test
 *
 * @example
 * // To resolve intermittent node-gyp errors
 * // see https://github.com/schnerd/d3-scale-cluster/issues/7
 * sudo rm -rf $(xcode-select -print-path)
 * xcode-select --install
 * // or
 * sudo xcode-select --reset
 *
 * @todo The second app test runs immediately, changing the directory and failing the first app
 */

/* eslint-disable func-names, no-undef, no-console, no-unused-vars */

import { expect } from 'chai';
import { execaCommandSync } from 'execa';
import * as fs from 'node:fs';
import { tmpdir } from 'os';
import { describe, it } from 'mocha'; // fix eslint no-undef errors

/**
 * @function describeIf
 * @param {boolean} condition - Condition required to run test
 * @param {string} title - Test title
 * @param {Function} test - The test
 * @returns {Function} test
 * @see https://stackoverflow.com/a/48817596/6850747
 */
function describeIf(condition, title, test) {
    return condition ? describe(title, test) : describe.skip(title, test);
}

describe('scripts', function () {
    this.timeout(120000);

    const apps = [
        {
            id: 'wordpress-theme',
            name: 'wpdtrt-dbth',
            path: 'vendor/dotherightthing/',
            paths: {
                css: [
                    'css/wpdtrt-dbth-backend.css',
                    'css/wpdtrt-dbth-editor-style.css',
                    'css/wpdtrt-dbth-variables.css'
                ],
                js: [],
                scss: []
            },
            uses: {
                gulpScripts: false,
                naturaldocs: true
            }
        },
        {
            id: 'wordpress-plugin',
            name: 'wpdtrt-gallery',
            path: 'vendor/dotherightthing/',
            paths: {
                css: [],
                js: [],
                scss: []
            },
            uses: {
                gulpScripts: true, // see #23
                naturaldocs: true,
                wpunit: true
            }
        },
        {
            id: 'wordpress-plugin-boilerplate',
            name: 'wpdtrt-plugin-boilerplate',
            path: 'vendor/dotherightthing/',
            paths: {
                css: [],
                js: [],
                scss: []
            },
            uses: {
                gulpScripts: true,
                naturaldocs: true,
                wpunit: true
            }
        }
    ];

    const paths = {
        composer: 'vendor',
        composerConfig: 'composer.json',
        config: [
            'config/naturaldocs/Project.txt',
            'docs',
            '.babelrc',
            '.browserslistrc',
            '.eslintrc',
            '.stylelintignore',
            '.stylelintrc.json',
            'nodemon.json',
            'phpcs.xml',
            'postcss.config.js'
        ],
        configsContainingPlaceholders: [
            'config/naturaldocs/Project.txt'
        ],
        css: [],
        js: [
            'js/frontend-es5.js',
            'js/backend-es5.js'
        ],
        naturaldocs: '.bin/Natural Docs',
        npm: 'node_modules',
        npmConfig: 'package.json',
        release: 'release',
        releaseZip: 'release.zip',
        scss: [],
        wpUnitWordPress: `${tmpdir}/wordpress`,
        wpUnitWordPressTestLibrary: `${tmpdir}/wordpress-tests-lib`
    };

    const placeholders = [
        '$packageName',
        '$packageVersion'
    ];

    apps.forEach(function (app) {
        describeIf(!app.uses.gulpScripts, app.id, function () {
            before(function () {
                // cd for process.cwd
                process.chdir(`./${app.path}${app.name}`);

                // update paths.css object
                app.paths.css = [ `css/${app.name}.css`, ...paths.css, ...app.paths.css ];

                // update paths.js object
                app.paths.js = [ ...paths.js, ...app.paths.js ];

                // update paths.scss object
                app.paths.scss = [ ...paths.scss, ...app.paths.scss ];

                // update uses object
                app.uses.composer = fs.existsSync(paths.composerConfig);
                app.uses.npm = fs.existsSync(paths.npmConfig);
            });

            after(function () {
                // cd for process.cwd
                process.chdir('../../../');
            });

            // test suite
            describe('check path', function () {
                it('tests run in the correct directory', function () {
                    const re = new RegExp(`wpdtrt-npm-scripts/${app.path}${app.name}$`, 'g');

                    expect(
                        `${process.cwd()}`,
                        `${app.path}${app.name}`
                    ).to.match(re);
                });

                // it('contains correct directory', function () {
                //     let dir = `${process.cwd()}/${paths.foo}`;

                //     // https://nodejs.org/api/fs.html
                //     fs.stat(dir, function (err, stats) {
                //         expect(
                //             stats.isDirectory(),
                //             dir
                //         ).to.equal(true);
                //
                //         // and/or
                //
                //         // expect(
                //         //     err,
                //         //     dir
                //         // ).to.equal(null);
                //     });
                // });
            });

            describe('install', function () {
                it('install', async function () {
                    let command = 'npm ci';
                    const { stdout, stderr } = await execaCommandSync(command, { shell: true });

                    expect(
                        stderr.replace(/\n$/, ''),
                        stderr
                    ).to.equal('');
                });

                describe('dependencies', function () {
                    if (app.uses.composer) {
                        it('composer', function () {
                            expect(
                                fs.existsSync(paths.composer),
                                paths.composer
                            ).to.equal(true);
                        });
                    }

                    if (app.uses.naturaldocs) {
                        it.skip('naturaldocs', function () {
                            expect(
                                fs.existsSync(paths.naturaldocs),
                                paths.naturaldocs
                            ).to.equal(true);
                        });
                    }

                    if (app.uses.npm) {
                        it('npm', function () {
                            expect(
                                fs.existsSync(paths.npm),
                                paths.npm
                            ).to.equal(true);
                        });
                    }

                    if (app.uses.wpunit) {
                        it('wpunit', function () {
                            expect(
                                fs.existsSync(paths.wpUnitWordPress),
                                paths.wpUnitWordPress
                            ).to.equal(true);

                            expect(
                                fs.existsSync(paths.wpUnitWordPressTestLibrary),
                                paths.wpUnitWordPressTestLibrary
                            ).to.equal(true);
                        });
                    }
                });

                describe('config', function () {
                    it('copies all config files', function () {
                        paths.config.forEach(function (configFile) {
                            expect(
                                fs.existsSync(configFile),
                                configFile
                            ).to.equal(true);
                        });
                    });

                    it('replaces placeholders in config files', function (done) {
                        paths.configsContainingPlaceholders.forEach(function (configContainingPlaceholders) {
                            placeholders.forEach(function (placeholder) {
                                let re = new RegExp(`\\${placeholder}`, 'g');

                                expect(
                                    fs.readFileSync(configContainingPlaceholders, 'utf8'),
                                    placeholder
                                ).to.not.match(re);
                            });
                        });

                        done();
                    });
                });
            });

            describe('lint', function () {
                it('runs without error', async function () {
                    let command = 'npm run lint';
                    const { stdout, stderr } = await execaCommandSync(command, { shell: true });

                    expect(
                        stderr.replace(/\n$/, ''),
                        stderr
                    ).to.equal('');
                });
            });

            describe('compile', function () {
                it('runs without error and generates the expected files', async function () {
                    let command = 'npm run compile';
                    const { stdout, stderr } = await execaCommandSync(command, { shell: true });

                    expect(
                        stderr.replace(/\n$/, ''),
                        `unexpected error: ${stderr.replace(/\n$/, '')}`
                    ).to.equal('');

                    paths.css.forEach(function (pth) {
                        expect(
                            fs.existsSync(pth),
                            pth
                        ).to.equal(true);
                    });

                    paths.js.forEach(function (pth) {
                        expect(
                            fs.existsSync(pth),
                            pth
                        ).to.equal(true);
                    });

                    paths.scss.forEach(function (pth) {
                        expect(
                            fs.existsSync(pth),
                            pth
                        ).to.equal(true);
                    });
                });
            });

            describe.skip('version', function () {
                it('runs without error', async function () {
                    let command = 'npm run version';
                    const { stdout, stderr } = await execaCommandSync(command, { shell: true });

                    expect(
                        stderr.replace(/\n$/, ''),
                        `unexpected error: ${stderr.replace(/\n$/, '')}`
                    ).to.equal('');
                });

                it.skip('regenerates the list of PHP classes to be autoloaded', function () {
                    // TODO
                });

                it.skip('replaces version strings, using the version set in package.json', function () {
                    // TODO
                });

                it.skip('updates the boilerplate dependency to the latest version', function () {
                    // TODO
                });
            });

            describe.skip('docs', function () {
                it('runs without error', async function () {
                    let command = 'npm run docs';
                    const { stdout, stderr } = await execaCommandSync(command, { shell: true });

                    expect(
                        stderr.replace(/\n$/, ''),
                        `unexpected error: ${stderr.replace(/\n$/, '')}`
                    ).to.equal('');

                    expect(
                        fs.existsSync(`${process.cwd()}/${host}/${docsIndex}`),
                        `file or folder missing: ${process.cwd()}/${host}/${docsIndex}`
                    ).to.equal(true);

                    expect(
                        fs.existsSync(`${process.cwd()}/${host}/${workingData}`),
                        `file or folder missing: ${process.cwd()}/${host}/${workingData}`
                    ).to.equal(true);
                });
            });

            describe.skip('release', function () {
                // it('deletes files from the previous release', function () {
                //     expect(
                //         fs.existsSync(paths.release),
                //         paths.release
                //     ).to.equal(false);
                // });

                it('runs without error', async function () {
                    let command = 'npm run release';
                    const { stdout, stderr } = await execaCommandSync(command, { shell: true });

                    expect(
                        stderr.replace(/\n$/, ''),
                        stderr.replace(/\n$/, '')
                    ).to.equal('');
                });

                it('copies release files to a temporary folder', function () {
                    expect(
                        fs.existsSync(paths.release),
                        paths.release
                    ).to.equal(true);
                });

                it('generates a release.zip for deployment to Github/Bitbucket', function () {
                    expect(
                        fs.existsSync(paths.releaseZip),
                        paths.releaseZip
                    ).to.equal(true);
                });

                it.skip('uninstall PHP development dependencies', function () {
                    // TODO

                    expect(
                        err.replace(/\n$/, ''),
                        `unexpected error: ${err.replace(/\n$/, '')}`
                    ).to.equal('');
                });

                it.skip('uninstalls NPM development dependencies', function () {
                    // TODO

                    expect(
                        err.replace(/\n$/, ''),
                        `unexpected error: ${err.replace(/\n$/, '')}`
                    ).to.equal('');
                });
            });

            // TODO: https://github.com/dotherightthing/wpdtrt-npm-scripts/issues/16

            describe('test', function () {
                it('runs without error', async function () {
                    let command = 'npm run test';
                    const { stdout, stderr } = await execaCommandSync(command, { shell: true });
                    expect(stderr.replace(/\n$/, '')).to.equal('');
                });

                it.skip('runs Cypress tests', function () {
                    // TODO
                    expect(stderr.replace(/\n$/, '')).to.equal('');
                });

                it.skip('runs WordPress unit tests', function () {
                    // TODO
                    expect(stderr.replace(/\n$/, '')).to.equal('');
                });
            });

            // describe('uninstall', function () {
            //     it('uninstalls without error', async function () {
            //         let command = 'npm uninstall ${library}';
            //         const { stdout, stderr } = await execaCommandSync(command);
            //         expect(stderr.replace(/\n$/, '')).to.equal('');
            //     });

            //     it('deletes all config files', function () {
            //         paths.config.forEach(function (configFile) {
            //             expect(fs.existsSync(`${process.cwd()}/${host}/${configFile}`)).to.equal(false);
            //         });
            //     });
            // });
        });
    });
});