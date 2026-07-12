const router = require("express").Router();

const {
  createReservation,
  getReservations
} = require("../controllers/reservationController");

router.post("/", createReservation);
router.get("/", getReservations);

module.exports = router;