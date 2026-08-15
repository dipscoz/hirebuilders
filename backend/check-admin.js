require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: "dipscoz@gmail.com",
      },
    });

    if (!user) {
      console.log("COMPTE INTROUVABLE");
      return;
    }

    console.log("================================");
    console.log("COMPTE TROUVE");
    console.log("================================");
    console.log("ID :", user.id);
    console.log("Prénom :", user.firstName);
    console.log("Nom :", user.lastName);
    console.log("Email :", user.email);
    console.log("Rôle :", user.role);
    console.log("================================");
  } catch (error) {
    console.error("ERREUR :", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();