/**
 * @file ./test/tasks/scripts.spec.js
 * @summary Test tasks which install.
 * @description
 * Note:
 * - Tests are run in project root
 * - In tested code, console.error/warn Prints to stderr with newline, so will cause test to fail when checking against stderr
 * - In tested code, console.log Prints to stdout with newline, so won't cause test to fail when checking against stderr
 * @example
 * npm run test:internal
 */

/* eslint-disable func-names, no-undef, no-console, no-unused-vars */

const chai = require('chai');
const { expect } = chai;
const execa = require('execa');
const fs = require('fs');
const mocha = require('mocha');
const { describe, it } = mocha; // fix eslint no-undef errors

/**
 * @function shellCommand
 * @summary Run a shell command.
 * @param {string} command - the command to run
 * @returns {string} err - the error
 */
const shellCommand = async (command) => {
    let err = '';

    try {
        await execa.commandSync(command, { shell: true });
        // const { stdout } = await execa.commandSync(command, { shell: true });
        // console.log(stdout);
    } catch (error) {
        err = error.stderr;
    }

    return err;
};

describe('scripts', function () {
    this.timeout(120000);

    const wnsPub = 'dotherightthing';
    const wns = 'wpdtrt-npm-scripts';

    const testThemes = [
        {
            id: 'wordpress-child-theme',
            name: 'wpdtrt-dbth',
            path: './vendor/dotherightthing/',
            hasWnsDependency: true
        }
        // {
        //     id: 'wordpress-parent-theme',
        //     name: 'wpdtrt',
        //     path: './vendor/dotherightthing/',
        //     hasWnsDependency: true
        // },
        // {
        //     id: 'wordpress-plugin',
        //     name: 'wpdtrt-gallery',
        //     path: './vendor/dotherightthing/',
        //     hasWnsDependency: false
        // },
        // {
        //     id: 'wordpress-plugin-boilerplate',
        //     name: 'wpdtrt-plugin-boilerplate',
        //     path: './vendor/dotherightthing/',
        //     hasWnsDependency: false
        // }
    ];

    const configFiles = [
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
    ];

    const cssFolder = 'css';
    const jsFolder = 'js';
    const scssFolder = 'scss';

    const composerFolder = 'vendor';
    // const naturalDocsFolder = 'Natural Docs';
    const npmFolder = 'node_modules';

    testThemes.forEach(function (testTheme) {
        describe(testTheme.id, function () {
            const theme = `${testTheme.path}${testTheme.name}`;

            describe('install', function () {
                it('installs without error', async function () {
                    let command = `cd ${theme} && npm ci`;

                    // remove any existing dependency
                    // so we can install the latest version
                    if (testTheme.hasWnsDependency) {
                        command += ` && npm uninstall ${wns} --ignore-scripts`;
                    }

                    // install the latest version
                    command += ` && npm install ${wnsPub}/${wns} --save`;

                    const err = await shellCommand(command);

                    expect(
                        err.replace(/\n$/, ''),
                        `unexpected error: ${err.replace(/\n$/, '')}`
                    ).to.equal('');
                });
            });

            describe('install dependencies', function () {
                it('installs all dependencies', async function () {
                    if (testTheme.id === 'wordpress-child-theme') {
                        // TODO test if Natural Docs were generated

                        expect(
                            fs.existsSync(`${process.cwd()}/${theme}/${composerFolder}`),
                            `expected folder missing: ${process.cwd()}/${theme}/${composerFolder}`
                        ).to.equal(true);

                        expect(
                            fs.existsSync(`${process.cwd()}/${theme}/${npmFolder}`),
                            `expected folder missing: ${process.cwd()}/${theme}/${npmFolder}`
                        ).to.equal(true);
                    } else if (testTheme.id === 'wordpress-plugin-boilerplate') {
                        // TODO test if test database was created

                        expect(
                            fs.existsSync(`${process.cwd()}/${theme}/${composerFolder}`),
                            `expected folder missing: ${process.cwd()}/${theme}/${composerFolder}`
                        ).to.equal(true);

                        expect(
                            fs.existsSync(`${process.cwd()}/${theme}/${npmFolder}`),
                            `expected folder missing: ${process.cwd()}/${theme}/${npmFolder}`
                        ).to.equal(true);

                        expect(
                            fs.existsSync(`${os.tmpdir()}/wordpress`),
                            `expected folder missing: ${os.tmpdir()}/wordpress`
                        ).to.equal(true);

                        expect(
                            fs.existsSync(`${os.tmpdir()}/wordpress-tests-lib`),
                            `expected folder missing: ${os.tmpdir()}/wordpress-tests-lib`
                        ).to.equal(true);
                    }
                });
            });

            describe('install config', function () {
                it('copies all config files', async function () {
                    configFiles.forEach(function (configFile) {
                        expect(
                            fs.existsSync(`${process.cwd()}/${theme}/${configFile}`),
                            `file or folder missing: ${process.cwd()}/${theme}/${configFile}`
                        ).to.equal(true);
                    });
                });
            });

            describe('lint', function () {
                it('runs without error', async function () {
                    const err = await shellCommand(`cd ${theme} && npm run lint`);

                    expect(
                        err.replace(/\n$/, ''),
                        `unexpected error: ${err.replace(/\n$/, '')}`
                    ).to.equal('');
                });
            });

            describe('compile', function () {
                it('runs without error and generates the expected files', async function () {
                    const err = await shellCommand(`cd ${theme} && npm run compile`);

                    expect(
                        err.replace(/\n$/, ''),
                        `unexpected error: ${err.replace(/\n$/, '')}`
                    ).to.equal('');

                    let paths = [
                        `${cssFolder}/${testTheme.name}.css`,
                        `${jsFolder}/frontend-es5.js`,
                        `${jsFolder}/backend-es5.js`
                    ];

                    paths.forEach(function (path) {
                        expect(
                            fs.existsSync(`${process.cwd()}/${theme}/${path}`),
                            `file or folder missing: ${process.cwd()}/${theme}/${path}`
                        ).to.equal(true);
                    });

                    if (testTheme.id === 'wpdtrt-child-theme') {
                        expect(
                            fs.existsSync(`${process.cwd()}/${theme}/${scssFolder}/_wpdtrt-import.scss`),
                            `file or folder missing: ${process.cwd()}/${theme}/${scssFolder}/_wpdtrt-import.scss`
                        ).to.equal(true);
                    }
                });
            });

            describe('version', function () {
                it('runs without error', async function () {
                    const err = await shellCommand(`cd ${theme} && npm run version`);

                    expect(
                        err.replace(/\n$/, ''),
                        `unexpected error: ${err.replace(/\n$/, '')}`
                    ).to.equal('');
                });

                it.skip('regenerates the list of PHP classes to be autoloaded', async function () {
                    // TODO
                });

                it.skip('replaces version strings, using the version set in package.json', async function () {
                    // TODO
                });

                it.skip('updates the boilerplate dependency to the latest version', async function () {
                    // TODO
                });
            });

            describe('docs', function () {
                it('dependencies are manually installed', async function () {
                    expect(
                        fs.existsSync(`${process.cwd()}/${theme}/${app}`),
                        `file or folder missing: ${process.cwd()}/${theme}/${app}`
                    ).to.equal(true);
                });

                it('runs without error', async function () {
                    const err = await shellCommand(`cd ${theme} && npm run docs`);
                    console.dir(result);

                    expect(
                        err.replace(/\n$/, ''),
                        `unexpected error: ${err.replace(/\n$/, '')}`
                    ).to.equal('');

                    expect(
                        fs.existsSync(`${process.cwd()}/${theme}/${docsIndex}`),
                        `file or folder missing: ${process.cwd()}/${theme}/${docsIndex}`
                    ).to.equal(true);

                    expect(
                        fs.existsSync(`${process.cwd()}/${theme}/${workingData}`),
                        `file or folder missing: ${process.cwd()}/${theme}/${workingData}`
                    ).to.equal(true);
                });
            });

            describe('release', function () {
                it('deletes files from the previous release', async function () {
                    expect(
                        fs.existsSync(`${process.cwd()}/${theme}/release`),
                        `file or folder missing: ${process.cwd()}/${theme}/release`
                    ).to.equal(true);
                });

                it('runs without error', async function () {
                    const err = await shellCommand(`cd ${theme} && npm run release`);
                    console.dir(result);

                    expect(
                        err.replace(/\n$/, ''),
                        `unexpected error: ${err.replace(/\n$/, '')}`
                    ).to.equal('');
                });

                it('copies release files to a temporary folder', async function () {
                    expect(
                        fs.existsSync(`${process.cwd()}/${theme}/release`),
                        `file or folder missing: ${process.cwd()}/${theme}/release`
                    ).to.equal(true);
                });

                it('generates a release.zip for deployment to Github/Bitbucket', async function () {
                    expect(
                        fs.existsSync(`${process.cwd()}/${theme}/release.zip`),
                        `file or folder missing: ${process.cwd()}/${theme}/release.zip`
                    ).to.equal(true);
                });

                it.skip('uninstall PHP development dependencies', async function () {
                    // TODO

                    expect(
                        err.replace(/\n$/, ''),
                        `unexpected error: ${err.replace(/\n$/, '')}`
                    ).to.equal('');
                });

                it.skip('uninstalls NPM development dependencies', async function () {
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
            //         const err = await shellCommand(`cd ${theme} && npm run test`);
            //         expect(err.replace(/\n$/, '')).to.equal('');
            //     });

            //     it.skip('runs Cypress tests', async function () {
            //         // TODO
            //         expect(stderr.replace(/\n$/, '')).to.equal('');
            //     });

            //     it.skip('runs WordPress unit tests', async function () {
            //         // TODO
            //         expect(stderr.replace(/\n$/, '')).to.equal('');
            //     });
            // });

            // describe('uninstall', function () {
            //     it('uninstalls without error', async function () {
            //         const err = await shellCommand(`cd ${theme} && npm uninstall ${wns}`);
            //         expect(err.replace(/\n$/, '')).to.equal('');
            //     });

            //     it('deletes all config files', async function () {
            //         configFiles.forEach(function (configFile) {
            //             expect(fs.existsSync(`${process.cwd()}/${theme}/${configFile}`)).to.equal(false);
            //         });
            //     });
            // });
        });
    });
});
