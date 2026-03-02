/*
CSC3916 HW2
File: Server.js
Description: Web API scaffolding for Movie API
*/
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var passport = require('passport');

require('dotenv').config();


var authController = require('./auth');         // Basic Auth
var authJwtController = require('./auth_jwt');  // JWT Auth
db = require('./db')(); //hack
var jwt = require('jsonwebtoken');
var cors = require('cors');

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

var router = express.Router();

/**
 * Response builder required by assignment:
 * - includes headers
 * - includes query params
 * - includes env unique key
 * - includes message + status
 */
function getJSONObjectForMovieRequirement(req, message) {
    return {
        status: 200,
        message: message,
        headers: (req.headers && Object.keys(req.headers).length) ? req.headers : "No headers",
        query: (req.query && Object.keys(req.query).length) ? req.query : "No query params",
        env: process.env.UNIQUE_KEY,
        body: (req.body && Object.keys(req.body).length) ? req.body : "No body"
    };
}

/**
 * Reject base URL
 */
router.all('/', (req, res) => {
    return res.status(405).json({ message: "Base URL not supported. Use /signup, /signin, or /movies." });
});

/**
 * /signup — POST only
 */
router.post('/signup', (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ success: false, msg: 'Please include both username and password to signup.' });
    }

    var newUser = {
        username: req.body.username,
        password: req.body.password
    };

    db.save(newUser); // no duplicate checking
    return res.status(200).json({ success: true, msg: 'Successful created new user.' });
});

router.all('/signup', (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).send("This route doesn’t support the HTTP method.");
    }
});

/**
 * /signin — POST only
 */
router.post('/signin', (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ success: false, msg: 'Please include both username and password to signin.' });
    }

    var user = db.findOne(req.body.username);

    if (!user) {
        return res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
    }

    if (req.body.password === user.password) {
        var userToken = { id: user.id, username: user.username };
        var token = jwt.sign(userToken, process.env.SECRET_KEY);
        return res.status(200).json({ success: true, token: 'JWT ' + token });
    }

    return res.status(401).send({ success: false, msg: 'Authentication failed.' });
});

router.all('/signin', (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).send("This route doesn’t support the HTTP method.");
    }
});

/**
 * /movies — accept GET/POST/PUT/DELETE only
 * - PUT requires JWT auth
 * - DELETE requires Basic auth
 */
router.route('/movies')
    .get((req, res) => {
        return res.status(200).json(getJSONObjectForMovieRequirement(req, "GET movies"));
    })
    .post((req, res) => {
        return res.status(200).json(getJSONObjectForMovieRequirement(req, "movie saved"));
    })
    .put(authJwtController.isAuthenticated, (req, res) => {
        return res.status(200).json(getJSONObjectForMovieRequirement(req, "movie updated"));
    })
    .delete(authController.isAuthenticated, (req, res) => {
        return res.status(200).json(getJSONObjectForMovieRequirement(req, "movie deleted"));
    })
    .all((req, res) => {
        return res.status(405).send("This route doesn’t support the HTTP method.");
    });

/**
 * /testcollection — keep for provided mocha tests
 * (PUT requires JWT, DELETE requires Basic)
 */
router.route('/testcollection')
    .delete(authController.isAuthenticated, (req, res) => {
        var o = getJSONObjectForMovieRequirement(req, "movie deleted");
        return res.status(200).json(o);
    })
    .put(authJwtController.isAuthenticated, (req, res) => {
        var o = getJSONObjectForMovieRequirement(req, "movie updated");
        return res.status(200).json(o);
    })
    .all((req, res) => {
        return res.status(405).send("This route doesn’t support the HTTP method.");
    });

app.use('/', router);

const PORT = process.env.PORT || 8080;

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
}

module.exports = app;