const express = require("express");
const { PrismaClient } = require("@prisma/client");

const auth = require("../middleware/auth");

const router = express.Router();

const prisma = new PrismaClient();


// =========================================================
// MES NOTIFICATIONS
// =========================================================

router.get(
  "/",
  auth,
  async (req, res) => {
    try {
      const userId = Number(req.user.id);

      if (!Number.isInteger(userId)) {
        return res.status(401).json({
          success: false,
          message: "Utilisateur invalide.",
        });
      }

      const notifications =
        await prisma.notification.findMany({
          where: {
            userId,
          },

          orderBy: {
            createdAt: "desc",
          },

          take: 100,
        });

      const unreadCount =
        await prisma.notification.count({
          where: {
            userId,
            read: false,
          },
        });

      return res.json({
        success: true,
        notifications,
        unreadCount,
      });
    } catch (error) {
      console.error(
        "Erreur chargement notifications :",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Impossible de charger les notifications.",
      });
    }
  }
);


// =========================================================
// COMPTEUR NON LUES
// =========================================================

router.get(
  "/unread-count",
  auth,
  async (req, res) => {
    try {
      const userId = Number(req.user.id);

      if (!Number.isInteger(userId)) {
        return res.status(401).json({
          success: false,
          message: "Utilisateur invalide.",
        });
      }

      const unreadCount =
        await prisma.notification.count({
          where: {
            userId,
            read: false,
          },
        });

      return res.json({
        success: true,
        unreadCount,
      });
    } catch (error) {
      console.error(
        "Erreur compteur notifications :",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Impossible de récupérer le compteur.",
      });
    }
  }
);


// =========================================================
// MARQUER UNE NOTIFICATION LUE
// =========================================================

router.put(
  "/:id/read",
  auth,
  async (req, res) => {
    try {
      const userId = Number(req.user.id);
      const notificationId =
        Number(req.params.id);

      if (
        !Number.isInteger(userId) ||
        !Number.isInteger(notificationId)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Identifiant invalide.",
        });
      }

      const notification =
        await prisma.notification.findFirst({
          where: {
            id: notificationId,
            userId,
          },
        });

      if (!notification) {
        return res.status(404).json({
          success: false,
          message:
            "Notification introuvable.",
        });
      }

      await prisma.notification.update({
        where: {
          id: notificationId,
        },

        data: {
          read: true,
        },
      });

      return res.json({
        success: true,
      });
    } catch (error) {
      console.error(
        "Erreur lecture notification :",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Impossible de modifier la notification.",
      });
    }
  }
);


// =========================================================
// TOUT MARQUER COMME LU
// =========================================================

router.put(
  "/read-all",
  auth,
  async (req, res) => {
    try {
      const userId = Number(req.user.id);

      if (!Number.isInteger(userId)) {
        return res.status(401).json({
          success: false,
          message:
            "Utilisateur invalide.",
        });
      }

      await prisma.notification.updateMany({
        where: {
          userId,
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
      console.error(
        "Erreur lecture globale :",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Impossible de marquer les notifications comme lues.",
      });
    }
  }
);


// =========================================================
// SUPPRIMER UNE NOTIFICATION
// =========================================================

router.delete(
  "/:id",
  auth,
  async (req, res) => {
    try {
      const userId = Number(req.user.id);
      const notificationId =
        Number(req.params.id);

      if (
        !Number.isInteger(userId) ||
        !Number.isInteger(notificationId)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Identifiant invalide.",
        });
      }

      const notification =
        await prisma.notification.findFirst({
          where: {
            id: notificationId,
            userId,
          },
        });

      if (!notification) {
        return res.status(404).json({
          success: false,
          message:
            "Notification introuvable.",
        });
      }

      await prisma.notification.delete({
        where: {
          id: notificationId,
        },
      });

      return res.json({
        success: true,
      });
    } catch (error) {
      console.error(
        "Erreur suppression notification :",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Impossible de supprimer la notification.",
      });
    }
  }
);


module.exports = router;