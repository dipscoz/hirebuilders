const express = require("express");
const { PrismaClient } = require("@prisma/client");

const adminAuth =
  require("../middleware/adminAuth");
const auth =
  require("../middleware/auth");

const router =
  express.Router();

const prisma =
  new PrismaClient();

const ADMIN_EMAILS = new Set([
  "dipscoz@gmail.com",
  "ndeyebirametall50@gmail.com",
]);

// Réservations visibles uniquement par le compte client associé à l'adresse.
router.get("/mine", auth, async (req, res) => {
  try {
    const email = String(req.user?.email || "").trim().toLowerCase();
    if (!email) return res.status(401).json({ success: false, message: "Session invalide." });

    const reservations = await prisma.reservation.findMany({
      where: { clientEmail: email },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            job: true,
            city: true,
            experience: true,
            available: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ success: true, reservations });
  } catch (error) {
    console.error("Erreur récupération réservations client :", error);
    return res.status(500).json({ success: false, message: "Impossible de charger vos réservations." });
  }
});

// Annulation par le client propriétaire ou un administrateur authentifié.
router.put("/:id/cancel", auth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ success: false, message: "Réservation invalide." });

    const reservation = await prisma.reservation.findUnique({ where: { id } });
    if (!reservation) return res.status(404).json({ success: false, message: "Réservation introuvable." });

    const userEmail = String(req.user?.email || "").trim().toLowerCase();
    const isAdmin = String(req.user?.role || "").toLowerCase() === "admin" || ADMIN_EMAILS.has(userEmail);
    const ownsReservation = userEmail === String(reservation.clientEmail || "").trim().toLowerCase();
    if (!isAdmin && !ownsReservation) return res.status(403).json({ success: false, message: "Vous ne pouvez pas annuler cette réservation." });
    if (reservation.status !== "pending") return res.status(409).json({ success: false, message: "Seules les réservations en attente peuvent être annulées." });

    const result = await prisma.reservation.updateMany({ where: { id, status: "pending" }, data: { status: "cancelled" } });
    if (result.count !== 1) return res.status(409).json({ success: false, message: "Cette réservation a déjà été traitée." });
    const updated = await prisma.reservation.findUnique({ where: { id } });
    return res.json({ success: true, message: "Réservation annulée.", reservation: updated });
  } catch (error) {
    console.error("Erreur annulation réservation :", error);
    return res.status(500).json({ success: false, message: "Impossible d'annuler cette réservation." });
  }
});


// =========================================================
// ADMIN : TOUTES LES RESERVATIONS
// =========================================================

router.get(
  "/",
  adminAuth,
  async (req, res) => {
    try {
      const reservations =
        await prisma.reservation.findMany({
          include: {
            employee: true,
          },

          orderBy: {
            createdAt: "desc",
          },
        });

      return res.json({
        success: true,
        reservations,
      });
    } catch (error) {
      console.error(
        "Erreur récupération réservations :",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Erreur serveur.",
      });
    }
  }
);


// =========================================================
// CREER UNE RESERVATION
// =========================================================

router.post(
  "/",
  async (req, res) => {
    try {
      const {
        clientName,
        clientEmail,
        phone,
        startDate,
        endDate,
        message,
        employeeId,
      } = req.body;


      // -----------------------------------------------------
      // VALIDATION
      // -----------------------------------------------------

      if (
        typeof clientName !== "string" || !clientName.trim() ||
        typeof clientEmail !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail.trim()) ||
        typeof phone !== "string" || !phone.trim() ||
        typeof startDate !== "string" || !startDate.trim() ||
        typeof endDate !== "string" || !endDate.trim() ||
        !employeeId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Les champs obligatoires sont manquants.",
        });
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
        return res.status(400).json({ success: false, message: "La date de fin doit être après la date de début." });
      }


      const employeeIdNumber =
        Number(employeeId);


      if (
        !Number.isInteger(
          employeeIdNumber
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Employé invalide.",
        });
      }


      // -----------------------------------------------------
      // VERIFIER EMPLOYE
      // -----------------------------------------------------

      const employee =
        await prisma.employee.findUnique({
          where: {
            id:
              employeeIdNumber,
          },
        });


      if (!employee) {
        return res.status(404).json({
          success: false,
          message:
            "Employé introuvable.",
        });
      }


      // -----------------------------------------------------
      // SEUL UN EMPLOYE APPROUVE PEUT ETRE RESERVE
      // -----------------------------------------------------

      if (
        employee.status !==
        "active"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Cet employé n'est pas disponible sur la plateforme.",
        });
      }


      const reservation =
        await prisma.reservation.create({
          data: {
            clientName:
              String(
                clientName
              ).trim(),

            clientEmail:
              String(clientEmail).trim().toLowerCase(),

            phone:
              String(
                phone
              ).trim(),

            startDate:
              String(
                startDate
              ).trim(),

            endDate:
              String(
                endDate
              ).trim(),

            message:
              message
                ? String(
                    message
                  ).trim()
                : null,

            employeeId:
              employeeIdNumber,

            status:
              "pending",
          },
        });


      // -----------------------------------------------------
      // NOTIFICATION AUX ADMINS
      // -----------------------------------------------------

      const admins =
        await prisma.user.findMany({
          where: {
            role: "admin",
          },

          select: {
            id: true,
          },
        });


      if (
        admins.length >
        0
      ) {
        await prisma.notification.createMany({
          data:
            admins.map(
              (admin) => ({
                userId:
                  admin.id,

                type:
                  "new_reservation",

                title:
                  "Nouvelle réservation",

                message:
                  `${clientName} demande ${employee.name} du ${startDate} au ${endDate}.`,

                reservationId:
                  reservation.id,
              })
            ),
        });
      }


      return res.status(201).json({
        success: true,

        message:
          "Votre demande a été envoyée à HireBuilders.",

        reservation,
      });
    } catch (error) {
      console.error(
        "Erreur création réservation :",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Erreur serveur.",
      });
    }
  }
);


