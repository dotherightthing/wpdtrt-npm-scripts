/**
 * @file ./test/tasks/install.spec.js
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
