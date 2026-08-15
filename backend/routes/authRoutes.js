const express = require("express");

const {
  register,
  login,
  googleLogin,
  googleCallback,
  me,
  logout,
} = require("../controllers/authController");

const router =
  express.Router();


// =========================================================
// INSCRIPTION
// =========================================================

router.post(
  "/register",
  register
);


// =========================================================
// CONNEXION
// =========================================================

router.post(
  "/login",
  login
);


// =========================================================
// GOOGLE
// =========================================================

router.get(
  "/google",
  googleLogin
);

router.get(
  "/google/callback",
  googleCallback
);


// =========================================================
// SESSION
// =========================================================

router.get(
  "/me",
  me
);


// =========================================================
// DECONNEXION
// =========================================================

router.post(
  "/logout",
  logout
);


module.exports = router;