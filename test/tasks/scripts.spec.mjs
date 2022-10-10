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
    this.timeout(480000);

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
            skip: true,
            uses: {
                cypress: false,
                naturaldocs: true,
                wpunit: false
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
            skip: false,
            uses: {
                cypress: false, // TODO Reenable once CI issues resolved
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
            skip: true,
            uses: {
                cypress: false,
                naturaldocs: true,
                wpunit: true
            }
        }
    ];

    const paths = {
        composer: 'vendor',
        composerConfig: 'composer.json',
        config: [
            '.github/workflows/build-release-tagged.yml',
            'config/naturaldocs/Project.txt',
            'docs',
            '.babelrc',
            '.browserslistrc',
            '.eslintrc',
            '.stylelintignore',
            '.stylelintrc.json',
            'cypress.config.js',
            'nodemon.json',
            'phpcs.xml',
            'phpunit.xml.dist',
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
        scss: [],
        wpUnitWordPress: `${process.env.CI ? process.env.RUNNER_TEMP : tmpdir}/wordpress`,
        wpUnitWordPressTestLibrary: `${process.env.CI ? process.env.RUNNER_TEMP : tmpdir}/wordpress-tests-lib`
    };

    // in tmate:
    // $RUNNER_TEMP
    // bash: /home/runner/work/_temp: Is a directory

    const placeholders = [
        '$packageName',
        '$packageVersion'
    ];

    // stderr output that can be ignored
    // TODO alternatively could revert to try .. catch and test exit code
    // see https://blog.logrocket.com/running-commands-with-execa-in-node-js/
    const warnings = {
        composer: [
            // https://github.com/composer/composer/issues/5961
            './composer.json is valid, but with a few warnings',
            'See https://getcomposer.org/doc/04-schema.md for details on the schema',
            'The version field is present, it is recommended to leave it out if the package is published on Packagist.'
        ]
    };

    apps.forEach(function (app) {
        describeIf(!app.skip, app.id, function () {
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
                    // npm ci installs the exact dependency versions specified in package-lock.json
                    // so update this repo first to ensure that the tests are using the latest code;
                    // this avoids having to manually update wpdtrt-npm-scripts in each repository
                    // before the next version of wpdtrt-npm-scripts is released
                    // note: add #semver:* to load the latest tagged vs latest development version
                    // note: this could be shortened to npm update wpdtrt-npm-scripts if the #semver:* was removed
                    // from each repository's wpdtrt-npm-scripts dependency
                    const command = 'npm remove wpdtrt-npm-scripts && npm install dotherightthing/wpdtrt-npm-scripts --save-dev && npm ci';
                    console.log(command);
                    const { stdout, stderr } = await execaCommandSync(command, { shell: true });

                    // check for node_modules rather than console output
                    // as npm WARN was not being suppressed by --loglevel=silent
                    // neither in the command above
                    // nor in npm run test:internal regardless of mocha's --full-trace flag
                    expect(
                        fs.existsSync(paths.npm),
                        paths.npm
                    ).to.equal(true);
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
                    const command = 'npm run lint';
                    console.log(command);
                    let { stdout, stderr } = await execaCommandSync(command, { shell: true });

                    warnings.composer.forEach(warning => {
                        stderr = stderr.replace(warning, '').replace(/\n$/, '');
                    });

                    expect(
                        stderr.replace(/\n$/, '')
                    ).to.equal('');
                });
            });

            describe('compile', function () {
                it('runs without error and generates the expected files', async function () {
                    const command = 'npm run compile';
                    console.log(command);
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
                    const command = 'npm run version';
                    console.log(command);
                    const { stdout, stderr } = await execaCommandSync(command, { shell: true });

                    // AssertionError: unexpected error: fatal: No names found, cannot describe anything.: expected 'fatal: No names found, cannot describ…' to equal ''
                    // only occurs on CI...
                    // works on local dev..
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
                    const command = 'npm run docs';
                    console.log(command);
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
                    const command = 'npm run release';
                    console.log(command);
                    const { stdout, stderr } = await execaCommandSync(command, { shell: true });

                    // TODO Generating autoload files: expected '-Loading composer repositories with package information' to equal ''
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

                it.skip('uninstall PHP development dependencies', function () {
                    // TODO

                    expect(
                        stderr.replace(/\n$/, ''),
                        `unexpected error: ${stderr.replace(/\n$/, '')}`
                    ).to.equal('');
                });

                it.skip('uninstalls NPM development dependencies', function () {
                    // TODO

                    expect(
                        stderr.replace(/\n$/, ''),
                        `unexpected error: ${stderr.replace(/\n$/, '')}`
                    ).to.equal('');
                });
            });

            // TODO: https://github.com/dotherightthing/wpdtrt-npm-scripts/issues/16

            describe('test', function () {
                if (app.uses.cypress) {
                    it('runs Cypress (JS) tests', async function () {
                        const command = 'npm run test:js';
                        console.log(command);
                        const { stdout, stderr } = await execaCommandSync(command, { shell: true });

                        // CI: AssertionError: [5371:0828/003835.669238:ERROR:gpu_memory_buffer_support_x11.cc(44)] dri3 extension not supported.

                        expect(
                            stderr.replace(/\n$/, ''),
                            stderr.replace(/\n$/, '')
                        ).to.equal('');
                    });
                }

                // disabled on CI due to https://github.com/dotherightthing/wpdtrt-npm-scripts/issues/65
                if (app.uses.wpunit && !process.env.CI) {
                    it('runs WordPress (PHP) unit tests', async function () {
                        const command = 'npm run test';
                        console.log(command);
                        const { stdout, stderr } = await execaCommandSync(command, { shell: true });

                        // expect(
                        //     stdout
                        // ).to.equal('');

                        // expect(
                        //     stderr
                        // ).to.equal('');

                        expect(
                            fs.existsSync(paths.wpUnitWordPress), // directory is not being created (checked with tmate) - why?
                            paths.wpUnitWordPress // /home/runner/work/_temp/wordpress
                        ).to.equal(true);

                        expect(
                            fs.existsSync(paths.wpUnitWordPressTestLibrary),
                            paths.wpUnitWordPressTestLibrary
                        ).to.equal(true);

                        expect(
                            stderr.replace(/\n$/, ''),
                            stderr.replace(/\n$/, '')
                        ).to.equal('');
                    });
                }
            });

            // describe('uninstall', function () {
            //     it('uninstalls without error', async function () {
            //         const command = 'npm uninstall ${library}';
            //         console.log(command);
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
