/** ws.js
 * Create the websocket endpoints
 */

const WebSocket = require('ws');

// Global configs
const BUTTON_TIMEOUT = 500; // timeout for resetting the button message in ms.

// The endpoints are created upon the instantiation of an object of this class
var routerFactory = function (options) {
    var wss = new WebSocket.Server(options);
    var teleop = options.rosnodes[0];

    wss.on('connection', (ws, req) => {
        // If we want to do some socket validation, such as checking cookies,
        // that should go in here.

        // Send the initial message response on connection with the state info

        ws.on('message', (msg) => {
            var data = JSON.parse(msg);

            // Based on the event, hit the appropriate teleop endpoint
            switch(data.event) {
            case "ENABLE":
                teleop.start();
                break;
            case "DISABLE":
                teleop.stop();
                break;
            case "MODE_KINECT":
                teleop.kinect_mode();
                setTimeout(teleop.reset.bind(teleop), BUTTON_TIMEOUT);
                break;
            case "MODE_BASE":
                teleop.base_mode();
                setTimeout(teleop.reset.bind(teleop), BUTTON_TIMEOUT);
                break;
            case "MODE_GRIPPER":
                teleop.gripper_mode();
                setTimeout(teleop.reset.bind(teleop), BUTTON_TIMEOUT);
                break;
            case "TRACTOR":
                teleop.tractor_button();
                setTimeout(teleop.reset.bind(teleop), BUTTON_TIMEOUT);
                break;
            case "STANDBY":
                teleop.standby_button();
                setTimeout(teleop.reset.bind(teleop), BUTTON_TIMEOUT);
                break;
            case "KINECT_PAN":
                teleop.kinect_pan(data.value);
                break;
            case "KINECT_TILT":
                teleop.kinect_tilt(data.value);
                break;
            case "BASE_FORWARD":
                teleop.base_forward(data.value);
                break;
            case "BASE_SPIN":
                teleop.base_spin(data.value);
                break;
            case "BASE_STRAFE":
                teleop.base_strafe(data.value);
                break;
            case "GRIP_CMD":
                teleop.grip(data.value);
                break;
            case "BTN_RELEASE":
                teleop.reset();
                break;
            }
        });
    });

    return wss;
}

// Export the routerFactory
module.exports = routerFactory;
