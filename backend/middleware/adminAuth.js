const jwt = require("jsonwebtoken");

// =========================================================
// CONFIGURATION
// =========================================================

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "hirebuilders-dev-secret";

const ADMIN_EMAILS = [
  "dipscoz@gmail.com",
  "ndeyebirametall50@gmail.com",
];


// =========================================================
// NORMALISER EMAIL
// =========================================================

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}


// =========================================================
// VERIFIER ADMIN
// =========================================================

function isAdmin(user) {
  if (!user) {
    return false;
  }

  const email =
    normalizeEmail(user.email);

  const role =
    String(user.role || "")
      .trim()
      .toLowerCase();

  return (
    role === "admin" ||
    ADMIN_EMAILS.includes(email)
  );
}


// =========================================================
// MIDDLEWARE ADMIN
// =========================================================

function adminAuth(req, res, next) {
  try {
    const token =
      req.cookies?.hirebuilders_token;

    // -------------------------------------------------------
    // PAS DE COOKIE
    // -------------------------------------------------------

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Authentification requise.",
      });
    }

    // -------------------------------------------------------
    // VERIFICATION JWT
    // -------------------------------------------------------

    const decoded =
      jwt.verify(
        token,
        JWT_SECRET
      );

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message:
          "Session invalide.",
      });
    }

    // -------------------------------------------------------
    // VERIFICATION ADMIN
    // -------------------------------------------------------

    if (!isAdmin(decoded)) {
      return res.status(403).json({
        success: false,
        message:
          "Accès administrateur refusé.",
      });
    }

    // -------------------------------------------------------
    // STOCKER L'UTILISATEUR
    // -------------------------------------------------------

    req.user = {
      id:
        Number(decoded.id),

      email:
        normalizeEmail(
          decoded.email
        ),

      role:
        "admin",

      firstName:
        decoded.firstName || "",

      lastName:
        decoded.lastName || "",
    };

    next();
  } catch (error) {
    console.error(
      "Erreur adminAuth :",
      error
    );

    return res.status(401).json({
      success: false,
      message:
        "Session administrateur invalide.",
    });
  }
}


module.exports = adminAuth;