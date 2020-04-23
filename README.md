# DTRT NPM Scripts

[![GitHub release](https://img.shields.io/github/v/tag/dotherightthing/wpdtrt-npm-scripts)](https://github.com/dotherightthing/wpdtrt-npm-scripts/releases) [![Build](https://github.com/dotherightthing/wpdtrt-npm-scripts/workflows/Build/badge.svg?branch=master)](https://github.com/dotherightthing/wpdtrt-npm-scripts/actions?query=workflow%3ABuild) [![GitHub issues](https://img.shields.io/github/issues/dotherightthing/wpdtrt-npm-scripts.svg)](https://github.com/dotherightthing/wpdtrt-npm-scripts/issues)


NPM build scripts.

## Background

* [Migrating Gulp build tasks to NPM scripts](https://gist.github.com/dotherightthing/edc8a492365cba31b55ee9fe63de0c8d).

## Dependencies

1. Composer - <https://getcomposer.org/doc/00-intro.md#installation-linux-unix-macos>
2. Mono (Natural Docs' framework) - <https://www.mono-project.com/download/stable/>
3. Natural Docs - <https://www.naturaldocs.org/download/> and save to `./bin/Natural Docs`

## Installation

```
n 13.2.0 # change node version - https://www.npmjs.com/package/n
npm install dotherightthing/wpdtrt-npm-scripts --save-dev
```

### Files

#### 1. .gitignore

Please add these lines to your `.gitignore`:

```
# Files supporting or generated by wpdtrt-npm-scripts
config/naturaldocs
css
release*
.babelrc
.browserslistrc
.eslintrc
.stylelint*
js/*-es5.js
nodemon.json
phpcs.xml
phpunit.xml.dist
postcss.config.js
_wpdtrt-import.scss
bin/Natural\ Docs
docs
node_modules
vendor
# End
```

#### 2. composer.json

Please add these lines to your `composer.json`:

```json
  "require": {
    "wp-coding-standards/wpcs": "^0.14.1",
    "dealerdirect/phpcodesniffer-composer-installer": "^0.4.4",
    "phpunit/phpunit": "^7.5.14",
    "psy/psysh" : "~0.6",
    "wp-cli/wp-cli": "^2.3"
  },
```

See also [#19](issues/19).

#### 3. package.json

Please add these lines to your `package.json`:

```json
  "config": {
    "wpdtrt_npm_scripts": "./node_modules/wpdtrt-npm-scripts"
  },
  "scripts": {
    "compile": "npm run compile --prefix $npm_package_config_wpdtrt_npm_scripts",
    "docs": "npm run docs --prefix $npm_package_config_wpdtrt_npm_scripts",
    "lint": "npm run lint --prefix $npm_package_config_wpdtrt_npm_scripts",
    "release": "npm run release --prefix $npm_package_config_wpdtrt_npm_scripts",
    "test": "npm run test --prefix $npm_package_config_wpdtrt_npm_scripts",
    "version": "npm run version --prefix $npm_package_config_wpdtrt_npm_scripts",
    "watch": "nodemon"
  },
```

Note:

* `--prefix` [forces non-global commands to run in the specified folder](https://docs.npmjs.com/misc/config#prefix)
* `$npm_package_config_wpdtrt_npm_scripts` = the value of package.json's `config.wpdtrt_npm_scripts`

#### 4. tests/bootstrap.php

##### Plugins

See https://github.com/dotherightthing/generator-wpdtrt-plugin-boilerplate/blob/master/generators/app/templates/tests/bootstrap.php

##### Themes

```
<?php
/**
 * PHPUnit bootstrap file for wpdtrt-npm-scripts
 */

// .
```

## Uninstallation

```
npm uninstall wpdtrt-npm-scripts
```

## Usage

### Compile files

```
npm run compile
```

1. `*.scss -> node-sass -> *.css`
2. `*.css -> postcss -> autoprefixer -> pxtorem -> *.css`
3. `backend.js -> backend-es5.js`
4. `frontend.js -> frontend-es5.js`

### Lint files

```
npm run lint
```

1. `composer.json`
2. `*.scss -> stylelint`
3. `*.js -> eslint`
4. `*.php -> phpcs`

Note that linting errors may cause the script to exit before all issues have been logged. In this case, fix the errors then run the script again.

### Run unit tests

```
npm run test
```

See also [DTRT WordPress Plugin Boilerplate - Testing & Debugging](https://github.com/dotherightthing/wpdtrt-plugin-boilerplate/wiki/Testing-&-Debugging)

---

## Tests

Tests are written in [Mocha](https://mochajs.org/), with [Chai](https://www.chaijs.com/) assertions.

[Execa](https://github.com/sindresorhus/execa) is used to verify the output of Shell and Node [`child process`](https://nodejs.org/api/child_process.html#child_process_child_process)es.

To test against fixtures loaded into a sub-directory:

```bash
npm run test:internal
```
