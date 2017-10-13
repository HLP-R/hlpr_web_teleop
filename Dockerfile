FROM node:6

# Install the necessary packages for rosnodejs and polymer
RUN npm install -g polymer-cli bower && npm install rosnodejs

# Set the workdir
WORKDIR /usr/src
