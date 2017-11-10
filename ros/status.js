/** status.js
 * The interface to the ROS status system
 */

const rosnodejs = require('rosnodejs');
const EventEmitter = require('events');

// Globals for the messages
var vector_msgs = null;

// Event Emitter
class StatusEmitter extends EventEmitter {}

// The class for the exposed status
class RobotStatus {
    constructor() {
        // Private variables
        this._state = {
            battery: -1,
            teleop_enable: false,
            base_enable: false // TODO: Get status from a subscriber
        };

        this._batterySub = null;
        this._emitter = null; // Emits the status update event

        // Public handles
        this.nh = null;
    }

    // Helper to set the state and call the update event for status
    _setState(data) {
        var updated = false;

        for (var prop in this._state) {
            if (data.hasOwnProperty(prop)) {
                this._state[prop] = data[prop];
                updated = true;
            }
        }

        if (updated) {
            this._emitter.emit('status:update', this.get());
        }
    }

    // Callback for the battery status
    _batteryMsg(msg) {
        this._setState({ battery: msg.battery_soc });
    }

    // Update the enable/disable status of teleop
    setTeleopEnable(value) {
        this._setState({ teleop_enable: value });
    }

    // Update the enable/disable status of teleop. TODO: Use subscriber
    setBaseEnable(value) {
        this._setState({ base_enable: value });
    }

    // Initialize the node handler
    initialize(nh) {
        vector_msgs = rosnodejs.require('vector_msgs').msg;

        // Set the internal variables
        this.nh = nh;
        this._emitter = new StatusEmitter();

        // Subscribe to the ROS Topics
        this._batterySub = nh.subscribe(
            '/vector/feedback/battery',
            'vector_msgs/Battery',
            this._batteryMsg.bind(this),
            { queueSize: 1, throttleMs: 1000 }
        );
    }

    // Add status listeners
    addListener(callback) {
        if (!!callback && typeof callback === 'function') {
            this._emitter.addListener('status:update', callback);
        }
    }

    // Remove status listener
    removeListener(callback) {
        if (!!callback && typeof callback === 'function') {
            this._emitter.removeListener('status:update', callback);
        }
    }

    // Return the status
    get() {
        return this._state;
    }
}

var status = new RobotStatus();

// Export the node handle
module.exports = status;
