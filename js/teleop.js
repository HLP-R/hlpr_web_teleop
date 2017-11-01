var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router-dom').HashRouter;
var Interface = require('./interface.jsx');

// Setup websocket connection
var emitter = require('event-emitter')();
var ws = new WebSocket('ws://' + window.location.host + '/teleop');

// Define the events and the conditions to dispatch them. This would be for a
// later version where we feed Prentice's state back to the app

// Render the react app
ReactDOM.render((
    <Router>
        <Interface ws={ws} emitter={emitter} />
    </Router>
    ), document.getElementById('root')
);
