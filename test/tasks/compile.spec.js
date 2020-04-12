/**
 * @file ./test/tasks/compile.spec.js
 * @summary Test tasks which compile.
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
const del = require('del');
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

describe('compile', function () {
    this.timeout(120000);

    const cssFolder = 'css';
    const jsFolder = 'js';
    const scssFolder = 'scss';

    // WordPress Child Theme

    describe.only('wordpress-child-theme', function () {
        const themeName = 'wpdtrt-dbth';
        const theme = `./test/fixtures/dotherightthing/${themeName}`;
        const gulpfile = './gulpfile--wordpress-child-theme.js';

        before('clean up test files', async function () {
            await del(`${theme}/${cssFolder}`);
            await del(`${theme}/${jsFolder}/*-es5.js`);
            await del(`${theme}/${scssFolder}/_wpdtrt-import.scss`);
        });

        describe('series', function () {
            it('runs without error', async function () {
                const err = await shellCommand(`./node_modules/.bin/gulp compile --gulpfile ${gulpfile} --cwd ${theme}`);
                expect(err.replace(/\n$/, '')).to.equal('');
            });
        });

        describe('css', function () {
            it('generates _wpdtrt-import.scss', async function () {
                const err = await shellCommand(`./node_modules/.bin/gulp compileCssWpdtrtDynamicImport --gulpfile ${gulpfile} --cwd ${theme}`);
                expect(err.replace(/\n$/, '')).to.equal('');
                expect(fs.existsSync(`${process.cwd()}/${theme}/${scssFolder}/_wpdtrt-import.scss`)).to.equal(true);
            });

            it('compiles scss files into css', async function () {
                const err = await shellCommand(`./node_modules/.bin/gulp compileCss --gulpfile ${gulpfile} --cwd ${theme}`);
                expect(err.replace(/\n$/, '')).to.equal('');
                expect(fs.existsSync(`${process.cwd()}/${theme}/${cssFolder}/${themeName}.css`)).to.equal(true);
            });
        });

        describe('js', function () {
            it('transpiles frontend.js to ES5', async function () {
                const err = await shellCommand(`./node_modules/.bin/gulp compileJs --gulpfile ${gulpfile} --cwd ${theme}`);
                expect(err.replace(/\n$/, '')).to.equal('');
                expect(fs.existsSync(`${process.cwd()}/${theme}/${jsFolder}/frontend-es5.js`)).to.equal(true);
            });

            it('transpiles backend.js to ES5', async function () {
                const err = await shellCommand(`./node_modules/.bin/gulp compileJs --gulpfile ${gulpfile} --cwd ${theme}`);
                expect(err.replace(/\n$/, '')).to.equal('');
                expect(fs.existsSync(`${process.cwd()}/${theme}/${jsFolder}/backend-es5.js`)).to.equal(true);
            });
        });
    });

    // WordPress Parent Theme

    describe('wordpress-parent-theme', function () {
        const theme = './test/fixtures/wordpress-parent-theme';

        beforeEach('clean up test files', async function () {
            await del(`${theme}/${cssFolder}`);
            await del(`${theme}/${jsFolder}/*-es5.js`);
        });

        describe('series', function () {
            it('runs without error', async function () {
                const err = await shellCommand(`./node_modules/.bin/gulp compile --gulpfile ${gulpfile} --cwd ${theme}`);
                expect(err.replace(/\n$/, '')).to.equal('');
            });
        });

        describe('css', function () {
            it('compiles scss files into css', async function () {
                const err = await shellCommand(`./node_modules/.bin/gulp compileCss --gulpfile ${gulpfile} --cwd ${theme}`);
                expect(err.replace(/\n$/, '')).to.equal('');
                expect(fs.existsSync(`${process.cwd()}/${theme}/${cssFolder}/theme.css`)).to.equal(true);
            });
        });

        describe('js', function () {
            it('transpiles frontend.js to ES5', async function () {
                const err = await shellCommand(`./node_modules/.bin/gulp compileJs --gulpfile ${gulpfile} --cwd ${theme}`);
                expect(err.replace(/\n$/, '')).to.equal('');
                expect(fs.existsSync(`${process.cwd()}/${theme}/${jsFolder}/frontend-es5.js`)).to.equal(true);
            });

            it('transpiles backend.js to ES5', async function () {
                const err = await shellCommand(`./node_modules/.bin/gulp compileJs --gulpfile ${gulpfile} --cwd ${theme}`);
                expect(err.replace(/\n$/, '')).to.equal('');
                expect(fs.existsSync(`${process.cwd()}/${theme}/${jsFolder}/backend-es5.js`)).to.equal(true);
            });
        });
    });

    // WordPress Plugin

    describe('wordpress-plugin', function () {
        const theme = './test/fixtures/wordpress-plugin';

        beforeEach('clean up test files', async function () {
            await del(`${theme}/${cssFolder}`);
            await del(`${theme}/${jsFolder}/*-es5.js`);
        });

        describe('series', function () {
            it('runs without error', async function () {
                const err = await shellCommand(`./node_modules/.bin/gulp compile --gulpfile ${gulpfile} --cwd ${theme}`);
                expect(err.replace(/\n$/, '')).to.equal('');
            });
        });

        describe('css', function () {
            it('compiles scss files into css', async function () {
                const err = await shellCommand(`./node_modules/.bin/gulp compileCss --gulpfile ${gulpfile} --cwd ${theme}`);
                expect(err.replace(/\n$/, '')).to.equal('');
                expect(fs.existsSync(`${process.cwd()}/${theme}/${cssFolder}/theme.css`)).to.equal(true);
            });
        });

        describe('js', function () {
            it('transpiles frontend.js to ES5', async function () {
                const err = await shellCommand(`./node_modules/.bin/gulp compileJs --gulpfile ${gulpfile} --cwd ${theme}`);
                expect(err.replace(/\n$/, '')).to.equal('');
                expect(fs.existsSync(`${process.cwd()}/${theme}/${jsFolder}/frontend-es5.js`)).to.equal(true);
            });

            it('transpiles backend.js to ES5', async function () {
                const err = await shellCommand(`./node_modules/.bin/gulp compileJs --gulpfile ${gulpfile} --cwd ${theme}`);
                expect(err.replace(/\n$/, '')).to.equal('');
                expect(fs.existsSync(`${process.cwd()}/${theme}/${jsFolder}/backend-es5.js`)).to.equal(true);
            });
        });
    });

    // WordPress Parent Theme

    describe('wordpress-plugin-boilerplate', function () {
        const theme = './test/fixtures/wordpress-plugin-boilerplate';

        beforeEach('clean up test files', async function () {
            await del(`${theme}/${cssFolder}`);
            await del(`${theme}/${jsFolder}/*-es5.js`);
        });

        // it does not compile
    });
});
