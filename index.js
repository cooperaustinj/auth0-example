require('dotenv').config();
const express = require('express');
const { auth } = require('express-openid-connect');

const authConfig = {
    authRequired: false,
    secret: process.env.AUTH_SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH_CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    idpLogout: true,
    auth0Logout: true,
};

const app = express();
const port = process.env.PORT || 3000;

// Not *needed* locally, but would be if behind CloudFlare or something
// app.set('trust proxy', true);

app.use(auth(authConfig));

app.use('/', (req, res) => {
    res.setHeader('content-type', 'text/html');
    if (req.oidc.isAuthenticated()) {
        return res.send(`
            <h2>Logged in as ${req.oidc.user.email}</h2>
            <a href="/logout">Logout</a>
        `);
    } else {
        return res.send(`
            <h2>You are not logged in</h2>
            <a href="/login">Login</a>
        `);
    }
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
