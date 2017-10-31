/** routes.js
 * Defines the express endpoints that we serve the pages under.
 */

// Initialize the web API
var babel = require('babel-register');
var path = require('path');
var fs = require('fs');
var express = require('express');
var router = express.Router();
var ws = require('ws');
var browserify = require('browserify-middleware');

// Initialize the ROS system
const rosnodejs = require('rosnodejs');
var msgs_promise = rosnodejs.loadAllPackages();
var init_promise = rosnodejs.initNode('hlpr_web_teleop');

// Fetch the ROS API
var teleop = require('./ros/teleop');

// Complete the ROS Initialization. TODO: Enable post development
// Promise.all([msgs_promise, init_promise])
//     .then(() => {
//         teleop.initialize(rosnodejs.nh);
//     });

// Set browserify settings
browserify.settings({
    transform: [[ "babelify", { "presets": ["env", "react"] } ]]
});

// Setup the router to serve js through the browserify middleware
router.get('/js/react.js', browserify(['react', 'react-dom']));
router.get('/js/jquery.js', browserify(['jquery']));
router.use(
    '/js',
    browserify(
        path.join(__dirname, 'js'),
        { external: ["react", "react-dom", "jquery"] }
    )
);
router.use('/css', express.static(path.join(__dirname, 'css')));

// Load the static pages because I cannot understand Express routing sometimes
var teleopPage;
fs.readFile(path.resolve(__dirname, 'html/teleop.html'), (err, data) => {
    if (err) { throw err; }
    teleopPage = data.toString();
});

// Set the root of the app to be the teleop page
router.get('/', (req, res) => {
    res.send(teleopPage);
});

module.exports = router;
