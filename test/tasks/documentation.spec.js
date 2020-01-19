/**
 * File: test/tasks/documentation.spec.js
 *
 * Test gulp tasks.
 *
 * Note:
 * - Tests are run in project root
 * - In tested code, console.error/warn Prints to stderr with newline, so will cause test to fail when checking against stderr
 * - In tested code, console.log Prints to stdout with newline, so won't cause test to fail when checking against stderr
 *
 * ---
 * yarn run tests
 * ---
 */

const chai = require( 'chai' );
const { expect } = chai;
const del = require( 'del' );
const execa = require( 'execa' );
const fs = require( 'fs' );
const mocha = require( 'mocha' );
const { describe, it } = mocha; // fix eslint no-undef errors

describe( 'documentation', function () {
  this.timeout( 120000 );

  const app = 'Natural Docs/NaturalDocs.exe';
  const configFile = 'config/naturaldocs/Project.txt';
  const workingData = 'config/naturaldocs/Working Data';
  const docsFolder = 'docs';
  const docsIndex = `${docsFolder}/index.html`;
  const env = {
    TRAVIS_TAG: '1.2.3' // else documentation task skipped
  };

  /**
   * Group: WordPress Child Theme
   * _____________________________________
   */
  describe.only( 'wordpress-child-theme', function () {
    const themeName = 'wpdtrt-dbth';
    const theme = `./test/fixtures/dotherightthing/${themeName}`;
    const gulpfile = './gulpfile--wordpress-child-theme.js';

    before ( 'clean up test files', async function() {
      await del( `${theme}/${docsIndex}` );
    } );

    describe( 'series', function () {
      it( 'runs without error', async function() {
        const result = await execa.commandSync(
          `./node_modules/.bin/gulp documentation --gulpfile ${gulpfile} --cwd ${theme}`,
          { shell: true, env: env }
        );
        console.dir(result);
        expect( result.stderr.replace( /\n$/, '') ).to.equal( '' );
      } );
    } );

    describe( 'naturalDocs', function () {
      it( 'is installed', async function() {
        expect( fs.existsSync( `${process.cwd()}/${theme}/${app}` ) ).to.equal( true );
      } );

      it( 'config exists', async function() {
        expect( fs.existsSync( `${process.cwd()}/${theme}/${configFile}` ) ).to.equal( true );
      } );

      it.only( 'generates documentation', async function() {
        const result = await execa.commandSync(
          `./node_modules/.bin/gulp documentationNaturalDocs --gulpfile ${gulpfile} --cwd ${theme}`,
          { shell: true, env: env }
        );

        console.dir(result);

        expect( result.stderr).to.equal( '' );
        expect( fs.existsSync( `${process.cwd()}/${theme}/${docsIndex}` ) ).to.equal( true );
        expect( fs.existsSync( `${process.cwd()}/${theme}/${workingData}` ) ).to.equal( true );
      } );
    } );
  } );
} );
