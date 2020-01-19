/**
 * File: test/helpers/sentence-to-camel-case.spec.js
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
const sentenceToCamelCase = require( '../../helpers/sentence-to-camel-case' );

// https://danielmiessler.com/blog/a-list-of-different-case-types/
describe( 'sentenceToCamelCase', function () {
  it( 'transforms title case', function () {
    expect( sentenceToCamelCase( 'Do The Right Thing' ) ).to.eq( 'DoTheRightThing' );
  } );

  it( 'transforms lowercase', function () {
    expect( sentenceToCamelCase( 'do the right thing' ) ).to.eq( 'DoTheRightThing' );
  } );

  it( 'transforms upper camel case', function () {
    expect( sentenceToCamelCase( 'DoTheRightThing' ) ).to.eq( 'DoTheRightThing' );
  } );

  it( 'transforms lower camel case', function () {
    expect( sentenceToCamelCase( 'doTheRightThing' ) ).to.eq( 'DoTheRightThing' );
  } );
} );
