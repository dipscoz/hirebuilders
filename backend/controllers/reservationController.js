const Reservation = require("../models/Reservation");

// CREATE RESERVATION
exports.createReservation = async (req, res) => {
  const data = new Reservation(req.body);
  await data.save();
  res.json(data);
};

// GET ALL
exports.getReservations = async (req, res) => {
  const data = await Reservation.find();
  res.json(data);
};