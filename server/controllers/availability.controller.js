const Availability = require("../models/availability.model");

exports.setAvailability = async (req, res) => {
  try {
    const { userId, availableDates, unavailableDates } = req.body;

    let availability = await Availability.findOne({ userId });

    if (!availability) {
      availability = new Availability({
        userId,
        availableDates,
        unavailableDates,
      });
    } else {
      availability.availableDates.push(...availableDates);
      availability.unavailableDates.push(...unavailableDates);
    }

    await availability.save();

    res.status(201).json({ message: "Availability set", availability });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAvailability = async (req, res) => {
  try {
    const { userId } = req.params;
    const availability = await Availability.findOne({ userId });
    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }
    res.status(200).json(availability);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteAvailability = async (req, res) => {
  try {
    const { userId } = req.params;
    const { deleteAvailableDates, deleteUnavailableDates } = req.body;

    let availability = await Availability.findOne({ userId });
    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    if (deleteAvailableDates && deleteAvailableDates.length > 0) {
      deleteAvailableDates.forEach((dateId) => {
        availability.availableDates = availability.availableDates.filter(
          (date) => date._id.toString() !== dateId
        );
      });
    }

    if (deleteUnavailableDates && deleteUnavailableDates.length > 0) {
      deleteUnavailableDates.forEach((dateId) => {
        availability.unavailableDates = availability.unavailableDates.filter(
          (date) => date._id.toString() !== dateId
        );
      });
    }

    await availability.save();

    res.status(200).json(availability);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
