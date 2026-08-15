const express = require("express");

const adminAuth = require("../middleware/adminAuth");

const {
  getEmployees,
  getEmployeeById,
  getAdminEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

const router = express.Router();

// =========================================================
// PUBLIC
// =========================================================

// Liste publique
// IMPORTANT : aucun téléphone
router.get(
  "/",
  getEmployees
);

// Profil public d'un employé
// IMPORTANT : aucun téléphone
router.get(
  "/:id",
  getEmployeeById
);

// =========================================================
// ADMIN
// =========================================================

// Liste complète avec téléphone
router.get(
  "/admin/all",
  adminAuth,
  getAdminEmployees
);

// Ajouter
router.post(
  "/",
  adminAuth,
  createEmployee
);

// Modifier
router.put(
  "/:id",
  adminAuth,
  updateEmployee
);

// Supprimer
router.delete(
  "/:id",
  adminAuth,
  deleteEmployee
);

module.exports = router;