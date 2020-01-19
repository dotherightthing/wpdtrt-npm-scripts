# DTRT NPM Scripts

[![GitHub release](https://img.shields.io/github/release/dotherightthing/wpdtrt-npm-scripts.svg)](https://github.com/dotherightthing/wpdtrt-npm-scripts/releases) [![Build Status](https://travis-ci.org/dotherightthing/wpdtrt-npm-scripts.svg?branch=master)](https://travis-ci.org/dotherightthing/wpdtrt-npm-scripts) [![GitHub issues](https://img.shields.io/github/issues/dotherightthing/wpdtrt-npm-scripts.svg)](https://github.com/dotherightthing/wpdtrt-npm-scripts/issues)

NPM build scripts.

## Background

* [Migrating Gulp build tasks to NPM scripts](https://gist.github.com/dotherightthing/edc8a492365cba31b55ee9fe63de0c8d).

## Installation

`npm install dotherightthing/wpdtrt-npm-scripts --save-dev`

### .gitignore

Please ignore these files, which are generated by the plugin:

```
.eslintrc
.sass-lint.yml
phpcs.xml
postcss.config.js
.browserslistrc
```

### package.json

Please add these lines to your `package.json`:

```
  "config": {
    "wpdtrt_npm_scripts": "./node_modules/wpdtrt-npm-scripts"
  },
  "scripts": {
    "build": "npm run build --prefix $npm_package_config_wpdtrt_npm_scripts",
    "compile": "npm run compile --prefix $npm_package_config_wpdtrt_npm_scripts",
    "dependencies": "npm run dependencies --prefix $npm_package_config_wpdtrt_npm_scripts",
    "docs": "npm run docs --prefix $npm_package_config_wpdtrt_npm_scripts",
    "lint": "npm run lint --prefix $npm_package_config_wpdtrt_npm_scripts",
    "release": "npm run release --prefix $npm_package_config_wpdtrt_npm_scripts",
    "test": "npm run test --prefix $npm_package_config_wpdtrt_npm_scripts",
    "version": "npm run version --prefix $npm_package_config_wpdtrt_npm_scripts",
    "watch": "npm run watch --prefix $npm_package_config_wpdtrt_npm_scripts"
  },
```

## Usage

### Compiling

`npm run compile` compiles:

1. `*.scss -> node-sass -> *.css`
2. `*.css -> postcss -> autoprefixer -> pxtorem -> *.css`

### Linting

`npm run lint` lints:

1. `composer.json`
2. `*.scss -> sass-lint`)
3. `*.js -> eslint`)
4. `*.php -> phpcs`)

Note that linting errors may cause the script to exit before all issues have been logged. In this case, fix the errors then run the script again.

## Tests

Tests are written in [Mocha](https://mochajs.org/), with [Chai](https://www.chaijs.com/) assertions.

[Execa](https://github.com/sindresorhus/execa) is used to verify the output of the [gulp](https://gulpjs.com/) Node [`child process`](https://nodejs.org/api/child_process.html#child_process_child_process).

```bash
npm run test
```
