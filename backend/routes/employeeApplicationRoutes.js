const express = require("express");
const { PrismaClient } = require("@prisma/client");

const auth = require("../middleware/auth");

const router = express.Router();

const prisma = new PrismaClient();


// =========================================================
// RECUPERER MA CANDIDATURE
// =========================================================

router.get(
  "/me",
  auth,
  async (req, res) => {
    try {
      const userId =
        Number(req.user.id);

      if (!Number.isInteger(userId)) {
        return res.status(401).json({
          success: false,
          message:
            "Utilisateur invalide.",
        });
      }

      const employee =
        await prisma.employee.findUnique({
          where: {
            userId,
          },
        });

      return res.json({
        success: true,

        application:
          employee || null,
      });
    } catch (error) {
      console.error(
        "Erreur candidature employé :",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Impossible de récupérer votre candidature.",
      });
    }
  }
);


// =========================================================
// POSTULER COMME EMPLOYE
// =========================================================

router.post(
  "/",
  auth,
  async (req, res) => {
    try {
      const userId =
        Number(req.user.id);

      if (!Number.isInteger(userId)) {
        return res.status(401).json({
          success: false,
          message:
            "Utilisateur invalide.",
        });
      }

      const {
        name,
        phone,
        job,
        city,
        experience,
      } = req.body;


      // =====================================================
      // VALIDATION
      // =====================================================

      if (
        !name ||
        !phone ||
        !job ||
        !city ||
        !experience
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Veuillez remplir tous les champs.",
        });
      }


      const cleanName =
        name.trim();

      const cleanPhone =
        phone.trim();

      const cleanJob =
        job.trim();

      const cleanCity =
        city.trim();

      const cleanExperience =
        experience.trim();


      if (
        !cleanName ||
        !cleanPhone ||
        !cleanJob ||
        !cleanCity ||
        !cleanExperience
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Tous les champs sont obligatoires.",
        });
      }


      // =====================================================
      // VERIFIER LE COMPTE
      // =====================================================

      const user =
        await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });

      if (!user) {
        return res.status(401).json({
          success: false,

          message:
            "Compte utilisateur introuvable.",
        });
      }


      // =====================================================
      // VERIFIER CANDIDATURE EXISTANTE
      // =====================================================

      const existing =
        await prisma.employee.findUnique({
          where: {
            userId,
          },
        });

      if (existing) {
        return res.status(409).json({
          success: false,

          message:
            existing.status === "pending"
              ? "Votre candidature est déjà en attente de validation."
              : existing.status === "active"
                ? "Vous êtes déjà enregistré comme employé HireBuilders."
                : "Vous avez déjà une candidature. Contactez HireBuilders pour plus d'informations.",

          application:
            existing,
        });
      }


      // =====================================================
      // CREER LA CANDIDATURE
      // =====================================================

      const employee =
        await prisma.employee.create({
          data: {
            userId,

            name:
              cleanName,

            phone:
              cleanPhone,

            job:
              cleanJob,

            city:
              cleanCity,

            experience:
              cleanExperience,

            available:
              false,

            status:
              "pending",
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
          data:
            admins.map(
              (admin) => ({
                userId:
                  admin.id,

                type:
                  "employee_application",

                title:
                  "Nouvelle candidature employé",

                message:
                  `${cleanName} souhaite rejoindre HireBuilders comme ${cleanJob}.`,

              })
            ),
        });
      }


      return res.status(201).json({
        success: true,

        message:
          "Votre candidature a été envoyée. Elle sera vérifiée par HireBuilders.",

        application:
          employee,
      });
    } catch (error) {
      console.error(
        "Erreur candidature employé :",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Impossible d'envoyer votre candidature.",
      });
    }
  }
);


module.exports = router;