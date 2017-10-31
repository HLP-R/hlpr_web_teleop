var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router-dom').HashRouter;
var Interface = require('./interface.jsx');

// TODO: Add in the websocket setup and send that to the interface

ReactDOM.render((
    <Router>
        <Interface />
    </Router>
    ), document.getElementById('root')
);
