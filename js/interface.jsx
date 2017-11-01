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

// Components that can be used internally
class RangeSlider extends React.Component {
    constructor(props) {
        super(props);

        this.resetListener = null;
    }

    componentDidMount() {
        // Initialize the slider scripts
        switch (this.props.type) {
        case "half-right-round":
            $(this.slider).roundSlider({
                radius: 100,
                circleShape: "half-right",
                showTooltip: false,
                value: this.props.start,
                min: this.props.min,
                max: this.props.max,
                step: this.props.step,
                change: (e) => this.props.onChange(e.value)
            });

            this.resetListener = () => { $(this.slider).roundSlider("option", "value", this.props.start); };
            break;
        case "half-top-round":
            $(this.slider).roundSlider({
                radius: 100,
                circleShape: "half-top",
                showTooltip: false,
                value: this.props.start,
                min: this.props.min,
                max: this.props.max,
                step: this.props.step,
                change: (e) => this.props.onChange(e.value)
            });

            this.resetListener = () => { $(this.slider).roundSlider("option", "value", this.props.start); };
            break;
        case "vertical":
            this.slider.setAttribute("style", "height: 100px");
            noUiSlider.create(this.slider, {
                start: [ this.props.start ],
                orientation: "vertical",
                step: this.props.step,
                range: {
                    'min': [ this.props.min ],
                    'max': [ this.props.max ]
                }
            });
            this.slider.noUiSlider.on('change', (e) => this.props.onChange(e[0]));

            // Setup reset listeners
            this.resetListener = () => { this.slider.noUiSlider.set(this.props.start); };
            break;
        case "horizontal":
        default:
            noUiSlider.create(this.slider, {
                start: [ this.props.start ],
                step: this.props.step,
                range: {
                    'min': [ this.props.min ],
                    'max': [ this.props.max ]
                }
            });
            this.slider.noUiSlider.on('change', (e) => this.props.onChange(e[0]));

            // Setup reset listeners
            this.resetListener = () => { this.slider.noUiSlider.set(this.props.start); };
            break;
        }

        // Setup the reset listener
        this.context.emitter.on(this.props.reset, this.resetListener);
    }

    componentWillUnmount() {
        switch (this.props.type) {
        case "half-right-round":
        case "half-top-round":
            $(this.slider).roundSlider("destroy");
            break;
        case "vertical":
        case "horizontal":
        default:
            this.slider.noUiSlider.destroy();
            break;
        }

        // Remove the reset listener
        this.context.emitter.off(this.props.reset, this.resetListener);
        this.resetListener = null;
    }

    render() {
        return (
            <div ref={elem => this.slider = elem}></div>
        );
    }
}

RangeSlider.contextTypes = {
    emitter: PropTypes.object
};

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
        this.tiltChange = this.tiltChange.bind(this);
        this.panChange = this.panChange.bind(this);
    }

    componentDidMount() {
        // Check whether we caught the websocket with its pants down.
        var check_ws_and_send = () => {
            if (this.context.ws.readyState != 1) {
                this.check_ws_timeout = setTimeout(check_ws_and_send, 100);
                return;
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
        this.context.emitter.emit("kinect:reset");
    }

    tiltChange(val) {
        this.context.ws.send(JSON.stringify({ event: "KINECT_TILT", value: val }));
    }

    panChange(val) {
        this.context.ws.send(JSON.stringify({ event: "KINECT_PAN", value: val }));
    }

    render() {
        return (
            <div>
            <div className="mt-4 row">
                <div className="offset-3 col-6 btn btn-warning" onClick={this.reset}>Reset</div>
            </div>
            <div className="mt-4 row align-items-center">
            <table className="col-md-6">
            <tbody>
            <tr>
                <td width="40%">
                    <img src="/teleop/static/kinect-tilt.png" className="img-fluid" />
                    <h3 className="text-center">Tilt</h3>
                </td>
                <td width="60%">
                <RangeSlider type="half-right-round" min={-1} max={1} step={0.01} start={0} onChange={this.tiltChange} reset="kinect:reset" />
                </td>
            </tr>
            </tbody>
            </table>
            <table className="col-md-6">
            <tbody>
            <tr>
                <td width="40%">
                    <img src="/teleop/static/kinect-pan.png" className="img-fluid" />
                    <h3 className="text-center">Pan</h3>
                </td>
                <td width="60%">
                <RangeSlider type="half-top-round" min={-1} max={1} step={0.01} start={0} onChange={this.panChange} reset="kinect:reset" />
                </td>
            </tr>
            </tbody>
            </table>
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
            <div className="mt-4 row">
                <div className="offset-1 col-4 btn btn-warning" onClick={this.tractor}>Enable</div>
                <div className="offset-2 col-4 btn btn-warning" onClick={this.standby}>Disable</div>
            </div>
            <div className="mt-4 row text-center">
                <div className="offset-1 col-2 btn btn-info" onMouseDown={this.spinLeft} onTouchStart={this.spinLeft} onMouseUp={this.reset} onTouchEnd={this.reset}>
                    <span className="fa fa-rotate-left fa-2x"></span>
                </div>
                <div className="offset-2 col-2 btn btn-secondary" onMouseDown={this.forward} onTouchStart={this.forward} onMouseUp={this.reset} onTouchEnd={this.reset}>
                    <span className="fa fa-long-arrow-up fa-2x"></span>
                </div>
                <div className="offset-2 col-2 btn btn-info" onMouseDown={this.spinRight} onTouchStart={this.spinRight} onMouseUp={this.reset} onTouchEnd={this.reset}>
                    <span className="fa fa-rotate-right fa-2x"></span>
                </div>
            </div>
            <div className="mt-4 row text-center">
                <div className="offset-1 col-2 btn btn-secondary" onMouseDown={this.strafeLeft} onTouchStart={this.strafeLeft} onMouseUp={this.reset} onTouchEnd={this.reset}>
                    <span className="fa fa-long-arrow-left fa-2x"></span>
                </div>
                <div className="offset-2 col-2 btn btn-secondary" onMouseDown={this.backward} onTouchStart={this.backward} onMouseUp={this.reset} onTouchEnd={this.reset}>
                    <span className="fa fa-long-arrow-down fa-2x"></span>
                </div>
                <div className="offset-2 col-2 btn btn-secondary" onMouseDown={this.strafeRight} onTouchStart={this.strafeRight} onMouseUp={this.reset} onTouchEnd={this.reset}>
                    <span className="fa fa-long-arrow-right fa-2x"></span>
                </div>
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

        this.reset = this.reset.bind(this);
        this.gripChange = this.gripChange.bind(this);
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

    reset(e) {
        this.context.ws.send(JSON.stringify({ event: "BTN_RELEASE" }));
        this.context.emitter.emit("gripper:reset");
    }

    gripChange(val) {
        this.context.ws.send(JSON.stringify({ event: "GRIP_CMD", value: val }));
    }

    render() {
        return (
            <div>
            <div className="mt-4 row">
                <div className="offset-3 col-6 btn btn-warning" onClick={this.reset}>Reset</div>
            </div>
            <div className="mt-4 row align-items-center">
                <div className="col-3 text-center">
                    <img src="/teleop/static/gripper-close.png" className="img-fluid" />
                </div>
                <div className="col-6">
                <RangeSlider type="horizontal" min={-1} max={1} step={0.01} start={0} onChange={this.gripChange} reset="gripper:reset" />
                </div>
                <div className="col-3 text-center">
                    <img src="/teleop/static/gripper-open.png" className="img-fluid" />
                </div>
            </div>
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
