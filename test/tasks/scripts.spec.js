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

describe('install', function () {
    this.timeout(120000);

    const wnsPub = 'dotherightthing';
    const wns = 'wpdtrt-npm-scripts';

    const testThemes = [
        {
            id: 'wordpress-child-theme',
            name: 'wpdtrt-dbth',
            path: './vendor/dotherightthing/'
        },
        {
            id: 'wordpress-parent-theme',
            name: 'wordpress-parent-theme',
            path: './vendor/dotherightthing/'
        },
        {
            id: 'wordpress-plugin',
            name: 'wordpress-plugin',
            path: './vendor/dotherightthing/'
        },
        {
            id: 'wordpress-plugin-boilerplate',
            name: 'wordpress-plugin-boilerplate',
            path: './vendor/dotherightthing/'
        }
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
                    const err = await shellCommand(`cd ${theme} && npm ci && npm install ${wnsPub}/${wns} --save`);
                    expect(err.replace(/\n$/, '')).to.equal('');
                });

                it('installs all dependencies', async function () {
                    if (testTheme.id === 'wordpress-child-theme') {
                        // TODO test if Natural Docs were generated
                        expect(fs.existsSync(`${process.cwd()}/${theme}/${composerFolder}`)).to.equal(true);
                        expect(fs.existsSync(`${process.cwd()}/${theme}/${npmFolder}`)).to.equal(true);
                    } else if (testTheme.id === 'wordpress-plugin-boilerplate') {
                        // TODO test if test database was created
                        expect(fs.existsSync(`${process.cwd()}/${theme}/${composerFolder}`)).to.equal(true);
                        expect(fs.existsSync(`${process.cwd()}/${theme}/${npmFolder}`)).to.equal(true);
                        expect(fs.existsSync(`${os.tmpdir()}/wordpress`)).to.equal(true);
                        expect(fs.existsSync(`${os.tmpdir()}/wordpress-tests-lib`)).to.equal(true);
                    }
                });

                it('copies all config files', async function () {
                    configFiles.forEach(function (configFile) {
                        expect(fs.existsSync(`${process.cwd()}/${theme}/${configFile}`)).to.equal(true);
                    });
                });
            });

            describe('lint', function () {
                it('runs without error', async function () {
                    const err = await shellCommand(`cd ${theme} && npm run lint`);
                    expect(err.replace(/\n$/, '')).to.equal('');
                });
            });

            describe('compile', function () {
                it('runs without error and generates the expected files', async function () {
                    const err = await shellCommand(`cd ${theme} && npm run compile`);
                    expect(err.replace(/\n$/, '')).to.equal('');

                    expect(fs.existsSync(`${process.cwd()}/${theme}/${cssFolder}/${themeName}.css`)).to.equal(true);
                    expect(fs.existsSync(`${process.cwd()}/${theme}/${jsFolder}/frontend-es5.js`)).to.equal(true);
                    expect(fs.existsSync(`${process.cwd()}/${theme}/${jsFolder}/backend-es5.js`)).to.equal(true);

                    if (testTheme.id === 'wpdtrt-child-theme') {
                        expect(fs.existsSync(`${process.cwd()}/${theme}/${scssFolder}/_wpdtrt-import.scss`)).to.equal(true);
                    }
                });
            });

            describe('version', function () {
                it('runs without error', async function () {
                    const err = await shellCommand(`cd ${theme} && npm run version`);
                    expect(err.replace(/\n$/, '')).to.equal('');
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
                    expect(fs.existsSync(`${process.cwd()}/${theme}/${app}`)).to.equal(true);
                });

                it('runs without error', async function () {
                    const err = await shellCommand(`cd ${theme} && npm run docs`);
                    console.dir(result);
                    expect(err.replace(/\n$/, '')).to.equal('');
                    expect(fs.existsSync(`${process.cwd()}/${theme}/${docsIndex}`)).to.equal(true);
                    expect(fs.existsSync(`${process.cwd()}/${theme}/${workingData}`)).to.equal(true);
                });
            });

            describe('release', function () {
                it('deletes files from the previous release', async function () {
                    expect(fs.existsSync(`${process.cwd()}/${theme}/release`)).to.equal(false);
                });

                it('runs without error', async function () {
                    const err = await shellCommand(`cd ${theme} && npm run release`);
                    console.dir(result);
                    expect(err.replace(/\n$/, '')).to.equal('');
                });

                it('copies release files to a temporary folder', async function () {
                    expect(fs.existsSync(`${process.cwd()}/${theme}/release`)).to.equal(true);
                });

                it('generates a release.zip for deployment to Github/Bitbucket', async function () {
                    expect(fs.existsSync(`${process.cwd()}/${theme}/release.zip`)).to.equal(true);
                });

                it.skip('uninstall PHP development dependencies', async function () {
                    // TODO
                    expect(stderr.replace(/\n$/, '')).to.equal('');
                });

                it.skip('uninstalls NPM development dependencies', async function () {
                    // TODO
                    expect(stderr.replace(/\n$/, '')).to.equal('');
                });
            });

            describe('test', function () {
                it('runs without error', async function () {
                    const err = await shellCommand(`cd ${theme} && npm run test`);
                    expect(err.replace(/\n$/, '')).to.equal('');
                });

                it.skip('runs Cypress tests', async function () {
                    // TODO
                    expect(stderr.replace(/\n$/, '')).to.equal('');
                });

                it.skip('runs WordPress unit tests', async function () {
                    // TODO
                    expect(stderr.replace(/\n$/, '')).to.equal('');
                });
            });

            describe('uninstall', function () {
                it('uninstalls without error', async function () {
                    const err = await shellCommand(`cd ${theme} && npm uninstall ${wns}`);
                    expect(err.replace(/\n$/, '')).to.equal('');
                });

                it('deletes all config files', async function () {
                    configFiles.forEach(function (configFile) {
                        expect(fs.existsSync(`${process.cwd()}/${theme}/${configFile}`)).to.equal(false);
                    });
                });
            });
        });
    });
});
