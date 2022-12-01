
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const { ROUTES } = require("./routes/routes");

const { setupLogging } = require("./log/logging");
const { setupRateLimit } = require("./rate-limiter/ratelimit");
const { setupProxies } = require("./proxy/proxy");
const { setUpAuthenticationMiddleware } = require("./middleware/auth");
var cors = require('cors');
const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}
const app = express()
const port = 3000;

setupLogging(app);
setupRateLimit(app, ROUTES);
setUpAuthenticationMiddleware(app, ROUTES);
setupProxies(app, ROUTES);
app.use(cors(corsOptions));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})