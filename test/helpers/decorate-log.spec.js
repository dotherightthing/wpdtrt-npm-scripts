/**
 * File: test/helpers/decorate-log.spec.js
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
const mocha = require( 'mocha' );
const { describe, it } = mocha; // fix eslint no-undef errors

// import paths are relative to this file
const decorateLog = require( '../../helpers/decorate-log' );

describe( 'decorateLog', function () {
  // mock of gulp-color
  // see ANSI escape codes @ https://stackoverflow.com/a/5762502/6850747
  const fakeColor = ( text, color ) => {
    // COLOR: code
    const ansiColorCodes = {
      GREEN: 32,
      RED: 31,
      WHITE: 37,
      YELLOW: 33
    };

    const ansiColorCode = ansiColorCodes[ color ];
    const colouredText = `\u001b[${ansiColorCode}m${text}\u001b[0m`;

    return colouredText;
  };

  // mock of fancy-log
  // without the timestamp
  // as we're not testing that
  const fakeLog = ( str ) => {
    return str;
  };

  it( 'decorates a success message', function () {
    const config = {
      textstring: 'A pass'
    }
    expect( decorateLog( fakeColor, fakeLog, config ), JSON.stringify( config ) ).to.eq( '\u001b[32m✔ A pass\u001b[0m' );
  } );

  it( 'decorates a regular message', function () {
    const config = {
      textstring: 'A message',
      messageCount: 1
    }
    expect( decorateLog( fakeColor, fakeLog, config ), JSON.stringify( config ) ).to.eq( '\u001b[37m💬 A message\u001b[0m' );
  } );

  it( 'decorates a warning message', function () {
    const config = {
      textstring: 'A warning',
      warningCount: 1
    }
    expect( decorateLog( fakeColor, fakeLog, config ), JSON.stringify( config ) ).to.eq( '\u001b[33m⚠️ A warning\u001b[0m' );
  } );

  it( 'decorates an error message', function () {
    const config = {
      textstring: 'An error',
      errorCount: 1
    }
    expect( decorateLog( fakeColor, fakeLog, config ), JSON.stringify( config ) ).to.eq( '\u001b[31m✖ An error\u001b[0m' );
  } );
} );
