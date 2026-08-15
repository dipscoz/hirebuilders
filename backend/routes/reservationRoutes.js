const express = require("express");
const { PrismaClient } = require("@prisma/client");

const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

const prisma = new PrismaClient();


// =========================================================
// ADMIN : TOUTES LES RÉSERVATIONS
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

      res.json(reservations);
    } catch (error) {
      console.error(
        "Erreur réservations admin :",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Erreur serveur.",
      });
    }
  }
);


// =========================================================
// CLIENT : MES RÉSERVATIONS
// =========================================================

router.get(
  "/mine",
  auth,
  async (req, res) => {
    try {
      const email =
        req.user.email
          ?.trim()
          .toLowerCase();

      if (!email) {
        return res.status(401).json({
          success: false,
          message:
            "Utilisateur invalide.",
        });
      }

      const reservations =
        await prisma.reservation.findMany({
          where: {
            clientEmail: email,
          },

          select: {
            id: true,
            clientName: true,
            clientEmail: true,
            startDate: true,
            endDate: true,
            message: true,
            status: true,
            createdAt: true,

            employee: {
              select: {
                id: true,
                name: true,
                job: true,
                city: true,
                experience: true,
                available: true,

                // IMPORTANT :
                // jamais de téléphone employé
              },
            },
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
        "Erreur mes réservations :",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Impossible de charger vos réservations.",
      });
    }
  }
);


// =========================================================
// CLIENT : CRÉER UNE RÉSERVATION
// =========================================================

router.post(
  "/",
  auth,
  async (req, res) => {
    try {
      const {
        clientName,
        phone,
        startDate,
        endDate,
        message,
        employeeId,
      } = req.body;

      const clientEmail =
        req.user.email
          ?.trim()
          .toLowerCase();

      if (!clientEmail) {
        return res.status(401).json({
          success: false,
          message:
            "Session utilisateur invalide.",
        });
      }

      if (
        !clientName ||
        !phone ||
        !startDate ||
        !endDate ||
        !employeeId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Veuillez remplir tous les champs obligatoires.",
        });
      }

      const start =
        new Date(startDate);

      const end =
        new Date(endDate);

      if (
        Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime())
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Dates invalides.",
        });
      }

      if (end < start) {
        return res.status(400).json({
          success: false,
          message:
            "La date de fin doit être après la date de début.",
        });
      }

      const employee =
        await prisma.employee.findUnique({
          where: {
            id: Number(employeeId),
          },
        });

      if (!employee) {
        return res.status(404).json({
          success: false,
          message:
            "Employé introuvable.",
        });
      }

      if (
        employee.status !== "active"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Cet employé n'est pas actuellement disponible à la réservation.",
        });
      }

      if (!employee.available) {
        return res.status(400).json({
          success: false,
          message:
            "Cet employé est actuellement indisponible.",
        });
      }

      const reservation =
        await prisma.reservation.create({
          data: {
            clientName:
              clientName.trim(),

            // IMPORTANT :
            // le serveur prend l'email
            // depuis le JWT et non
            // depuis le navigateur.
            clientEmail,

            phone:
              phone.trim(),

            startDate,

            endDate,

            message:
              message?.trim() || null,

            employeeId:
              Number(employeeId),

            status:
              "pending",
          },
        });

      return res.status(201).json({
        success: true,

        message:
          "Votre demande a été envoyée à HireBuilders.",

        reservation: {
          id: reservation.id,
          startDate:
            reservation.startDate,
          endDate:
            reservation.endDate,
          status:
            reservation.status,
        },
      });
    } catch (error) {
      console.error(
        "Erreur création réservation :",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Impossible de créer la réservation.",
      });
    }
  }
);


// =========================================================
// CLIENT : ANNULER SA RÉSERVATION
// =========================================================

router.put(
  "/:id/cancel",
  auth,
  async (req, res) => {
    try {
      const id =
        Number(req.params.id);

      const email =
        req.user.email
          ?.trim()
          .toLowerCase();

      if (!email) {
        return res.status(401).json({
          success: false,
          message:
            "Session invalide.",
        });
      }

      const reservation =
        await prisma.reservation.findFirst({
          where: {
            id,

            clientEmail: email,
          },
        });

      if (!reservation) {
        return res.status(404).json({
          success: false,
          message:
            "Réservation introuvable.",
        });
      }

      if (
        reservation.status !==
        "pending"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Cette réservation ne peut plus être annulée.",
        });
      }

      await prisma.reservation.update({
        where: {
          id,
        },

        data: {
          status:
            "cancelled",
        },
      });

      return res.json({
        success: true,

        message:
          "Réservation annulée.",
      });
    } catch (error) {
      console.error(
        "Erreur annulation :",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Impossible d'annuler la réservation.",
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

      const reservation =
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

      res.json({
        success: true,
        message:
          "Réservation acceptée.",
      });
    } catch (error) {
      console.error(
        "Erreur acceptation :",
        error
      );

      res.status(500).json({
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

      await prisma.reservation.update({
        where: {
          id,
        },

        data: {
          status:
            "rejected",
        },
      });

      res.json({
        success: true,
        message:
          "Réservation refusée.",
      });
    } catch (error) {
      console.error(
        "Erreur refus :",
        error
      );

      res.status(500).json({
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

      await prisma.reservation.delete({
        where: {
          id,
        },
      });

      res.json({
        success: true,

        message:
          "Réservation supprimée.",
      });
    } catch (error) {
      console.error(
        "Erreur suppression :",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Erreur serveur.",
      });
    }
  }
);


module.exports = router;