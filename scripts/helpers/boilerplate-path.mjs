/**
 * @file ./scripts/helpers/boilerplate-path.mjs
 * @summary Gets the path to wpdtrt-plugin-boilerplate.
 */

// Helpers

/**
 * @function getPluginName
 * @summary Get the pluginName from the directory path.
 * @returns {string} pluginName
 */
const getPluginName = () => {
    // pop() - remove the last element from the path array and return it
    const pluginName = process.cwd().split('/').pop();

    return pluginName;
};

/**
 * @function boilerplateIs
 * @summary Determines whether we're in the boilerplate, or using it as a dependency.
 * @returns {boolean} True if we're in the boilerplate
 */
const boilerplateIs = () => {
    const pluginName = getPluginName();

    return (pluginName === 'wpdtrt-plugin-boilerplate');
};

/**
 * @function boilerplatePath
 * @summary Get the path to the boilerplate.
 * @returns {string} path
 * @example
 * import boilerplatePath from './boilerplate-path';
 * phpCsXml: `./${boilerplatePath()}phpcs.xml`;
 */
const getBoilerplatePath = () => {
    let path = '';

    if (!boilerplateIs()) {
        path = 'vendor/dotherightthing/wpdtrt-plugin-boilerplate/';
    }

    return path;
};

export { getBoilerplatePath as default };
