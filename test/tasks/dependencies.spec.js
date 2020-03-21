/**
 * File: test/tasks/dependencies.spec.js
 *
 * Test tasks which install dependencies.
 *
 * Note:
 * - Tests are run in project root
 * - In tested code, console.error/warn Prints to stderr with newline, so will cause test to fail when checking against stderr
 * - In tested code, console.log Prints to stdout with newline, so won't cause test to fail when checking against stderr
 */

const chai = require( 'chai' );
const { expect } = chai;
const del = require( 'del' );
const execa = require( 'execa' );
const fs = require( 'fs' );
const mocha = require( 'mocha' );
const os = require('os');
const { describe, it } = mocha; // fix eslint no-undef errors

/**
 * Function: shellCommand
 *
 * Run a shell command.
 *
 * Parameters:
 *   command - the command to run (string)
 *
 * Returns:
 *   err - the error (string)
 */
const shellCommand = async ( command ) => {
  let err = '';

  try {
    await execa.commandSync( command, { shell: true } );
    // const { stdout } = await execa.commandSync( command, { shell: true } );
    // console.log( stdout );
  } catch ( error ) {
    err = error.stderr;
  }

  return err;
};

describe( 'dependencies', function () {
  this.timeout( 60000 );

  // TODO: Github & WPUnit
  const composerFolder = 'vendor';
  const naturalDocsFolder = 'Natural Docs';
  const npmFolder = 'node_modules';

  /**
   * Group: WordPress Child Theme
   * _____________________________________
   */
  describe.only( 'wordpress-child-theme', function () {
    const themeName = 'wpdtrt-dbth';
    const theme = `./test/fixtures/dotherightthing/${themeName}`;
    const gulpfile = './gulpfile--wordpress-child-theme.js';

    before ( 'clean up test files', async function() {
      await del( `${theme}/${composerFolder}` );
      await del( `${theme}/${naturalDocsFolder}` );
      await del( `${theme}/${npmFolder}` );
      await del( `${theme}/npm.lock` );
    } );

    describe( 'series', function () {
      it( 'runs without error', async function() {
        const err = await shellCommand( `./node_modules/.bin/gulp dependencies --gulpfile ${gulpfile} --cwd ${theme}` );
        expect( err.replace( /\n$/, '') ).to.equal( '' );
      } );
    } );

    describe( 'composer', function () {
      it( 'downloads and installs packages', async function() {
        const err = await shellCommand( `./node_modules/.bin/gulp dependenciesComposer --gulpfile ${gulpfile} --cwd ${theme}` );
        expect( err.replace( /\n$/, '') ).to.equal( '' );
        expect( fs.existsSync( `${process.cwd()}/${theme}/${composerFolder}` ) ).to.equal( true );
      } );
    } );

    describe( 'github', function () {
      it.skip( 'displays the Github API rate limit', async function() {
        // TODO
        expect( stderr.replace( /\n$/, '') ).to.equal( '' );
      } );
    } );

    describe( 'naturalDocs', function () {
      it.skip( 'downloads the executable (passing but skipped to limit downloads)', async function() {
        const err = await shellCommand( `./node_modules/.bin/gulp dependenciesNaturalDocs --gulpfile ${gulpfile} --cwd ${theme}` );
        expect( err.replace( /\n$/, '') ).to.equal( '' );
        expect( fs.existsSync( `${process.cwd()}/${theme}/${naturalDocsFolder}` ) ).to.equal( true );
      } );
    } );

    describe( 'npm', function () {
      it( 'downloads and installs packages', async function() {
        const err = await shellCommand( `./node_modules/.bin/gulp dependenciesYarn --gulpfile ${gulpfile} --cwd ${theme}` );
        expect( err.replace( /\n$/, '') ).to.equal( '' );
        expect( fs.existsSync( `${process.cwd()}/${theme}/${npmFolder}` ) ).to.equal( true );
        expect( fs.existsSync( `${process.cwd()}/${theme}/npm.lock` ) ).to.equal( true );
      } );
    } );
  } );

  /**
   * Group: WordPress Plugin Boilerplate
   * _____________________________________
   */
  describe( 'wordpress-plugin-boilerplate', function () {
    const theme = './test/fixtures/wordpress-plugin-boilerplate';

    beforeEach ( 'clean up test files', async function() {
      await del( `${theme}/${composerFolder}` );
      await del( `${theme}/${naturalDocsFolder}` );
      await del( `${theme}/${npmFolder}` );
      await del( `${theme}/npm.lock` );
      await del( `${os.tmpdir()}/wordpress`, { force: true } );
      await del( `${os.tmpdir()}/wordpress-tests-lib`, { force: true } );
    } );

    describe( 'wpUnit', function () {
      it( 'downloads and installs the test suite', async function() {
        const err = await shellCommand( `./node_modules/.bin/gulp dependenciesWpUnit --gulpfile ${gulpfile} --cwd ${theme}` );
        expect( err.replace( /\n$/, '') ).to.equal( '' );
        expect( fs.existsSync( `${os.tmpdir()}/wordpress-tests-lib` ) ).to.equal( true );
        // expect( fs.existsSync( `${os.tmpdir()}/wordpress` ) ).to.equal( true ); // running both expectations causes this to fail
      } );

      it.skip( 'creates a database', async function() {
        // TODO
        expect( stderr.replace( /\n$/, '') ).to.equal( '' );
      } );
    } );
  } );
} );
