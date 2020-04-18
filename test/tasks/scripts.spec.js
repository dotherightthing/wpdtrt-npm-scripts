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
            uses: {
                composer: true,
                naturaldocs: true,
                node: true
            }
        }
        // {
        //     haslibraryDependency: true,
        //     id: 'wordpress-parent-theme',
        //     name: 'wpdtrt',
        //     path: 'vendor/dotherightthing/',
        //     uses: {
        //         composer: true,
        //         naturaldocs: true,
        //         node: true
        //     }
        // },
        // {
        //     haslibraryDependency: false,
        //     id: 'wordpress-plugin',
        //     name: 'wpdtrt-gallery',
        //     path: 'vendor/dotherightthing/',
        //     uses: {
        //         composer: true,
        //         naturaldocs: true,
        //         node: true,
        //         wpunit: true
        //     }
        // },
        // {
        //     haslibraryDependency: false,
        //     id: 'wordpress-plugin-boilerplate',
        //     name: 'wpdtrt-plugin-boilerplate',
        //     path: 'vendor/dotherightthing/',
        //     uses: {
        //         composer: true,
        //         naturaldocs: true,
        //         node: true,
        //         wpunit: true
        //     }
        // }
    ];

    const packageJson = {
        publisher: process.env.npm_package_homepage.replace('https://github.com/', '').split('/')[0],
        name: process.env.npm_package_homepage.replace('https://github.com/', '').split('/')[1]
    };

    const paths = {
        composer: 'vendor',
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
        css: [],
        js: [
            'js/frontend-es5.js',
            'js/backend-es5.js'
        ],
        naturaldocs: '.bin/Natural Docs',
        node: 'node_modules',
        scss: [],
        wpUnitWordPress: `${osTmpDir}/wordpress`,
        wpUnitWordPressTestLibrary: `${osTmpDir}/wordpress-tests-lib`
    };

    apps.forEach(function (app) {
        describe(app.id, function () {
            const appPath = `${app.path}${app.name}`;

            paths.css.push(`css/${app.name}.css`);

            if (app.id === 'wpdtrt-child-theme') {
                paths.css.push(`css/${app.name}-backend.css`);
                paths.css.push(`css/${app.name}-editor-style.css`);
                paths.css.push(`css/${app.name}-variables.css`);

                paths.scss.push('scss/_wpdtrt-import.scss');
            }

            // cd that changes process.cwd
            process.chdir(`./${appPath}`);

            describe('check path', function () {
                it('tests run in the correct directory', function () {
                    const re = new RegExp(`${appPath}$`, 'g');

                    expect(
                        `${process.cwd()}`,
                        appPath
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

                    if (app.uses.node) {
                        it('node', function () {
                            expect(
                                fs.existsSync(paths.node),
                                paths.node
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
                it('deletes files from the previous release', function () {
                    expect(
                        fs.existsSync(`${process.cwd()}/${host}/release`),
                        `file or folder missing: ${process.cwd()}/${host}/release`
                    ).to.equal(true);
                });

                it('runs without error', async function () {
                    const err = await shellCommand('npm run release');

                    expect(
                        err.replace(/\n$/, ''),
                        `unexpected error: ${err.replace(/\n$/, '')}`
                    ).to.equal('');
                });

                it('copies release files to a temporary folder', function () {
                    expect(
                        fs.existsSync(`${process.cwd()}/${host}/release`),
                        `file or folder missing: ${process.cwd()}/${host}/release`
                    ).to.equal(true);
                });

                it('generates a release.zip for deployment to Github/Bitbucket', function () {
                    expect(
                        fs.existsSync(`${process.cwd()}/${host}/release.zip`),
                        `file or folder missing: ${process.cwd()}/${host}/release.zip`
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

            // describe('test', function () {
            //     it('runs without error', async function () {
            //         const err = await shellCommand('npm run test');
            //         expect(err.replace(/\n$/, '')).to.equal('');
            //     });

            //     it.skip('runs Cypress uses', function () {
            //         // TODO
            //         expect(stderr.replace(/\n$/, '')).to.equal('');
            //     });

            //     it.skip('runs WordPress unit uses', function () {
            //         // TODO
            //         expect(stderr.replace(/\n$/, '')).to.equal('');
            //     });
            // });

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
