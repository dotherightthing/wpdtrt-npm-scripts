/**
 * @file remaining-github-api-calls.js
 * @summary Expose the Github API rate limit to aid in debugging failed builds
 * @return {Object} Rate Limit object
 */

const ghRateLimit = require( 'gh-rate-limit' );
const token = process.env.GH_TOKEN ? process.env.GH_TOKEN : '';
let msg = '';

msg += 'Github API rate limit check: ';

if ( token !== '' ) {

    ghRateLimit( {
        token: token
    } ).then(status => {
        msg += `${status.core.remaining}/${status.core.limit} API calls remaining`;
        console.log(msg);
    } );

} else {
    msg += 'GH_TOKEN not found';
    console.log(msg);
}
