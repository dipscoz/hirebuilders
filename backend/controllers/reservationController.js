const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


// =========================================================
// CRÉER UNE RÉSERVATION
// =========================================================

exports.createReservation = async (
  req,
  res
) => {
  try {
    const {
      clientName,
      phone,
      startDate,
      endDate,
      message,
      employeeId,
    } = req.body;

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
          "Tous les champs obligatoires doivent être remplis.",
      });
    }

    const parsedEmployeeId =
      Number(employeeId);

    if (
      !Number.isInteger(
        parsedEmployeeId
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Employé invalide.",
      });
    }

    const employee =
      await prisma.employee.findUnique({
        where: {
          id: parsedEmployeeId,
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
      !employee.available ||
      employee.status !== "active"
    ) {
      return res.status(409).json({
        success: false,
        message:
          "Cet employé n'est pas disponible.",
      });
    }

    const reservation =
      await prisma.reservation.create({
        data: {
          clientName:
            clientName.trim(),

          phone:
            phone.trim(),

          startDate:
            startDate.trim(),

          endDate:
            endDate.trim(),

          message:
            message
              ? message.trim()
              : null,

          employeeId:
            parsedEmployeeId,

          status:
            "pending",
        },
      });

    return res.status(201).json({
      success: true,

      message:
        "Demande envoyée à HireBuilders.",

      reservation: {
        id: reservation.id,
        clientName:
          reservation.clientName,
        startDate:
          reservation.startDate,
        endDate:
          reservation.endDate,
        message:
          reservation.message,
        employeeId:
          reservation.employeeId,
        status:
          reservation.status,
        createdAt:
          reservation.createdAt,
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
};


// =========================================================
// RÉCUPÉRER LES RÉSERVATIONS ADMIN
// =========================================================

exports.getReservations = async (
  req,
  res
) => {
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

    const result =
      reservations.map(
        (reservation) => ({
          id: reservation.id,

          clientName:
            reservation.clientName,

          clientPhone:
            reservation.phone,

          startDate:
            reservation.startDate,

          endDate:
            reservation.endDate,

          message:
            reservation.message,

          status:
            reservation.status,

          employeeId:
            reservation.employeeId,

          employee:
            reservation.employee
              ? {
                  id:
                    reservation.employee.id,

                  name:
                    reservation.employee.name,

                  phone:
                    reservation.employee.phone,

                  job:
                    reservation.employee.job,

                  city:
                    reservation.employee.city,

                  experience:
                    reservation.employee
                      .experience,

                  available:
                    reservation.employee
                      .available,

                  status:
                    reservation.employee
                      .status,
                }
              : null,

          createdAt:
            reservation.createdAt,
        })
      );

    return res.json(result);
  } catch (error) {
    console.error(
      "Erreur récupération réservations :",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Impossible de récupérer les réservations.",
    });
  }
};