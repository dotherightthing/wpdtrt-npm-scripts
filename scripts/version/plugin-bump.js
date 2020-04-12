const wpdtrtPluginBump = require('gulp-wpdtrt-plugin-bump').wpdtrtPluginBump;
const boilerplatePath = require('../helpers/boilerplate-path.js').boilerplatePath;

wpdtrtPluginBump({
    inputPathRoot: './',
    inputPathBoilerplate: `./${boilerplatePath()}`
});
