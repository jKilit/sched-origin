const mongoose = require('mongoose');

const dateSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  }
});

const availabilitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  availableDates: [dateSchema],
  unavailableDates: [dateSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Availability', availabilitySchema);
