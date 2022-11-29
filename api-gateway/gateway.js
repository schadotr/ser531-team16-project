
const express = require('express')

const { ROUTES } = require("./routes/routes");

const { setupLogging } = require("./log/logging");
const { setupRateLimit } = require("./rate-limiter/ratelimit");
const { setupProxies } = require("./proxy/proxy");
const { setUpAuthenticationMiddleware } = require("./middleware/auth");
const dotenv = require('dotenv');
dotenv.config();
const app = express()
const port = 3000;

setupLogging(app);
setupRateLimit(app, ROUTES);
setUpAuthenticationMiddleware(app, ROUTES);
setupProxies(app, ROUTES);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})