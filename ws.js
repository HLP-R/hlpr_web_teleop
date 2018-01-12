/** ws.js
 * Create the websocket endpoints
 */

const WebSocket = require('ws');

// Global configs
const BUTTON_TIMEOUT = 500; // timeout for resetting the button message in ms.

// Setup for heartbeat checking
function heartbeat() {
    this.isAlive = true;
}

// The endpoints are created upon the instantiation of an object of this class
var routerFactory = function (options) {
    var wss = new WebSocket.Server(options);
    var teleop = options.rosnodes[0];
    var status = options.rosnodes[1];

    // Configure the message passing for incoming client connections
    wss.on('connection', (ws, req) => {
        // If we want to do some socket validation, such as checking cookies,
        // that should go in here.

        // Setup heartbeat
        ws.isAlive = true;
        ws.on('pong', heartbeat);

        // Set up for status updates to the client
        ws.statusCb = (state) => {
            if (state.teleop_enable) {
                teleop.start();
            } else {
                teleop.stop();
            }
            ws.send(JSON.stringify(state), function (err) {
                // Suppress error messages. For some reason, when a connection
                // is killed, the callback is not getting unregistered. That's
                // a TODO for a future iteration
            });
        }
        status.addListener(ws.statusCb);

        // Setup for messages from the client
        ws.on('message', (msg) => {
            var data = JSON.parse(msg);

            // Based on the event, hit the appropriate teleop endpoint
            switch(data.event) {
            case "ENABLE":
                status.setTeleopEnable(true);
                break;
            case "DISABLE":
                status.setTeleopEnable(false);
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
                status.setBaseEnable(true); // TODO: Use a topic
                setTimeout(teleop.reset.bind(teleop), BUTTON_TIMEOUT);
                break;
            case "STANDBY":
                teleop.standby_button();
                status.setBaseEnable(false); // TODO: Use a topic
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

        // Send a status update to the client
        ws.statusCb(status.get());
    });

    // Check heartbeat
    const checkInterval = setInterval(function ping() {
        wss.clients.forEach((ws) => {
            if (!ws.isAlive) {
                status.removeListener(ws.statusCb);
                return ws.terminate();
            }

            ws.isAlive = false;
            ws.ping('', false, true);
        });
    }, 30000);

    return wss;
}

// Export the routerFactory
module.exports = routerFactory;
