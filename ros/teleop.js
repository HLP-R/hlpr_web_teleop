/** teleop.js
 * The interface to the ROS teleop system
 */

const rosnodejs = require('rosnodejs');
const Worker = require('webworker-threads').Worker;

// Globals for the messages
var sensor_msgs = null, std_msgs = null;

// Constants
const Buttons = {
    DTZ_REQ: 0,
    STANDBY: 2,
    TRACTOR: 3,
    KINECT_MODE: 8,
    BASE_MODE: 9,
    GRIPPER_MODE: 10
};

const Axes = {
    X: 0,
    Y: 1,
    Z: 2,
    G: 3 // Gripper amount
};

const Modes = {
    NONE: -1,
    KINECT: 0,
    BASE: 1,
    GRIPPER: 2
};

// Class for the handlers that are exposed
class Teleoperator {
    constructor() {
        // Private variables
        this._joySeq = 0;
        this._worker = null;
        this._interval = null;

        this._state = {
            mode: Modes.NONE,
            dtz_button: false,
            standby_button: false,
            tractor_button: false,
            kinect_mode: false,
            base_mode: false,
            gripper_mode: false,
            x: 0.0,
            y: 0.0,
            z: 0.0,
            g: 0.0
        };

        // Public Handles
        this.nh = null;
        this.joyPub = null;
    }

    // Helper to create a message
    _createJoyMsg() {
        var msg = new sensor_msgs.Joy({
            header: new std_msgs.Header({
                seq: this._joySeq++,
                stamp: rosnodejs.Time.now()
            }),
            axes: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            buttons: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        });

        // Some processing based on state
        if (this._state.dtz_button) {
            msg.buttons[Buttons.DTZ_REQ] = 1;
        }

        if (this._state.standby_button) {
            msg.buttons[Buttons.STANDBY] = 1;
        }

        if (this._state.tractor_button) {
            msg.buttons[Buttons.TRACTOR] = 1;
        }

        if (this._state.kinect_mode) {
            msg.buttons[Buttons.KINECT_MODE] = 1;
        }

        if (this._state.base_mode) {
            msg.buttons[Buttons.BASE_MODE] = 1;
        }

        if (this._state.gripper_mode) {
            msg.buttons[Buttons.GRIPPER_MODE] = 1;
        }

        if (this._state.mode == Modes.KINECT || this._state.mode == Modes.BASE) {
            msg.axes[Axes.X] = this._state.x;
            msg.axes[Axes.Y] = this._state.y;
            msg.axes[Axes.Z] = this._state.z;
        }

        if (this._state.mode == Modes.GRIPPER) {
            msg.axes[Axes.G] = this._state.g;
        }

        // Return the message
        return msg;
    }

    // Initialize the node handler
    initialize(nh) {
        // First initialize the global messages
        sensor_msgs = rosnodejs.require('sensor_msgs').msg;
        std_msgs = rosnodejs.require('std_msgs').msg;

        // Then the internal variables for this handler
        this.nh = nh;
        this.joyPub = nh.advertise('/joy', 'sensor_msgs/Joy');

        // Create the worker node to publish messages to /joy
        this._worker = new Worker(() => {
            this.onmessage = () => { postMessage(); };
        });
        this._worker.onmessage = () => {
            var msg = this._createJoyMsg(); // Magic is in here
            this.joyPub.publish(msg);
        };
    }

    // Flag to start the worker
    start() {
        // Make sure that there is only one interval in operation
        if (!!this._interval) {
            return;
        }

        console.log(this);

        // Set the timeout to publish messages regularly. Default is 50
        this.nh.getParam('/joy_node/autorepeat_rate')
            .then((rate) => { return rate; }, () => { return 50; })
            .then((rate) => {
                this._interval = setInterval(
                    () => { this._worker.postMessage(); },
                    1000 / (rate || 50)
                );
            }).catch(console.error);
    }

    stop() {
        if (!!this._interval) {
            clearInterval(this._interval);
            this._interval = null;
        }
    }

    // Various methods to control the state of the class. Don't forget to call
    // reset!! (Also, perhaps we should add error checking?)
    reset() {
        this._state.mode = Modes.NONE;
        this._state.dtz_button = false;
        this._state.standby_button = this._state.tractor_button = false;
        this._state.kinect_mode = this._state.base_mode = false;
        this._state.gripper_mode = false;
        this._state.x = this._state.y = this._state.z = this._state.g = 0.0;
    }

    standby_button() {
        this._state.mode = Modes.BASE;
        this._state.standby_button = true;
    }

    tractor_button() {
        this._state.mode = Modes.BASE;
        this._state.tractor_button = true;
    }

    kinect_mode() {
        this._state.mode = Modes.KINECT;
        this._state.kinect_mode = true;
    }

    base_mode() {
        this._state.mode = Modes.BASE;
        this._state.base_mode = true;
    }

    gripper_mode() {
        this._state.mode = Modes.GRIPPER;
        this._state.gripper_mode = true;
    }

    base_forward(value) {
        this._state.mode = Modes.BASE;
        this._state.y = value;
        this._state.dtz_button = true;
    }

    base_spin(value) {
        this._state.mode = Modes.BASE;
        this._state.z = value;
        this._state.dtz_button = true;
    }

    base_strafe(value) {
        this._state.mode = Modes.BASE;
        this._state.x = value;
        this._state.dtz_button = true;
    }

    kinect_pan(value) {
        this._state.mode = Modes.KINECT;
        this._state.z = value;
        this._state.dtz_button = true;
    }

    kinect_tilt(value) {
        this._state.mode = Modes.KINECT;
        this._state.y = value;
        this._state.dtz_button = true;
    }

    grip(value) {
        this._state.mode = Modes.GRIPPER;
        this._state.g = value;
    }
}

var teleop = new Teleoperator();

// Export the node handle
module.exports = teleop;
