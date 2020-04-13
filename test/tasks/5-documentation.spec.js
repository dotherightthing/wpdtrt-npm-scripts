/**
 * @file ./test/tasks/documentation.spec.js
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

describe('documentation', function () {
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

    const app = 'Natural Docs/NaturalDocs.exe';
    const workingData = 'config/naturaldocs/Working Data';
    const docsFolder = 'docs';
    const docsIndex = `${docsFolder}/index.html`;

    testThemes.forEach(function (testTheme) {
        describe(testTheme.id, function () {
            const theme = `${testTheme.path}${testTheme.name}`;

            describe('install', function () {
                it('installs without error', async function () {
                    const err = await shellCommand(`cd ${theme} && npm ci && npm install ${wnsPub}/${wns} --save`);
                    expect(err.replace(/\n$/, '')).to.equal('');
                });

                it('dependencies are manually installed', async function () {
                    expect(fs.existsSync(`${process.cwd()}/${theme}/${app}`)).to.equal(true);
                });
            });

            describe('docs', function () {
                it('runs without error', async function () {
                    const err = await shellCommand(`cd ${theme} && npm run docs`);
                    console.dir(result);
                    expect(err.replace(/\n$/, '')).to.equal('');
                    expect(fs.existsSync(`${process.cwd()}/${theme}/${docsIndex}`)).to.equal(true);
                    expect(fs.existsSync(`${process.cwd()}/${theme}/${workingData}`)).to.equal(true);
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