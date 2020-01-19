# wpdtrt-npm-scripts

Replacement for wpdtrt-gulp

## Linting

### `npm run lint`

Run all `lint:` scripts.

Note that errors may cause the script to exit before all issues have been logged. In this case, fix the errors then run the script again.

### `npm run lint:composer`

This checks that `composer.json` validates.

This uses `./composer.json` in the directory from which this script is run.

### `npm run lint:css`

This checks that SCSS files validate.

This (automatically) uses `./sass-lint.yml` in the directory from which this script is run.

This allows files in `node_modules` to be excluded from linting.

`./sass-lint.yml` is automatically created/replaced when the script is run. This ensures that the host package always has the latest version.

`./sass-lint.yml` can also be used by the linter built into your IDE.

### `npm run lint:js`

This checks that JavaScript files validate.

This (automatically) uses `./eslintrc` in the directory from which this script is run.

This allows linting to be relaxed or enforced on a per-rule basis.

`./eslintrc` is automatically created/replaced when the script is run. This ensures that the host package always has the latest version.

`./eslintrc` can also used by the linter built into your IDE.

### `npm run lint:php`

This checks that PHP files validate.

This uses `./phpcs.xml` in the directory from which this script is run. This allows linting to be relaxed on a per-rule basis.

`./phpcs.xml` is automatically created/replaced when the script is run. This ensures that the host package always has the latest version.

`./phpcs.xml` can also used by the linter built into your IDE.
