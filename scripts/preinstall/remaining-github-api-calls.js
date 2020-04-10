/**
 * @file ./scripts/preinstall/remaining-github-api-calls.js
 * @summary Expose the Github API rate limit to aid in debugging failed builds
 * @return {Object} Rate Limit object
 */

const ghRateLimit = require( 'gh-rate-limit' );
const formatLog = require('./scripts/helpers/format-log');

const token = process.env.GH_TOKEN ? process.env.GH_TOKEN : '';
let msg;

if ( token !== '' ) {

    ghRateLimit( {
        token: token
    } ).then(status => {
        msg = `${status.core.remaining}/${status.core.limit} API calls remaining`;
        formatLog.log([
            'preinstall',
            'Github API rate limit check',
            msg
        ]);
    } );

} else {
    msg = 'skipping - GH_TOKEN not found)';
    formatLog.log([
        'preinstall',
        'Github API rate limit check',
        msg
    ]);
}
