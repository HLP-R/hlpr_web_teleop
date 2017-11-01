/* teleop.js
 * The main component of the React App
 */

import React from 'react';
import {
    Route,
    Switch,
    Link
} from 'react-router-dom';
import PropTypes from 'prop-types';

// TODO: Add in the ws support

// Navbar
class Header extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                <Link to="/"><span className="navbar-brand">Teleop</span></Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link to="/kinect"><span className="nav-link">Kinect</span></Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/base"><span className="nav-link">Base</span></Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/gripper"><span className="nav-link">Gripper</span></Link>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}

// The Components for each of the pages
class HomePage extends React.Component {
    render() {
        return (
            <div>
            <div className="row align-items-center">
                <div className="col-md-6"><Link to="/kinect">
                    Kinect
                </Link></div>
                <div className="col-md-6"><Link to="/base">
                    Base
                </Link></div>
            </div>
            <div className="row align-items-center">
                <div className="col-md-6"><Link to="/gripper">
                    Gripper
                </Link></div>
            </div>
            </div>
        );
    }
}

class KinectPage extends React.Component {
    constructor(props) {
        super(props);

        this.check_ws_timeout = null;

        this.reset = this.reset.bind(this);
        this.tiltUp = this.tiltUp.bind(this);
        this.tiltDown = this.tiltDown.bind(this);
        this.panLeft = this.panLeft.bind(this);
        this.panRight = this.panRight.bind(this);
    }

    componentDidMount() {
        // Check whether we caught the websocket with its pants down.
        var check_ws_and_send = () => {
            if (this.context.ws.readyState != 1) {
                this.check_ws_timeout = setTimeout(check_ws_and_send, 100);
            }
            this.check_ws_timeout = null;
            this.context.ws.send(JSON.stringify({ event: "MODE_KINECT" }));
        };

        this.check_ws_timeout = setTimeout(check_ws_and_send, 100);
    }

    componentWillUnmount() {
        if (!!this.check_ws_timeout) {
            clearTimeout(this.check_ws_timeout);
            this.check_ws_timeout = null;
        }
    }

    reset(e) {
        this.context.ws.send(JSON.stringify({ event: "BTN_RELEASE" }));
    }

    tiltUp(e) {
        this.context.ws.send(JSON.stringify({ event: "KINECT_TILT", value: -1 }));
    }

    tiltDown(e) {
        this.context.ws.send(JSON.stringify({ event: "KINECT_TILT", value: 1 }));
    }

    panLeft(e) {
        this.context.ws.send(JSON.stringify({ event: "KINECT_PAN", value: 1}));
    }

    panRight(e) {
        this.context.ws.send(JSON.stringify({ event: "KINECT_PAN", value: -1}));
    }

    render() {
        return (
            <div>
            <div className="row align-items-center">
                <div className="offset-3 col-6" onMouseDown={this.tiltUp} onTouchStart={this.tiltUp} onMouseUp={this.reset} onTouchEnd={this.reset}>Tilt Up</div>
            </div>
            <div className="row align-items-center">
                <div className="col-6" onMouseDown={this.panLeft} onTouchStart={this.panLeft} onMouseUp={this.reset} onTouchEnd={this.reset}>Pan Left</div>
                <div className="col-6" onMouseDown={this.panRight} onTouchStart={this.panRight} onMouseUp={this.reset} onTouchEnd={this.reset}>Pan Right</div>
            </div>
            <div className="row align-items-center">
                <div className="offset-3 col-6" onMouseDown={this.tiltDown} onTouchStart={this.tiltDown} onMouseUp={this.reset} onTouchEnd={this.reset}>Tilt Down</div>
            </div>
            </div>
        );
    }
}

KinectPage.contextTypes = {
    ws: PropTypes.object,
    emitter: PropTypes.object
};

class BasePage extends React.Component {
    constructor(props) {
        super(props);

        this.check_ws_timeout = null;

        this.reset = this.reset.bind(this);
        this.tractor = this.tractor.bind(this);
        this.standby = this.standby.bind(this);
        this.spinLeft = this.spinLeft.bind(this);
        this.spinRight = this.spinRight.bind(this);
        this.forward = this.forward.bind(this);
        this.backward = this.backward.bind(this);
        this.strafeLeft = this.strafeLeft.bind(this);
        this.strafeRight = this.strafeRight.bind(this);
    }

    componentDidMount() {
        // Check whether we caught the websocket with its pants down.
        var check_ws_and_send = () => {
            if (this.context.ws.readyState != 1) {
                this.check_ws_timeout = setTimeout(check_ws_and_send, 100);
            }
            this.check_ws_timeout = null;
            this.context.ws.send(JSON.stringify({ event: "MODE_BASE" }));
        };

        this.check_ws_timeout = setTimeout(check_ws_and_send, 100);
    }

