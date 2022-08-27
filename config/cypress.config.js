const { defineConfig } = require('cypress');

module.exports = defineConfig({
    baseUrl: 'https://dontbelievethehype.co.nz',
    pageLoadTimeout: 20000,
    responseTimeout: 15000,
    retries: {
        openMode: 2,
        runMode: 0
    },
    video: false,
    viewportWidth: 1366,
    viewportHeight: 768,
    watchForFileChanges: true
});
