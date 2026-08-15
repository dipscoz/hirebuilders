const express = require("express");
const { PrismaClient } = require("@prisma/client");

const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

const prisma = new PrismaClient();


// =========================================================
// CLIENT : LIRE LA CONVERSATION
// =========================================================

router.get(
  "/reservation/:reservationId",
  auth,
  async (req, res) => {
    try {
      const reservationId =
        Number(req.params.reservationId);

      const email =
        req.user.email
          ?.trim()
          .toLowerCase();

      if (
        !Number.isInteger(reservationId) ||
        !email
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Identifiant invalide.",
        });
      }

      const reservation =
        await prisma.reservation.findFirst({
          where: {
            id: reservationId,
            clientEmail: email,
          },

          select: {
            id: true,
            clientName: true,
            clientEmail: true,
            status: true,

            employee: {
              select: {
                id: true,
                name: true,
                job: true,
                city: true,
              },
            },
          },
        });

      if (!reservation) {
        return res.status(404).json({
          success: false,
          message:
            "Conversation introuvable.",
        });
      }

      const messages =
        await prisma.message.findMany({
          where: {
            reservationId,
          },

          orderBy: {
            createdAt: "asc",
          },

          include: {
            senderUser: {
              select: {
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
        });

      return res.json({
        success: true,
        reservation,
        messages,
      });
    } catch (error) {
      console.error(
        "Erreur lecture conversation client :",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Impossible de charger la conversation.",
      });
    }
  }
);


// =========================================================
// CLIENT : ENVOYER UN MESSAGE
// =========================================================