    componentWillUnmount() {
        if (!!this.check_ws_timeout) {
            clearTimeout(this.check_ws_timeout);
            this.check_ws_timeout = null;
        }
    }

    reset(e) {
        this.context.ws.send(JSON.stringify({ event: "BTN_RELEASE" }));
    }

    tractor(e) {
        this.context.ws.send(JSON.stringify({ event: "TRACTOR" }));
    }

    standby(e) {
        this.context.ws.send(JSON.stringify({ event: "STANDBY" }));
    }

    spinLeft(e) {
        this.context.ws.send(JSON.stringify({ event: "BASE_SPIN", value: 1 }));
    }

    spinRight(e) {
        this.context.ws.send(JSON.stringify({ event: "BASE_SPIN", value: -1 }));
    }

    forward(e) {
        this.context.ws.send(JSON.stringify({ event: "BASE_FORWARD", value: 1 }));
    }

    backward(e) {
        this.context.ws.send(JSON.stringify({ event: "BASE_FORWARD", value: -1 }));
    }

    strafeLeft(e) {
        this.context.ws.send(JSON.stringify({ event: "BASE_STRAFE", value: 1 }));
    }

    strafeRight(e) {
        this.context.ws.send(JSON.stringify({ event: "BASE_STRAFE", value: -1 }));
    }

    // Change the Tractor/Standby based on the state feedback in a future
    // iteration
    render() {
        return (
            <div>
            <div className="row align-items-center">
                <div className="col-6" onMouseDown={this.tractor} onTouchStart={this.tractor} onMouseUp={this.reset} onTouchEnd={this.reset}>Tractor</div>
                <div className="col-6" onMouseDown={this.standby} onTouchStart={this.standby} onMouseUp={this.reset} onTouchEnd={this.reset}>Standby</div>
            </div>
            <div className="row align-items-center">
                <div className="col-4" onMouseDown={this.spinLeft} onTouchStart={this.spinLeft} onMouseUp={this.reset} onTouchEnd={this.reset}>Spin Left</div>
                <div className="col-4" onMouseDown={this.forward} onTouchStart={this.forward} onMouseUp={this.reset} onTouchEnd={this.reset}>Move Forward</div>
                <div className="col-4" onMouseDown={this.spinRight} onTouchStart={this.spinRight} onMouseUp={this.reset} onTouchEnd={this.reset}>Spin Right</div>
            </div>
            <div className="row align-items-center">
                <div className="col-4" onMouseDown={this.strafeLeft} onTouchStart={this.strafeLeft} onMouseUp={this.reset} onTouchEnd={this.reset}>Strafe Left</div>
                <div className="col-4" onMouseDown={this.backward} onTouchStart={this.backward} onMouseUp={this.reset} onTouchEnd={this.reset}>Move Backward</div>
                <div className="col-4" onMouseDown={this.strafeRight} onTouchStart={this.strafeRight} onMouseUp={this.reset} onTouchEnd={this.reset}>Strafe Right</div>
            </div>
            </div>
        );
    }
}

BasePage.contextTypes = {
    ws: PropTypes.object,
    emitter: PropTypes.object
};

class GripperPage extends React.Component {
    constructor(props) {
        super(props);

        this.check_ws_timeout = null;
    }

    componentDidMount() {
        // Check whether we caught the websocket with its pants down.
        var check_ws_and_send = () => {
            if (this.context.ws.readyState != 1) {
                this.check_ws_timeout = setTimeout(check_ws_and_send, 100);
            }
            this.check_ws_timeout = null;
            this.context.ws.send(JSON.stringify({ event: "MODE_GRIPPER" }));
        };

        this.check_ws_timeout = setTimeout(check_ws_and_send, 100);
    }

    componentWillUnmount() {
        if (!!this.check_ws_timeout) {
            clearTimeout(this.check_ws_timeout);
            this.check_ws_timeout = null;
        }
    }

    render() {
        return (
            <div className="offset-1 col-10">
            <input type="range" min="-1" max="1" step="0.01"></input>
            </div>
        );
    }
}

GripperPage.contextTypes = {
    ws: PropTypes.object,
    emitter: PropTypes.object
};

// The main content of the page
class Main extends React.Component {
    render() {
        return (
            <main>
            <Switch>
                <Route exact path="/" component={HomePage} />
                <Route path="/kinect" component={KinectPage} />
                <Route path="/base" component={BasePage} />
                <Route path="/gripper" component={GripperPage} />
            </Switch>
            </main>
        );
    }
}

// The app interface
class Interface extends React.Component {
    getChildContext() {
        return {
            ws: this.props.ws,
            emitter: this.props.emitter
        };
    }

    render() {
        return (
            <div>
                <Header />
                <Main />
            </div>
        );
    }
}

Interface.propTypes = {
    ws: PropTypes.object,
    emitter: PropTypes.object
};

Interface.childContextTypes = {
    ws: PropTypes.object,
    emitter: PropTypes.object
};

module.exports = Interface;
