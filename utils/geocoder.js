const NodeGeocoder = require('node-geocoder');
const ENV = require('../config/env.config');

const options = {
    provider: ENV.GEOCODER_PROVIDER,
    httpAdapter: 'https',
    apiKey: ENV.GEOCODER_KEY,
    formatter: null
}
const geocoder = NodeGeocoder(options);

module.exports = geocoder;