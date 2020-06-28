# DTRT NPM Scripts

[![GitHub release](https://img.shields.io/github/v/tag/dotherightthing/wpdtrt-npm-scripts)](https://github.com/dotherightthing/wpdtrt-npm-scripts/releases) [![Build](https://github.com/dotherightthing/wpdtrt-npm-scripts/workflows/Build/badge.svg?branch=master)](https://github.com/dotherightthing/wpdtrt-npm-scripts/actions?query=workflow%3ABuild) [![GitHub issues](https://img.shields.io/github/issues/dotherightthing/wpdtrt-npm-scripts.svg)](https://github.com/dotherightthing/wpdtrt-npm-scripts/issues)

NPM build scripts.

## Background

* [Migrating Gulp build tasks to NPM scripts](https://gist.github.com/dotherightthing/edc8a492365cba31b55ee9fe63de0c8d).

## Dependencies

1. Composer - <https://getcomposer.org/doc/00-intro.md#installation-linux-unix-macos>
2. Mono (Natural Docs' framework) - <https://www.mono-project.com/download/stable/> (deprecated)
3. Natural Docs - <https://www.naturaldocs.org/download/> and save to `./bin/Natural Docs` (deprecated)
4. n - <https://www.npmjs.com/package/n>

## Installation

```node
n 13.2.0 # change node version
npm install dotherightthing/wpdtrt-npm-scripts#semver:0.3.* --save-dev
```

### Files

#### 1. .gitignore

Please add these lines to your `.gitignore`:

```text
# Files supporting or generated by wpdtrt-npm-scripts
config/naturaldocs
css
release*
!.github/workflows/release*
.babelrc
.browserslistrc
.eslintrc
.stylelint*
js/*-es5.js
nodemon.json
phpcs.xml
phpunit.xml.dist
postcss.config.js
bin/Natural\ Docs
docs
node_modules
vendor
# End
```

#### 2. CHANGELOG.md

This file contains a list of changes in the current version/tag.

Please commit this file and push it to your Github repository.

See also [#33](https://github.com/dotherightthing/wpdtrt-npm-scripts/issues/33).

#### 3. composer.json

Please add these lines to your `composer.json`:

```json
  "require-dev": {
    "wp-coding-standards/wpcs": "^0.14.1",
    "dealerdirect/phpcodesniffer-composer-installer": "^0.4.4",
    "phpunit/phpunit": "^7.5.14",
    "psy/psysh" : "~0.6",
    "wp-cli/wp-cli": "^2.3"
  },
```

See also [#19](https://github.com/dotherightthing/wpdtrt-npm-scripts/issues/19).

#### 4. .github

This folder contains configurations file for Github (Continuous Integration) Actions.

Please commit this folder and push it to your Github repository.

#### 5. package.json

Please add these lines to your `package.json`:

```json
  "config": {
    "wpdtrt_base_url_local": "http://domain.local",
    "wpdtrt_npm_scripts": "./node_modules/wpdtrt-npm-scripts"
  },
  "scripts": {
    "changelog": "npm run changelog --prefix $npm_package_config_wpdtrt_npm_scripts",
    "compile": "npm run compile --prefix $npm_package_config_wpdtrt_npm_scripts",
    "docs": "npm run docs --prefix $npm_package_config_wpdtrt_npm_scripts",
    "lint": "npm run lint --prefix $npm_package_config_wpdtrt_npm_scripts",
    "release": "npm run release --prefix $npm_package_config_wpdtrt_npm_scripts",
    "scrape:wordpress_maintenance_page": "npm run scrape:wordpress_maintenance_page --prefix $npm_package_config_wpdtrt_npm_scripts -- $npm_package_config_wpdtrt_base_url_local",
    "test": "npm run test --prefix $npm_package_config_wpdtrt_npm_scripts",
    "version": "npm run version --prefix $npm_package_config_wpdtrt_npm_scripts",
    "watch": "nodemon"
  },
```

Note:

* `config.wpdtrt_base_url_local` is used by `scrape:wordpress_maintenance_page`
* `--prefix` [forces non-global commands to run in the specified folder](https://docs.npmjs.com/misc/config#prefix)
* `$npm_package_config_wpdtrt_npm_scripts` = the value of package.json's `config.wpdtrt_npm_scripts`

#### 6. tests/bootstrap.php

##### Plugins

See https://github.com/dotherightthing/generator-wpdtrt-plugin-boilerplate/blob/master/generators/app/templates/tests/bootstrap.php

##### Themes

```php
<?php
/**
 * PHPUnit bootstrap file for wpdtrt-npm-scripts
 */

// .
```

#### 7. README.md

Add the following badges:

```
[![GitHub release](https://img.shields.io/github/v/tag/AUTHOR/REPO)](https://github.com/AUTHOR/REPO/releases) [![Build Status](https://github.com/AUTHOR/REPO/workflows/Build%20and%20release%20if%20tagged/badge.svg)](https://github.com/AUTHOR/REPO/actions?query=workflow%3A%22Build+and+release+if+tagged%22) [![GitHub issues](https://img.shields.io/github/issues/AUTHOR/REPO.svg)](https://github.com/AUTHOR/REPO/issues)
```

## Update

```node
n 13.2.0 # change node version
npm update wpdtrt-npm-scripts
```

## Uninstallation

```node
n 13.2.0 # change node version
npm uninstall wpdtrt-npm-scripts
```

## Usage

### Compile

```node
npm run compile
```

or

```node
npm run watch
```

1. `*.scss -> node-sass -> *.css`
2. `*.css -> postcss -> *.css`
3. `backend.js -> backend-es5.js`
4. `frontend.js -> frontend-es5.js`

### Document

**Note: this feature is currently untested.**

```node
npm run docs
```

### Lint

```node
npm run lint
```

1. `composer.json`
2. `*.js -> eslint`
3. `*.php -> phpcs`
4. `*.scss -> stylelint`

Note that linting errors may cause the script to exit before all issues have been logged. In this case, fix the errors then run the script again.

### Release

Bundle files for release by the CI:

```node
npm run release
```

### Scrape

Scrape WordPress maintenance page to `/maintenance.php`:

```node
npm run scrape:wordpress_maintenance_page
```

This requires a (locally) published page with a slug of `maintenance-template`.

### Test

Run unit tests:

```node
npm run test
```

See also [DTRT WordPress Plugin Boilerplate - Testing & Debugging](https://github.com/dotherightthing/wpdtrt-plugin-boilerplate/wiki/Testing-&-Debugging)

### Version

Version files for Release:

```node
n 11.15.0 # see https://stackoverflow.com/a/57804190/6850747
npm run version
```

---

## Releases

Manually copy and paste the version changelog to the [Releases](https://github.com/dotherightthing/wpdtrt-npm-scripts/releases) page.

```
git log --pretty="* [%h] %s" --no-merges $(git describe --tags --abbrev=0 @^)..@ > CHANGELOG.md
```

## Tests

Tests are written in [Mocha](https://mochajs.org/), with [Chai](https://www.chaijs.com/) assertions.

[Execa](https://github.com/sindresorhus/execa) is used to verify the output of Shell and Node [`child process`](https://nodejs.org/api/child_process.html#child_process_child_process)es.

To test against fixtures loaded into a sub-directory:

```bash
npm run test:internal
```