router.post(
  "/reservation/:reservationId",
  auth,
  async (req, res) => {
    try {
      const reservationId =
        Number(req.params.reservationId);

      const email =
        req.user.email
          ?.trim()
          .toLowerCase();

      const content =
        req.body?.content
          ?.trim();

      if (
        !Number.isInteger(reservationId) ||
        !email
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Identifiant invalide.",
        });
      }

      if (!content) {
        return res.status(400).json({
          success: false,
          message:
            "Le message ne peut pas être vide.",
        });
      }

      if (content.length > 3000) {
        return res.status(400).json({
          success: false,
          message:
            "Le message est trop long.",
        });
      }

      const reservation =
        await prisma.reservation.findFirst({
          where: {
            id: reservationId,
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

      const message =
        await prisma.message.create({
          data: {
            reservationId,

            senderUserId:
              Number(req.user.id),

            senderRole:
              "client",

            content,

            read: false,
          },

          include: {
            senderUser: {
              select: {
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
        });


      // =====================================================
      // NOTIFIER LES ADMINS
      // =====================================================

      const admins =
        await prisma.user.findMany({
          where: {
            role: "admin",
          },

          select: {
            id: true,
          },
        });

      if (admins.length > 0) {
        await prisma.notification.createMany({
          data: admins.map(
            (admin) => ({
              userId: admin.id,

              type:
                "message_new",

              title:
                "Nouveau message client",

              message:
                `${reservation.clientName} vous a envoyé un nouveau message.`,

              reservationId,
            })
          ),
        });
      }

      return res.status(201).json({
        success: true,
        message,
      });
    } catch (error) {
      console.error(
        "Erreur envoi message client :",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Impossible d'envoyer le message.",
      });
    }
  }
);


// =========================================================
// CLIENT : MARQUER LES MESSAGES ADMIN COMME LUS
// =========================================================

router.put(
  "/reservation/:reservationId/read",
  auth,
  async (req, res) => {
    try {
      const reservationId =
        Number(req.params.reservationId);

      const email =
        req.user.email
          ?.trim()
          .toLowerCase();

      const reservation =
        await prisma.reservation.findFirst({
          where: {
            id: reservationId,
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

      await prisma.message.updateMany({
        where: {
          reservationId,
          senderRole: "admin",
          read: false,
        },

        data: {
          read: true,
        },
      });

      return res.json({
        success: true,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          "Impossible de mettre les messages à jour.",
      });
    }
  }
);


// =========================================================
// ADMIN : LIRE UNE CONVERSATION
// =========================================================

router.get(
  "/admin/reservation/:reservationId",
  adminAuth,
  async (req, res) => {
    try {
      const reservationId =
        Number(req.params.reservationId);

      if (
        !Number.isInteger(
          reservationId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Identifiant invalide.",
        });
      }

      const reservation =
        await prisma.reservation.findUnique({
          where: {
            id: reservationId,
          },

          select: {
            id: true,
            clientName: true,
            clientEmail: true,
            phone: true,
            startDate: true,
            endDate: true,
            status: true,

            employee: {
              select: {
                id: true,
                name: true,
                job: true,
                city: true,
                phone: true,
              },
            },
          },
        });

      if (!reservation) {
        return res.status(404).json({
          success: false,
          message:
            "Réservation introuvable.",
        });
      }

      const messages =
        await prisma.message.findMany({
          where: {
            reservationId,
          },

          orderBy: {
            createdAt: "asc",
          },

          include: {
            senderUser: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                role: true,
              },
            },
          },
        });

      return res.json({
        success: true,
        reservation,
        messages,
      });
    } catch (error) {
      console.error(
        "Erreur lecture conversation admin :",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Impossible de charger la conversation.",
      });
    }
  }
);


// =========================================================
// ADMIN : ENVOYER UNE RÉPONSE
// =========================================================

router.post(
  "/admin/reservation/:reservationId",
  adminAuth,
  async (req, res) => {
    try {
      const reservationId =
        Number(req.params.reservationId);

      const content =
        req.body?.content
          ?.trim();

      if (
        !Number.isInteger(
          reservationId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Identifiant invalide.",
        });
      }

      if (!content) {
        return res.status(400).json({
          success: false,
          message:
            "Le message ne peut pas être vide.",
        });
      }

      if (content.length > 3000) {
        return res.status(400).json({
          success: false,
          message:
            "Le message est trop long.",
        });
      }

      const reservation =
        await prisma.reservation.findUnique({
          where: {
            id: reservationId,
          },
        });

      if (!reservation) {
        return res.status(404).json({
          success: false,
          message:
            "Réservation introuvable.",
        });
      }

      const message =
        await prisma.message.create({
          data: {
            reservationId,

            senderUserId:
              Number(req.user.id),

            senderRole:
              "admin",

            content,

            read: false,
          },

          include: {
            senderUser: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                role: true,
              },
            },
          },
        });


      // =====================================================
      // NOTIFIER LE CLIENT
      // =====================================================

      if (reservation.clientEmail) {
        const client =
          await prisma.user.findUnique({
            where: {
              email:
                reservation.clientEmail,
            },

            select: {
              id: true,
            },
          });

        if (client) {
          await prisma.notification.create({
            data: {
              userId:
                client.id,

              type:
                "message_new",

              title:
                "Nouveau message HireBuilders",

              message:
                "HireBuilders vous a envoyé une nouvelle réponse.",

              reservationId,
            },
          });
        }
      }

      return res.status(201).json({
        success: true,
        message,
      });
    } catch (error) {
      console.error(
        "Erreur réponse admin :",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Impossible d'envoyer la réponse.",
      });
    }
  }
);


// =========================================================
// ADMIN : LISTE DES CONVERSATIONS
// =========================================================

router.get(
  "/admin",
  adminAuth,
  async (req, res) => {
    try {
      const reservations =
        await prisma.reservation.findMany({
          orderBy: {
            createdAt: "desc",
          },

          select: {
            id: true,
            clientName: true,
            clientEmail: true,
            phone: true,
            startDate: true,
            endDate: true,
            status: true,
            createdAt: true,

            employee: {
              select: {
                id: true,
                name: true,
                job: true,
                city: true,
                phone: true,
              },
            },

            messages: {
              orderBy: {
                createdAt: "desc",
              },

              take: 1,

              select: {
                content: true,
                senderRole: true,
                createdAt: true,
                read: true,
              },
            },
          },
        });

      return res.json({
        success: true,
        reservations,
      });
    } catch (error) {
      console.error(
        "Erreur liste conversations admin :",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Impossible de charger les conversations.",
      });
    }
  }
);


module.exports = router;