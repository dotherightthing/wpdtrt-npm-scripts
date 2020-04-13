/**
 * @file ./test/tasks/release.spec.js
 * @summary Test gulp tasks.
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

describe('release', function () {
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
            path: './vendor/'
        },
        {
            id: 'wordpress-plugin',
            name: 'wordpress-plugin',
            path: './vendor/'
        },
        {
            id: 'wordpress-plugin-boilerplate',
            name: 'wordpress-plugin-boilerplate',
            path: './vendor/'
        }
    ];

    testThemes.forEach(function (testTheme) {
        describe(testTheme.id, function () {
            const theme = `${testTheme.path}${testTheme.name}`;

            describe('install', function () {
                it('installs without error', async function () {
                    const err = await shellCommand(`cd ${theme} && npm ci && npm install ${wnsPub}/${wns} --save`);
                    expect(err.replace(/\n$/, '')).to.equal('');
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

            describe('uninstall', function () {
                it('uninstalls without error', async function () {
                    const err = await shellCommand(`cd ${theme} && npm uninstall ${wns}`);
                    expect(err.replace(/\n$/, '')).to.equal('');
                });
            });
        });
    });
});
