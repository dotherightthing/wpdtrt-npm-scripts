import wpdtrtPluginBump from 'gulp-wpdtrt-plugin-bump';
import boilerplatePath from './scripts/helpers/boilerplate-path.js';

wpdtrtPluginBump( {
    inputPathRoot: './',
    inputPathBoilerplate: `./${boilerplatePath()}`
} );
