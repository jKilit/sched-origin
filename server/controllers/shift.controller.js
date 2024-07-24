const Shift = require('../models/shift.model');

exports.createShift = async (req, res) => {
  try {
    const { userId, date, startTime, endTime } = req.body;
    const shift = new Shift({ userId, date, startTime, endTime });
    await shift.save();
    res.status(201).json(shift);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getShifts = async (req, res) => {
  try {
    const shifts = await Shift.find();
    res.status(200).json(shifts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateShift = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, date, startTime, endTime } = req.body;

    // Find the shift by ID
    let shift = await Shift.findById(id);
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    // Update the shift properties
    if (userId) {
      shift.userId = userId;
    }
    if (date) {
      shift.date = date;
    }
    if (startTime) {
      shift.startTime = startTime;
    }
    if (endTime) {
      shift.endTime = endTime;
    }

    // Save the updated shift
    await shift.save();

    res.status(200).json(shift);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.deleteShift = async (req, res) => {
  try {
    const { id } = req.params;
    const shift = await Shift.findByIdAndDelete(id);
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }
    res.status(200).json({ message: 'Shift deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
