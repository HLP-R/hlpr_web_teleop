# Web Teleop

This node package provides the teleoperation interface to HLP-R. It uses [`rosnodejs`](https://github.com/RethinkRobotics-opensource/rosnodejs) as the ROS interface, [`ws`](https://github.com/websockets/ws) as the websocket interface, and [`express`](https://expressjs.com/) as the HTTP server. The package is designed to work with [`hlpr_node_server`](https://github.com/HLP-R/hlpr_node_server).

## Running

**With `hlpr_node_server` (Recommended)**

1. Add this folder (you may symlink) to the `apps` directory of `hlpr_node_server`.
1. Run `npm install` in the root directory of `hlpr_node_server`.
1. Run `npm start` in the root directory of `hlpr_node_server` and navigate to the address `http://localhost:8000/teleop`.

**Without `hlpr_node_server` (Not Recommended)**

(I really don't recommend it, but if you absolutely must, then copy the `server.js` in `hlpr_node_server`).

## Files Overview

`html`: Contains a single teleoperation page template that is hydrated by `react` using the code in `js`.

`static`: CSS, images, fonts.

`js`:

1. `interface.jsx`: React code defining the components for the teleoperation interface. The list of components defined in this file are:
	- Interface: The overarching component
	- Header: The navbar header for the page
	- Main: The wrapper for the components that follow, which actually display the interface. `Main` uses `react-router` to decide the component to display.
	- HomePage: The root page of the static page
	- KinectPage: Component with interface to the teleop of the Kinect.
	- BasePage: Component with the interface to teleop the robot base.
	- GripperPage: Component with the interface to the teleop of the gripper.
1. `teleop.js`: Entrypoint into the components in the previous file when rendered on the web browser.

`ros`: Exports classes. For the interface methods to these classes, simply inspect the code; it's quite straightforward.

1. `teleop.js`: Exports an object that is designed to provide a teleop interface in ROS. You need to call `obj.initialize(node_handle)` on the object with a ROS node handle in order to use it.
1. `status.js`: Exports an object that uses the event emitter interface to notify the web components of events in ROS. Just like `teleop.js`, it can be used once `obj.initialize(node_handle)` is called.

`routes.js`: A factory module to setup the main express route to serve the HTML template and the static pages. To initialize the router object, pass initialized objects of the type `ros/teleop.js` and `ros/status.js`.

`ws.js`: A factory module that sets up the Websocket endpoints for teleoperation. To initialize the endpoint, pass initialized objects of the type `ros/teleop.js` and `ros/status.js`.
