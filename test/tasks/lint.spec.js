/**
 * File: test/tasks/lint.spec.js
 *
 * Test gulp tasks.
 *
 * Note:
 * - Tests are run in project root
 * - In tested code, console.error/warn Prints to stderr with newline, so will cause test to fail when checking against stderr
 * - In tested code, console.log Prints to stdout with newline, so won't cause test to fail when checking against stderr
 *
 * ---
 * npm run tests
 * ---
 */

const chai = require( 'chai' );
const { expect } = chai;
const execa = require( 'execa' );
const mocha = require( 'mocha' );
const { describe, it } = mocha; // fix eslint no-undef errors

const composer = require( '../../tasks/lint/composer' );
const css = require( '../../tasks/lint/css' );
const js = require( '../../tasks/lint/js' );
const php = require( '../../tasks/lint/php' );

// https://labs.chiedo.com/post/async-mocha-tests/
const mochaAsync = (fn) => {
  return done => {
    fn.call().then(done, err => {
      done(err);
    });
  };
};

describe.skip( 'lint', function () {
  this.timeout( 120000 );

  /**
   * Group: WordPress Child Theme
   * _____________________________________
   */
  describe.only( 'wordpress-child-theme', function () {
    const themeName = 'wpdtrt-dbth';
    const theme = `./test/fixtures/dotherightthing/${themeName}`;
    const gulpfile = './gulpfile--wordpress-child-theme.js';

    before ( 'clean up test files', async function() {
      await del( `${theme}/${naturalDocsFolder}` );
    } );

    describe( 'series', function () {
      it( 'runs without error', mochaAsync(async function() {
        const { stdout, stderr } = await execa.commandSync( `./node_modules/.bin/gulp lint --gulpfile ${gulpfile} --cwd ${theme}` );
        // console.log( stdout );
        expect( stderr.replace( /\n$/, '') ).to.equal( '' );
      } ) );
    } );

    describe( 'composer', function () {
      it.skip( 'lints composer.json', mochaAsync(async function() {
        const { stdout, stderr } = await execa.commandSync( `./node_modules/.bin/gulp lintComposer --gulpfile ${gulpfile} --cwd ${theme}` );
        // console.log( stdout );
        expect( stderr.replace( /\n$/, '') ).to.equal( '' );
      } ) );
    } );

    describe( 'css', function () {
      it.skip( 'lints SCSS files', mochaAsync(async function() {
        const { stdout, stderr } = await execa.commandSync( `./node_modules/.bin/gulp lintCss --gulpfile ${gulpfile} --cwd ${theme}` );
        // console.log( stdout );
        expect( stderr.replace( /\n$/, '') ).to.equal( '' );
      } ) );
    } );

    describe( 'js', function () {
      it.skip( 'lints JS files', mochaAsync(async function() {
        const { stdout, stderr } = await execa.commandSync( `./node_modules/.bin/gulp lintJs --gulpfile ${gulpfile} --cwd ${theme}` );
        // console.log( stdout );
        expect( stderr.replace( /\n$/, '') ).to.equal( '' );
      } ) );
    } );

    describe( 'php', function () {
      it.skip( 'lints PHP files using phpcs.xml', mochaAsync(async function() {
        const { stdout, stderr } = await execa.commandSync( `./node_modules/.bin/gulp lintPhp --gulpfile ${gulpfile} --cwd ${theme}` );
        // console.log( stdout );
        expect( stderr.replace( /\n$/, '') ).to.equal( '' );
      } ) );
    } );
  } );
} );
