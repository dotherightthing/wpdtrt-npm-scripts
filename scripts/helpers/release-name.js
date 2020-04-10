/**
 * @file ./scripts/helpers/release-name.js
 * @summary Generate a name for the release zip file
 * @return Release name
 */

const releaseName = () => {
    let ci_package_release_tag = '';

    if (typeof process.env.TRAVIS !== 'undefined') {
        if (process.env.TRAVIS_TAG !== '') {
            ci_package_release_tag = `-${process.env.TRAVIS_TAG}`;
        }
    } else if (typeof process.env.BITBUCKET_TAG !== 'undefined') {
        ci_package_release_tag = `-${process.env.BITBUCKET_TAG}`;
    }
    
    let ci_package_release_name = `release${ci_package_release_tag}.zip`;
    
    return ci_package_release_name;
};

exports.default = releaseName;
