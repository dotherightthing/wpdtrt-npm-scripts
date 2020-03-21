# DTRT NPM Scripts

[![GitHub release](https://img.shields.io/github/release/dotherightthing/wpdtrt-npm-scripts.svg)](https://github.com/dotherightthing/wpdtrt-npm-scripts/releases) [![Build Status](https://travis-ci.org/dotherightthing/wpdtrt-npm-scripts.svg?branch=master)](https://travis-ci.org/dotherightthing/wpdtrt-npm-scripts) [![GitHub issues](https://img.shields.io/github/issues/dotherightthing/wpdtrt-npm-scripts.svg)](https://github.com/dotherightthing/wpdtrt-npm-scripts/issues)

NPM build scripts.

## Background

* [Migrating Gulp build tasks to NPM scripts](https://gist.github.com/dotherightthing/edc8a492365cba31b55ee9fe63de0c8d).\\

## Dependencies

1. Composer - <https://getcomposer.org/doc/00-intro.md#installation-linux-unix-macos>
2. Mono (Natural Docs' framework) - <https://www.mono-project.com/download/stable/>
3. Natural Docs - <https://www.naturaldocs.org/download/> and save to `./bin/Natural Docs`
4. `config/naturaldocs/Project.txt`:
```
Format: 2.0.2

# This is the file you use to provide information about your project.  It can
# also be used to specify input and output settings so you don't have to
# include them on the command line.


# Project Information
# ------------------------------------------------------------------------

Title: Documentation
Subtitle: {NAME OF PROJECT} ({VERSION})

Copyright: Copyright © 2019 Dan Smith

Timestamp: Last updated day month, year
#    m     - Single digit month, when possible.  January is "1".
#    mm    - Always double digit month.  January is "01".
#    mon   - Short month word.  January is "Jan".
#    month - Long month word.  January is "January".
#    d     - Single digit day, when possible.  1 is "1".
#    dd    - Always double digit day.  1 is "01".
#    day   - Day with text extension.  1 is "1st".
#    yy    - Double digit year.  2017 is "17".
#    yyyy  - Four digit year.  2017 is "2017".
#    year  - Four digit year.  2017 is "2017".


# This is where you specify general information about your project.
#
# Style: [style]
#    The style to apply to the generated documentation.  It can be the name of
#    a CSS file in the project configuration folder or a subfolder that
#    contains Style.txt.  Do not include ".css" if using a CSS file.


# Source Code
# ------------------------------------------------------------------------

Source Folder: ../..



# This is where you specify what files and folders Natural Docs should be
# scanning.  If you use any of these options on the command line, this entire
# section is ignored except for names and numbers.
#
# All paths are relative to the project configuration folder, which lets this
# file remain portable across computers and not cause problems in version
# control systems.  You can enter absolute paths and they will be converted
# automatically.
#
# Source Folder: [path]
#    Name: [name]
#
#    Specifies a folder which will be searched for source files.  If you have
#    more than one, add the Name property to set how it will show up in the
#    menu.


# Source Filtering
# ------------------------------------------------------------------------

Ignore Source Folder: ../../docs

Ignore Source Folder: ../../node_modules

# ERROR: The ignored source folder /Users/dan/Websites/wpdtrt-dbth/vendor does not exist.
Ignore Source Folder: ../../vendor


# If there are any subfolders in the source code that you would like Natural
# Docs to ignore, they can be specified here.  If you use any of these options
# on the command line, this entire section is ignored.
#
# Ignore Source Folder: [path]
#    Tells Natural Docs to skip this folder when scanning files.
#
# Ignore Source Folder Pattern: [pattern]
#    Tells Natural Docs to skip all folder names which match this pattern when
#    scanning files.  ? matches a single character, * matches zero or more
#    characters.  It applies to the entire folder name, so "cli" will not
#    match "client", although "cli*" will.
#
#    The data folders of common version control systems (.git, .svn, .cvs, .hg)
#    are ignored automatically.  You do not have to specify them here.


# Generated Documentation
# ------------------------------------------------------------------------

HTML Output Folder: ../../docs


# This is where you specify what kind of documentation you want Natural Docs
# to build and where it should be put.  If you use any of these options on the
# command line, this entire section is ignored except for secondary settings.
#
# All paths are relative to the project configuration folder, which lets this
# file remain portable across computers and not cause problems in version
# control systems.  You can enter absolute paths and they will be converted
# automatically.
#
# You can override any of the project information settings under each entry,
# so if you have multiple output folders you can give them each different
# styles or subtitles.
#
# HTML Output Folder: [path]
#    [Project Information]
#
#    Generates HTML documentation in the specified folder.


# Global Settings
# ------------------------------------------------------------------------

# Other settings that apply to your entire project.  Settings specified on the
# command line override the settings here.
#
# Tab Width: [width]
#    The number of spaces tabs should be expanded to.
#
# Documented Only: [yes|no]
#    Whether only documented code elements should appear in the output.
#    Defaults to no.
#
# Auto Group: [yes|no]
#    Whether groups should automatically apply to you code.  Defaults to yes.
```

## Installation

`npm install dotherightthing/wpdtrt-npm-scripts --save-dev`

### .gitignore

Please add these lines to your `.gitignore`:

```
# Files generated by wpdtrt-npm-scripts
.babelrc
.browserslistrc
.eslintrc
.sass-lint.yml
_wpdtrt-import.scss
bin/Natural\ Docs
config/naturaldocs/Working\ Data
phpcs.xml
postcss.config.js
# End
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

`npm run compile:css` compiles:

1. `*.scss -> node-sass -> *.css`
2. `*.css -> postcss -> autoprefixer -> pxtorem -> *.css`

### Linting

`npm run lint` lints:

1. `composer.json`
2. `*.scss -> sass-lint`
3. `*.js -> eslint`
4. `*.php -> phpcs`

Note that linting errors may cause the script to exit before all issues have been logged. In this case, fix the errors then run the script again.

## Tests

Tests are written in [Mocha](https://mochajs.org/), with [Chai](https://www.chaijs.com/) assertions.

[Execa](https://github.com/sindresorhus/execa) is used to verify the output of the [gulp](https://gulpjs.com/) Node [`child process`](https://nodejs.org/api/child_process.html#child_process_child_process).

To test against fixtures loaded into a sub-directory:

```bash
npm config set wpdtrt-dbth:wpdtrt_npm_scripts ../../../../
```

then:

```bash
npm run test
```
