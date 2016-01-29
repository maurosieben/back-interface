var mongoose = require('mongoose');

var lightsMin = ({
  tag: {
      type: String,
      required: true
  },
  deviceAddress: {
      type: String,
      required: true
  }
});

var groups = {
  name: {
      type: String,
      required: true
  }
  ,temperature: {
      type: Number,
      required: true
  }
  ,dimmer: {
      type: String,
      required: true
  }
  ,current: {
      type: Number,
      required: true
  }
  ,power: {
      type: Number,
      required: true
  }
  ,voltage: {
      type: Number
  }
  ,lights: [lightsMin]
};

module.exports = mongoose.model('groups', groups);
//
// module.exports = new mongoose.Schema(groupMasterSchema);
// module.exports.groupMasterSchema = groupMasterSchema;
