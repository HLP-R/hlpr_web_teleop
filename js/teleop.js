var React = require('react');
var ReactDOM = require('react-dom');
var Interface = require('./interface.jsx');
var element = React.createElement(Interface, {}, null);
ReactDOM.render(
    element, document.getElementById('root')
);
