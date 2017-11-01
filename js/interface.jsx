/* teleop.js
 * The main component of the React App
 */

import React from 'react';
import {
    Route,
    Switch,
    Link
} from 'react-router-dom';

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
    render() {
        return (
            <div>
            <div className="row align-items-center">
                <div className="offset-3 col-6">Tilt Up</div>
            </div>
            <div className="row align-items-center">
                <div className="col-6">Pan Left</div>
                <div className="col-6">Pan Right</div>
            </div>
            <div className="row align-items-center">
                <div className="offset-3 col-6">Tilt Down</div>
            </div>
            </div>
        );
    }
}

class BasePage extends React.Component {
    render() {
        return (
            <div>
            <div className="row align-items-center">
                <div className="offset-3 col-6">Tractor/Standby</div>
            </div>
            <div className="row align-items-center">
                <div className="col-4">Spin Left</div>
                <div className="col-4">Move Forward</div>
                <div className="col-4">Spin Right</div>
            </div>
            <div className="row align-items-center">
                <div className="col-4">Strafe Left</div>
                <div className="col-4">Move Backward</div>
                <div className="col-4">Strafe Right</div>
            </div>
            </div>
        );
    }
}

class GripperPage extends React.Component {
    render() {
        return (
            <div className="offset-1 col-10">
            <input type="range" min="-1" max="1" step="0.01"></input>
            </div>
        );
    }
}

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
    render() {
        return (
            <div>
                <Header />
                <Main />
            </div>
        );
    }
}

module.exports = Interface;
