const express = require("express");
const { PrismaClient } = require("@prisma/client");

const adminAuth =
  require("../middleware/adminAuth");

const router =
  express.Router();

const prisma =
  new PrismaClient();


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
        !clientName ||
        !phone ||
        !startDate ||
        !endDate ||
        !employeeId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Les champs obligatoires sont manquants.",
        });
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
              clientEmail
                ? String(
                    clientEmail
                  ).trim()
                : null,

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