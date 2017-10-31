/** routes.js
 * Defines the express endpoints that we serve the pages under.
 */

// Initialize the web API
var babel = require('babel-register');
var router = require('express').Router();
var ws = require('ws');

// Initialize the ROS API
var teleop = require('./teleop');
