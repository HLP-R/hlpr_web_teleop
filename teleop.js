/** ros.js
 * The interface to the ROS system
 */

const rosnodejs = require('rosnodejs');
const Worker = require('webworker-threads').Worker;

// Build the messages before proceeding
var msgs_promise = rosnodejs.loadAllPackages();
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

// Variable for the handlers that are exposed
class Teleoperator {
    constructor() {
        // Private variables
        this._joySeq = 0;
        this._sensor_msgs = null;
        this._std_msgs = null;
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
        }

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
            msg.axes[Axes.G] = this._state.G;
        }

        // Return the message
        return msg;
    }

    // Initialize the node handler
    initialize(nh) {
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

        // Set the timeout to publish messages regularly
        nh.getParam('/joy_node/autorepeat_rate').then((rate) => {
            this._interval = setInterval(
                () => { this._worker.postMessage(); },
                1000 / (rate || 50)
            );
        });
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

// Connect the node handle and setup the publishers. Perhaps this setup should
// be in the main routes file so that all possible classes share the node name
// and the node handle? TODO: Create a status class, and do that.
var init_promise = rosnodejs.initNode('hlpr_web_teleop');
Promise.all([msgs_promise, init_promise])
    .then(() => {
        sensor_msgs = rosnodejs.require('sensor_msgs').msg;
        std_msgs = rosnodejs.require('std_msgs').msg;

        // Expose the node handle and the published topic
        teleop.initialize(rosnodejs.nh);
    });

// Export the node handle
module.exports = teleop;
