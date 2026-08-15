const express = require("express");
const { PrismaClient } = require("@prisma/client");

const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

const prisma = new PrismaClient();


// =========================================================
// ADMIN : EMPLOYES EN ATTENTE
// =========================================================

router.get(
  "/pending",
  adminAuth,
  async (req, res) => {
    try {
      const employees =
        await prisma.employee.findMany({
          where: {
            status: "pending",
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
        "Erreur employés en attente :",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Impossible de charger les employés en attente.",
      });
    }
  }
);


// =========================================================
// ADMIN : APPROUVER
// =========================================================

router.put(
  "/:id/approve",
  adminAuth,
  async (req, res) => {
    try {
      const id =
        Number(req.params.id);

      if (!Number.isInteger(id)) {
        return res.status(400).json({
          success: false,
          message:
            "Identifiant employé invalide.",
        });
      }

      const employee =
        await prisma.employee.findUnique({
          where: {
            id,
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
        employee.status === "active"
      ) {
        return res.json({
          success: true,
          message:
            "Cet employé est déjà approuvé.",
          employee,
        });
      }

      const updatedEmployee =
        await prisma.employee.update({
          where: {
            id,
          },

          data: {
            status: "active",
            available: true,
          },
        });

      return res.json({
        success: true,

        message:
          "Employé approuvé avec succès.",

        employee:
          updatedEmployee,
      });
    } catch (error) {
      console.error(
        "Erreur approbation employé :",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Impossible d'approuver cet employé.",
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

      if (!Number.isInteger(id)) {
        return res.status(400).json({
          success: false,
          message:
            "Identifiant employé invalide.",
        });
      }

      const employee =
        await prisma.employee.findUnique({
          where: {
            id,
          },
        });

      if (!employee) {
        return res.status(404).json({
          success: false,
          message:
            "Employé introuvable.",
        });
      }

      const updatedEmployee =
        await prisma.employee.update({
          where: {
            id,
          },

          data: {
            status: "rejected",
            available: false,
          },
        });

      return res.json({
        success: true,

        message:
          "Employé refusé.",

        employee:
          updatedEmployee,
      });
    } catch (error) {
      console.error(
        "Erreur refus employé :",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Impossible de refuser cet employé.",
      });
    }
  }
);


// =========================================================
// ADMIN : REACTIVER UN EMPLOYE REFUSE
// =========================================================

router.put(
  "/:id/reactivate",
  adminAuth,
  async (req, res) => {
    try {
      const id =
        Number(req.params.id);

      if (!Number.isInteger(id)) {
        return res.status(400).json({
          success: false,
          message:
            "Identifiant employé invalide.",
        });
      }

      const employee =
        await prisma.employee.findUnique({
          where: {
            id,
          },
        });

      if (!employee) {
        return res.status(404).json({
          success: false,
          message:
            "Employé introuvable.",
        });
      }

      const updatedEmployee =
        await prisma.employee.update({
          where: {
            id,
          },

          data: {
            status: "active",
            available: true,
          },
        });

      return res.json({
        success: true,

        message:
          "Employé réactivé.",

        employee:
          updatedEmployee,
      });
    } catch (error) {
      console.error(
        "Erreur réactivation employé :",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Impossible de réactiver cet employé.",
      });
    }
  }
);


module.exports = router;