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

const chai = require('chai');
const { expect } = chai;
const execa = require('execa');
const fs = require('fs');
const mocha = require('mocha');
const osTmpDir = require('os').tmpdir();
const { describe, it } = mocha; // fix eslint no-undef errors

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

/**
 * @function shellCommand
 * @summary Run a shell command.
 * @param {string} command - the command to run
 * @returns {string} err - the error
 */
const shellCommand = command => {
    let err = '';

    // console.log(command);

    try {
        execa.commandSync(command, { shell: true });
        // const { stdout } = await execa.commandSync(command, { shell: true });
        // console.log(stdout);
    } catch (error) {
        err = error.stderr;
    }

    return err;
};

describe('scripts', function () {
    this.timeout(120000);

    const apps = [
        {
            haslibraryDependency: true,
            id: 'wordpress-child-theme',
            name: 'wpdtrt-dbth',
            path: 'vendor/dotherightthing/',
            paths: {
                css: [
                    'css/wpdtrt-dbth-backend.css',
                    'css/wpdtrt-dbth-editor-style.css',
                    'css/wpdtrt-dbth-variables.css'
                ],
                js: [],
                scss: [
                    'scss/_wpdtrt-import.scss'
                ]
            },
            uses: {
                gulpScripts: false,
                naturaldocs: true
            }
        },
        {
            haslibraryDependency: true,
            id: 'wordpress-parent-theme',
            name: 'wpdtrt',
            path: 'vendor/dotherightthing/',
            paths: {
                css: [],
                js: [],
                scss: []
            },
            uses: {
                gulpScripts: false,
                naturaldocs: true
            }
        },
        {
            haslibraryDependency: false,
            id: 'wordpress-plugin',
            name: 'wpdtrt-gallery',
            path: 'vendor/dotherightthing/',
            paths: {
                css: [],
                js: [],
                scss: []
            },
            uses: {
                gulpScripts: false,
                naturaldocs: true,
                wpunit: true
            }
        },
        {
            haslibraryDependency: false,
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

    const packageJson = {
        publisher: process.env.npm_package_homepage.replace('https://github.com/', '').split('/')[0],
        name: process.env.npm_package_homepage.replace('https://github.com/', '').split('/')[1]
    };

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
        wpUnitWordPress: `${osTmpDir}/wordpress`,
        wpUnitWordPressTestLibrary: `${osTmpDir}/wordpress-tests-lib`
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

            // test suite
            describe('check path', function () {
                it('tests run in the correct directory', function () {
                    const re = new RegExp(`${app.path}${app.name}$`, 'g');

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
                    let err;

                    // remove any existing dependency so we can install the latest version
                    if (app.haslibraryDependency) {
                        command += ` && npm uninstall ${packageJson.name} --ignore-scripts`;
                    }

                    // install the latest version
                    command += `&& npm install ${packageJson.publisher}/${packageJson.name} --save`;

                    err = await shellCommand(command);

                    expect(
                        err.replace(/\n$/, ''),
                        err
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
                    const err = await shellCommand('npm run lint');

                    expect(
                        err.replace(/\n$/, ''),
                        err
                    ).to.equal('');
                });
            });

            describe('compile', function () {
                it('runs without error and generates the expected files', async function () {
                    const err = await shellCommand('npm run compile');

                    expect(
                        err.replace(/\n$/, ''),
                        `unexpected error: ${err.replace(/\n$/, '')}`
                    ).to.equal('');

                    paths.css.forEach(function (path) {
                        expect(
                            fs.existsSync(path),
                            path
                        ).to.equal(true);
                    });

                    paths.js.forEach(function (path) {
                        expect(
                            fs.existsSync(path),
                            path
                        ).to.equal(true);
                    });

                    paths.scss.forEach(function (path) {
                        expect(
                            fs.existsSync(path),
                            path
                        ).to.equal(true);
                    });
                });
            });

            describe.skip('version', function () {
                it('runs without error', async function () {
                    const err = await shellCommand('npm run version');

                    expect(
                        err.replace(/\n$/, ''),
                        `unexpected error: ${err.replace(/\n$/, '')}`
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
                    const err = await shellCommand('npm run docs');

                    expect(
                        err.replace(/\n$/, ''),
                        `unexpected error: ${err.replace(/\n$/, '')}`
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
                    const err = await shellCommand('npm run release');

                    expect(
                        err.replace(/\n$/, ''),
                        err.replace(/\n$/, '')
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
                    const err = await shellCommand('npm run test');
                    expect(err.replace(/\n$/, '')).to.equal('');
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
            //         const err = await shellCommand('npm uninstall ${library}');
            //         expect(err.replace(/\n$/, '')).to.equal('');
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
