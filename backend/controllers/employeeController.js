const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/*
  Fonction utilitaire :
  données PUBLIQUES d'un employé.

  IMPORTANT :
  phone n'est volontairement PAS envoyé.
*/

function publicEmployee(employee) {
  return {
    id: employee.id,
    name: employee.name,
    job: employee.job,
    city: employee.city,
    experience: employee.experience,
    available: employee.available,
    status: employee.status,
    createdAt: employee.createdAt,
  };
}

/*
  Données ADMIN :
  le téléphone est autorisé ici.
*/

function adminEmployee(employee) {
  return {
    id: employee.id,
    name: employee.name,
    phone: employee.phone,
    job: employee.job,
    city: employee.city,
    experience: employee.experience,
    available: employee.available,
    status: employee.status,
    createdAt: employee.createdAt,
  };
}

// =========================================================
// PUBLIC - LISTE EMPLOYÉS
// =========================================================

async function getEmployees(req, res) {
  try {
    const employees =
      await prisma.employee.findMany({
        where: {
          status: "active",
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return res.json(
      employees.map(publicEmployee)
    );
  } catch (error) {
    console.error(
      "Erreur récupération employés :",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Impossible de récupérer les employés.",
    });
  }
}

// =========================================================
// PUBLIC - UN EMPLOYÉ
// =========================================================

async function getEmployeeById(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "ID employé invalide.",
      });
    }

    const employee =
      await prisma.employee.findFirst({
        where: {
          id,
          status: "active",
        },
      });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employé introuvable.",
      });
    }

    return res.json(
      publicEmployee(employee)
    );
  } catch (error) {
    console.error(
      "Erreur récupération employé :",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Impossible de récupérer cet employé.",
    });
  }
}

// =========================================================
// ADMIN - TOUS LES EMPLOYÉS
// =========================================================

async function getAdminEmployees(req, res) {
  try {
    const employees =
      await prisma.employee.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    return res.json(
      employees.map(adminEmployee)
    );
  } catch (error) {
    console.error(
      "Erreur récupération employés admin :",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Impossible de récupérer les employés.",
    });
  }
}

// =========================================================
// ADMIN - CRÉER
// =========================================================

async function createEmployee(req, res) {
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
          name: name.trim(),
          phone: phone.trim(),
          job: job.trim(),
          city: city.trim(),
          experience: experience.trim(),
          available: true,
          status: "active",
        },
      });

    return res.status(201).json({
      success: true,
      message:
        "Employé ajouté avec succès.",
      employee:
        adminEmployee(employee),
    });
  } catch (error) {
    console.error(
      "Erreur création employé :",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Impossible de créer l'employé.",
    });
  }
}

// =========================================================
// ADMIN - MODIFIER
// =========================================================

async function updateEmployee(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "ID employé invalide.",
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
        message: "Employé introuvable.",
      });
    }

    const employee =
      await prisma.employee.update({
        where: {
          id,
        },

        data: {
          ...(name !== undefined && {
            name: name.trim(),
          }),

          ...(phone !== undefined && {
            phone: phone.trim(),
          }),

          ...(job !== undefined && {
            job: job.trim(),
          }),

          ...(city !== undefined && {
            city: city.trim(),
          }),

          ...(experience !== undefined && {
            experience: experience.trim(),
          }),

          ...(available !== undefined && {
            available: Boolean(available),
          }),

          ...(status !== undefined && {
            status,
          }),
        },
      });

    return res.json({
      success: true,
      message:
        "Employé modifié avec succès.",
      employee:
        adminEmployee(employee),
    });
  } catch (error) {
    console.error(
      "Erreur modification employé :",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Impossible de modifier l'employé.",
    });
  }
}

// =========================================================
// ADMIN - SUPPRIMER
// =========================================================

async function deleteEmployee(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "ID employé invalide.",
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
        message: "Employé introuvable.",
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
        "Employé supprimé avec succès.",
    });
  } catch (error) {
    console.error(
      "Erreur suppression employé :",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Impossible de supprimer l'employé.",
    });
  }
}

module.exports = {
  getEmployees,
  getEmployeeById,
  getAdminEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};