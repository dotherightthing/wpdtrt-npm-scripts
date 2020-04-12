/**
 * @file ./scripts/helpers/release-name.js
 * @summary Generate a name for the release folder
 * @returns Release name
 */

const releaseName = () => {
    let ciPackageReleaseTag = '';

    if (typeof process.env.TRAVIS !== 'undefined') {
        if (process.env.TRAVIS_TAG !== '') {
            ciPackageReleaseTag = `-${process.env.TRAVIS_TAG}`;
        }
    } else if (typeof process.env.BITBUCKET_TAG !== 'undefined') {
        ciPackageReleaseTag = `-${process.env.BITBUCKET_TAG}`;
    }

    let ciPackageReleaseName = `release${ciPackageReleaseTag}`;

    return ciPackageReleaseName;
};

exports.default = releaseName;
