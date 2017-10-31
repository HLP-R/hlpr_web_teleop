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
            <div style={{ height: "480px" }} className="col-md-12">
            <div className="row" style={{ height: "50%" }}>
                <span className="text-center col-md-6"><Link to="/kinect">Kinect</Link></span>
                <span className="text-center col-md-6"><Link to="/base">Base</Link></span>
            </div>
            <div className="row" style={{ height: "50%" }}>
                <span className="text-center col-md-6"><Link to="/gripper">Gripper</Link></span>
            </div>
            </div>
        );
    }
}

class KinectPage extends React.Component {
    render() {
        return (
            <h1>Kinect Control</h1>
        );
    }
}

class BasePage extends React.Component {
    render() {
        return (
            <h1>Base Control</h1>
        );
    }
}

class GripperPage extends React.Component {
    render() {
        return (
            <h1>Gripper Control</h1>
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
