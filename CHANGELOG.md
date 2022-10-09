* [8cf7901] Increase timeout to run local tests
* [c05fc49] Disable PHP tests on CI due to unresolved issue (#65)
* [e2779a9] Documentation
* [6cced11] Try with PHP 7.4
* [e34e5c2] Allow this workflow to be manually run from the Actions tab [ci skip]
* [ab193f5] Install execa [ci skip]
* [4befc0a] Debug database setup
* [792565c] Remove stdout and stderr debugging
* [fbdb1c6] Fix typo
* [cbd7761] Fix variable names
* [e3bf3fa] Export missing variables
* [f078433] Revert to using the pretest script as adding new script variants would require retrofitting the child repos
* [a50ed7c] Fix "Missing script test:setup"
* [b0a0d2c] See what is being output by shell command
* [1de2bba] Fix typo
* [cb73d15] Create separate test for "sets up WordPress (PHP) unit tests"
* [8a0a48c] Explicitly run pretest script
* [01dea39] Test if directories were created
* [422185a] Fix references to old temp directory
* [f150523] Documentation
* [db1b02f] Enable tmate debugging if a _previous_ step failed
* [29fe930] Automatically enable tmate debugging if a previous step failed
* [79406ec] Setup tmate session before running tests [skip ci]
* [c7ced04] Run build on debug
* [f846072] Delete debug-test.yml
* [788c570] Fix workflow syntax
* [2a80f19] Add tmate debugging
* [71e681b] Update lock file
* [6f73f7d] Create debug-test.yml
* [2d7053c] Remove mysql command that was added at start of debugging
* [a1514a7] Documentation
* [325dead] Remove host
* [a80cf87] Add sudo /etc/init.d/mysql start
* [eb4e45f] Remove  --ssl-mode=disabled
* [a34b97c] Try bitnami/mysql:8.0.20
* [099b698] Try setting --default-authentication-plugin=mysql_native_password
* [465b6e1] Implement MYSQL_ROOT_HOST in the correct place
* [5fc6981] Set MYSQL_ROOT_HOST to resolve "Access denied for user 'root'@'172.18.0.1' (using password: NO)"
* [53c7b2a] Disable SSL mode to address "ERROR 2026 (HY000): SSL connection error: error:1425F102:SSL routines:ssl_choose_client_version:unsupported protocol"
* [94b317e] Change MySQL server version from latest (8?) to 5.7.26 to match MAMP (mysqld --version)
* [5ffd2a5] Fix MySQL password argument
* [3802d02] Remove MYSQL_USER="root"
* [8401dc2] Attempt 1 at resolving #65 - install mysql service rather than using the built in one (#65)
* [5f4d334] wordpress is installed by the pretest script which is run by npm run test
* [f506dcc] Update wpdtrt-gallery
* [0c23b76] Don't suffix the temp directory path with tmp
* [3806fc9] Update wpdtrt-gallery
* [ad37805] Update wpdtrt-gallery
* [1e05e9f] Update wpdtrt-gallery
* [d44cadf] Update wpdtrt-gallery
* [7372ee6] Update wpdtrt-gallery
* [fc608ef] Add yoast/phpunit-polyfills and update wpdtrt-gallery to get updated bootstrap.php, to resolve "Error: The PHPUnit Polyfills library is a requirement for running the WP test suite."
* [64b8aa0] PHPUnit should display errors rather than fail silently (see https://stackoverflow.com/a/28714448)
* [04aa0e0] Delete debugging workflow as it doesn't run inside a fixture so doesn't install phpunit which is a dependency at the fixture level [skip ci]
* [e9437e6] Wordpress is installed by the pretest script which is run by npm run test, so skipping test also skips pretest
* [9b61986] Inspect contents of temp directory after wordpress install
* [7f777ce] Set .mjs executable permissions on test:internal
* [e124e50] Optimise workflow for temporary debugging
* [fb829d8] Add option to skip testing of an app
* [5d984eb] Debug
* [1e69903] Delete workflow
* [71c824a] Debug
* [63c19ee] Debug
* [4b18094] Install before debugging pretest
* [e850374] Debug pretest
* [51fcb23] Append /tmp to temp dir
* [9035c13] Create main.yml
* [4b23fb4] Add temporary debug workflow [skip ci]
* [8d4270d] Pass process.env.RUNNER_TEMP to install-wp-tests.sh
* [ebec594] Try process.env rather than $env
* [f56d542] Try $env.CI rather than $CI
* [b3d811c] Use GitHub environmental variable to access tmp dir
* [1686884] Skip PHP unit tests if wpunit not found (#64)
* [cb3b182] Lint *.mjs rather than *.js
* [c32af0f] Remove redundant backticks
* [2ccfa29] Update gulp-wpdtrt-plugin-bump to latest release
* [36b952c] Improve documentation of release process
* [390d612] Reenable app tests
* [89baf82] Set .mjs executable permissions on install
* [1db96b6] Update lock file [skip ci]
* [540309f] Add fs-extra dependency as used by cypress.mjs
* [aec2383] Update wpdtrt-gallery [skip ci]
* [fbab34c] Fix 'File does not exist' by not automatically opening mochawesome report, as per other documentation [skip ci]
* [2f104a3] Improve documentation of test functions [skip ci]
* [8df344b] Add tested versions of Node and NPM to package.json as a reminder (see https://stackoverflow.com/a/72397817 for a test)
* [d580c88] Improve documentation of lint function
* [d7c79eb] Improve documentation of compile function
* [99ce0f0] Fix generation of mochawesome Cypress report
* [da9bb67] Change to Cypress config directory before cypress.run to help Cypress find the config file and support folder
* [7a2c596] Make testing dependencies available outside wpdtrt-npm-scripts [skip ci]
* [f2a8a6b] Add missing node command [skip ci]
* [2659287] Add npm script test:js to run headless Cypress tests [skip ci]
* [e367de4] Don't lint Cypress generated JS files
* [d6cc0f5] Apply chmod a+x to scripts/**/*.mjs
* [3bdf44e] Increase timeout from 3 to 4 minutes
* [be6a9e2] Update wpdtrt-gallery
* [75dc5f0] Migrate cypress config to new format [skip ci]
* [ef3f953] Migrate cypress config to new format [skip ci]
* [dc69113] Update wpdtrt-gallery
* [67130a4] Add cypress.js and mochawesome report generation from accessible-components, revert to test:js (no Cypress UI) [skip ci]
* [9a90900] Add cypress.js and mochawesome report generation from accessible-components [skip ci]
* [f78fac0] Rename test:js to test:jsui [skip ci]
* [4e691a1] Update dependencies [skip ci]
* [c97fb52] Ignore warnings about @use (Dart Sass replacement for @import)
* [52a875a] Fix path to package.json as per 4866083
* [13be60f] Fix 'require is not defined in ES module scope' [skip ci]
* [55a0e08] Return-statements are only allowed inside of functions [skip ci]
* [d61e43d] Update scripts to use ESM for compatibility with execa 6+
