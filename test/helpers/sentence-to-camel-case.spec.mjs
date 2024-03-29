/**
 * @file ./test/helpers/sentence-to-camel-case.spec.mjs
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

import { expect } from 'chai';
import { describe, it } from 'mocha'; // fix eslint no-undef errors

// import paths are relative to this file
import sentenceToCamelCase from '../../helpers/sentence-to-camel-case.mjs';

// https://danielmiessler.com/blog/a-list-of-different-case-types/
describe('sentenceToCamelCase', function () {
    it('transforms title case', function () {
        expect(sentenceToCamelCase('Do The Right Thing')).to.eq('DoTheRightThing');
    });

    it('transforms lowercase', function () {
        expect(sentenceToCamelCase('do the right thing')).to.eq('DoTheRightThing');
    });

    it('transforms upper camel case', function () {
        expect(sentenceToCamelCase('DoTheRightThing')).to.eq('DoTheRightThing');
    });

    it('transforms lower camel case', function () {
        expect(sentenceToCamelCase('doTheRightThing')).to.eq('DoTheRightThing');
    });
});