// =========================================================
// ADMIN : ACCEPTER
// =========================================================

router.put(
  "/:id/accept",
  adminAuth,
  async (req, res) => {
    try {
      const id =
        Number(req.params.id);

      if (
        !Number.isInteger(id)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Réservation invalide.",
        });
      }


      const reservation =
        await prisma.reservation.findUnique({
          where: {
            id,
          },
        });


      if (!reservation) {
        return res.status(404).json({
          success: false,
          message:
            "Réservation introuvable.",
        });
      }


      const updatedReservation =
        await prisma.reservation.update({
          where: {
            id,
          },

          data: {
            status:
              "accepted",
          },
        });


      await prisma.employee.update({
        where: {
          id:
            reservation.employeeId,
        },

        data: {
          status:
            "active",

          available:
            false,
        },
      });


      return res.json({
        success: true,

        message:
          "Réservation acceptée.",

        reservation:
          updatedReservation,
      });
    } catch (error) {
      console.error(
        "Erreur acceptation réservation :",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Erreur serveur.",
      });
    }
  }
);


// =========================================================
// ADMIN : REFUSER
// =========================================================

router.put(
  "/:id/reject",
  adminAuth,
  async (req, res) => {
    try {
      const id =
        Number(req.params.id);

      if (
        !Number.isInteger(id)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Réservation invalide.",
        });
      }


      const reservation =
        await prisma.reservation.findUnique({
          where: {
            id,
          },

          include: {
            employee: true,
          },
        });


      if (!reservation) {
        return res.status(404).json({
          success: false,
          message:
            "Réservation introuvable.",
        });
      }


      const updatedReservation =
        await prisma.reservation.update({
          where: {
            id,
          },

          data: {
            status:
              "rejected",
          },
        });


      // -----------------------------------------------------
      // REMETTRE L'EMPLOYE DISPONIBLE
      // -----------------------------------------------------

      if (
        reservation.employee
      ) {
        await prisma.employee.update({
          where: {
            id:
              reservation.employeeId,
          },

          data: {
            available:
              true,

            status:
              "active",
          },
        });
      }


      return res.json({
        success: true,

        message:
          "Réservation refusée.",

        reservation:
          updatedReservation,
      });
    } catch (error) {
      console.error(
        "Erreur refus réservation :",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Erreur serveur.",
      });
    }
  }
);


// =========================================================
// ADMIN : SUPPRIMER
// =========================================================

router.delete(
  "/:id",
  adminAuth,
  async (req, res) => {
    try {
      const id =
        Number(req.params.id);

      if (
        !Number.isInteger(id)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Réservation invalide.",
        });
      }


      const reservation =
        await prisma.reservation.findUnique({
          where: {
            id,
          },
        });


      if (!reservation) {
        return res.status(404).json({
          success: false,
          message:
            "Réservation introuvable.",
        });
      }


      await prisma.reservation.delete({
        where: {
          id,
        },
      });


      return res.json({
        success: true,

        message:
          "Réservation supprimée.",
      });
    } catch (error) {
      console.error(
        "Erreur suppression réservation :",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Erreur serveur.",
      });
    }
  }
);


module.exports =
  router;
