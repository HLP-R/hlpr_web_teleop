/** ws.js
 * Create the websocket endpoints
 */

const WebSocket = require('ws');

// Initialize the ROS system  TODO: Enable post development. Maybe move to WS
// const rosnodejs = require('rosnodejs');
// var msgs_promise = rosnodejs.loadAllPackages();
// var init_promise = rosnodejs.initNode('hlpr_web_teleop');

// Fetch the ROS API
// var teleop = require('./ros/teleop');

// Complete the ROS Initialization.
// Promise.all([msgs_promise, init_promise])
//     .then(() => {
//         teleop.initialize(rosnodejs.nh);
//     });

// Global configs
const BUTTON_TIMEOUT = 500; // timeout for resetting the button message in ms.

// The endpoints are created upon the instantiation of an object of this class
var router = function (options) {
    var wss = new WebSocket.Server(options);

    wss.on('connection', (ws, req) => {
        // If we want to do some socket validation, such as checking cookies,
        // that should go in here

        ws.on('message', (msg) => {
            var data = JSON.parse(msg);

            // Based on the event, hit the appropriate teleop endpoint
            switch(data.event) {
            case "MODE_KINECT":
                console.log("Navigated to Kinect");
                setTimeout(() => { console.log("Reset"); }, BUTTON_TIMEOUT);
                break;
            case "MODE_BASE":
                console.log("Navigated to Base");
                setTimeout(() => { console.log("Reset"); }, BUTTON_TIMEOUT);
                break;
            case "MODE_GRIPPER":
                console.log("Navigated to Gripper");
                setTimeout(() => { console.log("Reset"); }, BUTTON_TIMEOUT);
                break;
            case "TRACTOR":
                console.log("Tractor Mode Engaged");
                setTimeout(() => { console.log("Reset"); }, BUTTON_TIMEOUT);
                break;
            case "STANDBY":
                console.log("Standby Mode Engaged");
                setTimeout(() => { console.log("Reset"); }, BUTTON_TIMEOUT);
                break;
            case "KINECT_PAN":
                console.log("Kinect Pan: " + data.value);
                break;
            case "KINECT_TILT":
                console.log("Kinect Tilt: " + data.value);
                break;
            case "BASE_FORWARD":
                console.log("Base Forward: " + data.value);
                break;
            case "BASE_SPIN":
                console.log("Base Spin: " + data.value);
                break;
            case "BASE_STRAFE":
                console.log("Base Strafe: " + data.value);
                break;
            case "GRIP_CMD":
                console.log("Grip Command: " + data.value);
                break;
            case "BTN_RELEASE":
                console.log("Reset");
                break;
            }
        });
    });

    return wss;
}

// Export the router
module.exports = router;
