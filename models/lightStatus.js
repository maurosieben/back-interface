var mongoose = require('mongoose');

var lightStatus = {
  current: { type: Number }
  ,dimmer: { type: Number }
  ,rssi: { type: Number }
  ,status: { type: String }
};

module.exports = new mongoose.Schema(lightStatus);
module.exports.lightStatus = lightStatus;
