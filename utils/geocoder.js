const NodeGeocoder = require('node-geocoder');
const ENV = require('../config/env.config');

const geocoder = NodeGeocoder({
    provider: ENV.GEOCODER_PROVIDER,
    httpAdapter: 'https',
    apiKey: ENV.GEOCODER_KEY,
    formatter: null
});

module.exports = geocoder;