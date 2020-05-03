/**
 * @file Rip WordPress Maintenance Page
 * @summary Scrape the WordPress maintenance page and save it as a page template.
 * @description
 * Source page is viewable at /maintenance-template/ (when logged in, as Visibility: Private)
 * Generated page is viewable at /maintenance/
 */
const axios = require('axios');
const fs = require('fs');

const baseURL = process.env.npm_package_config_wpdtrt_base_url_local; // note: no trailing slash
const sourceUrl = 'maintenance-template';
const targetPageTemplate = 'page-maintenance.php';

axios({
    method: 'get',
    baseURL: baseURL,
    url: sourceUrl,
    responseType: 'text',
    transformResponse: [ function (data) { // eslint-disable-line func-names
        const regexp = new RegExp(baseURL, 'g');
        let absoluteUrls = data.replace(regexp, '');

        return absoluteUrls;
    } ]
})
    .then(function (response) { // eslint-disable-line func-names
        let timeStamp = '\r\n';
        timeStamp += `<!-- Ripped from ${baseURL}${sourceUrl} on ${response.headers.date}, by wpdtrt-npm-scripts -->`;

        fs.writeFileSync(targetPageTemplate, response.data + timeStamp, {
            encoding: 'utf8'
        });
    });
