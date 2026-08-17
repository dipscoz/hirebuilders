const express = require("express");
const { PrismaClient } = require("@prisma/client");

const adminAuth =
  require("../middleware/adminAuth");

const router =
  express.Router();

const prisma =
  new PrismaClient();


// =========================================================
// PUBLIC : LISTE DES EMPLOYES APPROUVES
// =========================================================

router.get(
  "/",
  async (req, res) => {
    try {
      const employees =
        await prisma.employee.findMany({
          where: {
            status:
              "active",
          },

          select: {
            id: true,

            name: true,

            job: true,

            city: true,

            experience: true,

            available: true,

            status: true,

            createdAt: true,

            // IMPORTANT :
            // phone N'EST PAS RETOURNE
          },

          orderBy: {
            createdAt: "desc",
          },
        });


      return res.json({
        success: true,

        employees,
      });
    } catch (error) {
      console.error(
        "Erreur liste publique employés :",
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
// PUBLIC : DETAIL D'UN EMPLOYE APPROUVE
// =========================================================

router.get(
  "/:id",
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
            "Employé invalide.",
        });
      }


      const employee =
        await prisma.employee.findFirst({
          where: {
            id,

            status:
              "active",
          },

          select: {
            id: true,

            name: true,

            job: true,

            city: true,

            experience: true,

            available: true,

            status: true,

            createdAt: true,
          },
        });


      if (!employee) {
        return res.status(404).json({
          success: false,

          message:
            "Employé introuvable.",
        });
      }


      return res.json({
        success: true,

        employee,
      });
    } catch (error) {
      console.error(
        "Erreur détail public employé :",
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
// ADMIN : TOUS LES EMPLOYES
// =========================================================

router.get(
  "/admin/all",
  adminAuth,
  async (req, res) => {
    try {
      const employees =
        await prisma.employee.findMany({
          orderBy: {
            createdAt: "desc",
          },
        });


      return res.json({
        success: true,

        employees,
      });
    } catch (error) {
      console.error(
        "Erreur admin employés :",
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
// ADMIN : AJOUTER UN EMPLOYE
// =========================================================

router.post(
  "/",
  adminAuth,
  async (req, res) => {
    try {
      const {
        name,
        phone,
        job,
        city,
        experience,
      } = req.body;


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
            "Tous les champs sont obligatoires.",
        });
      }


      const employee =
        await prisma.employee.create({
          data: {
            name:
              String(name).trim(),

            phone:
              String(phone).trim(),

            job:
              String(job).trim(),

            city:
              String(city).trim(),

            experience:
              String(
                experience
              ).trim(),

            available:
              true,

            status:
              "active",
          },
        });


      return res.status(201).json({
        success: true,

        message:
          "Employé créé avec succès.",

        employee,
      });
    } catch (error) {
      console.error(
        "Erreur ajout employé :",
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
// ADMIN : MODIFIER
// =========================================================

router.put(
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
            "Employé invalide.",
        });
      }


      const {
        name,
        phone,
        job,
        city,
        experience,
        available,
        status,
      } = req.body;


      const existing =
        await prisma.employee.findUnique({
          where: {
            id,
          },
        });


      if (!existing) {
        return res.status(404).json({
          success: false,

          message:
            "Employé introuvable.",
        });
      }


      const data = {};


      if (
        typeof name ===
        "string"
      ) {
        data.name =
          name.trim();
      }


      if (
        typeof phone ===
        "string"
      ) {
        data.phone =
          phone.trim();
      }


      if (
        typeof job ===
        "string"
      ) {
        data.job =
          job.trim();
      }


      if (
        typeof city ===
        "string"
      ) {
        data.city =
          city.trim();
      }


      if (
        typeof experience ===
        "string"
      ) {
        data.experience =
          experience.trim();
      }


      if (
        typeof available ===
        "boolean"
      ) {
        data.available =
          available;
      }


      if (
        typeof status ===
        "string"
      ) {
        data.status =
          status;
      }


      const employee =
        await prisma.employee.update({
          where: {
            id,
          },

          data,
        });


      return res.json({
        success: true,

        message:
          "Employé modifié avec succès.",

        employee,
      });
    } catch (error) {
      console.error(
        "Erreur modification employé :",
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
            "Employé invalide.",
        });
      }


      const existing =
        await prisma.employee.findUnique({
          where: {
            id,
          },
        });


      if (!existing) {
        return res.status(404).json({
          success: false,

          message:
            "Employé introuvable.",
        });
      }


      await prisma.employee.delete({
        where: {
          id,
        },
      });


      return res.json({
        success: true,

        message:
          "Employé supprimé.",
      });
    } catch (error) {
      console.error(
        "Erreur suppression employé :",
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