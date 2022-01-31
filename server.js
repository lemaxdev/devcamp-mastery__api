const Express = require('express');
const App = Express();

const ENV = require('./config/env.config');

App.listen(ENV.PORT, () => {
    console.log(`Server is up and running!`);
    console.log(`MODE: ${ENV.NODE_ENV} | PORT: ${ENV.PORT}\n====================`);
})