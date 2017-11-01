# Web Teleop

Setup a webserver on `vector2` that can be used to teleoperate the robot/view robot status. Uses [rosnodejs](https://github.com/RethinkRobotics-opensource/rosnodejs) and [polymer](https://www.polymer-project.org/) (with inspiration from [ros-webcomponents](https://www.webcomponents.org/author/jstnhuang))

(Under development)

## TODO

Noting this down here so that it's not on a loose sheet of paper:

1. `initNode` for the ROS side needs to be in a separate process, so that future ROS nodes can also be initialized.
1. Kinect should actually be on sliders instead of velocity control.
1. Need to add state feedback. Especially important for the battery and the tractor mode.
