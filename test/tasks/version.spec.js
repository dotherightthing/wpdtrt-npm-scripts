/**
 * File: test/tasks/version.spec.js
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
const execa = require( 'execa' );
const mocha = require( 'mocha' );
const { describe, it } = mocha; // fix eslint no-undef errors

const version = require( '../../tasks/version/version' );

// https://labs.chiedo.com/post/async-mocha-tests/
const mochaAsync = (fn) => {
  return done => {
    fn.call().then(done, err => {
      done(err);
    });
  };
};

describe.skip( 'version', function () {
  this.timeout( 120000 );

  describe( 'series', function () {
    it( 'runs without error', mochaAsync(async function() {
      const { stdout, stderr } = await execa.commandSync( './node_modules/.bin/gulp version --gulpfile ./gulpfile.js --cwd ./test/fixtures/theme' );
      // console.log( stdout );
      expect( stderr.replace( /\n$/, '') ).to.equal( '' );
    } ) );
  } );

  describe( 'autoloadUpdatedDependencies', function () {
    it.skip( 'regenerates the list of PHP classes to be autoloaded', mochaAsync(async function() {
      // TODO
      expect( stderr.replace( /\n$/, '') ).to.equal( '' );
    } ) );
  } );

  describe( 'replaceVersions', function () {
    it.skip( 'replaces version strings, using the version set in package.json', mochaAsync(async function() {
      // TODO
      expect( stderr.replace( /\n$/, '') ).to.equal( '' );
    } ) );
  } );

  describe( 'updateDependencies', function () {
    it.skip( 'updates the boilerplate dependency to the latest version', mochaAsync(async function() {
      // TODO
      expect( stderr.replace( /\n$/, '') ).to.equal( '' );
    } ) );
  } );
} );
