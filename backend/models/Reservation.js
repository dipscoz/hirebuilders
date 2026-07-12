const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ➕ CREATE RESERVATION
router.post("/", async (req, res) => {
  try {
    const {
      employeeId,
      clientName,
      startDate,
      endDate,
      days
    } = req.body;

    const reservation = await prisma.reservation.create({
      data: {
        employeeId,
        clientName,
        startDate,
        endDate,
        days,
        status: "pending"
      }
    });

    res.json(reservation);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📦 GET ALL
router.get("/", async (req, res) => {
  try {
    const data = await prisma.reservation.findMany({
      include: { employee: true }
    });

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;