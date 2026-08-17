const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { google } = require("googleapis");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "hirebuilders-dev-secret";

const ADMIN_EMAILS = [
  "dipscoz@gmail.com",
  "ndeyebirametall50@gmail.com",
];

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  "http://localhost:3000";

const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID;

const GOOGLE_CLIENT_SECRET =
  process.env.GOOGLE_CLIENT_SECRET;

const GOOGLE_REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI ||
  "http://localhost:5000/api/auth/google/callback";

const googleOAuth2Client =
  new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

function isAdminEmail(email) {
  return ADMIN_EMAILS.includes(
    normalizeEmail(email)
  );
}

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

function getPublicUser(user) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone || "",
    role: user.role,
  };
}

function setAuthCookie(res, token) {
  res.cookie(
    "hirebuilders_token",
    token,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite:
        process.env.NODE_ENV ===
        "production"
          ? "none"
          : "lax",
      maxAge:
        7 *
        24 *
        60 *
        60 *
        1000,
      path: "/",
    }
  );
}


// =========================================================
// INSCRIPTION
// =========================================================

async function register(req, res) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Tous les champs sont obligatoires.",
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Le mot de passe doit contenir au moins 6 caractères.",
      });
    }

    const normalizedEmail =
      normalizeEmail(email);

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email: normalizedEmail,
        },
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "Un compte existe déjà avec cette adresse email.",
      });
    }

    const passwordHash =
      await bcrypt.hash(
        password,
        12
      );

    const role =
      isAdminEmail(normalizedEmail)
        ? "admin"
        : "user";

    const user =
      await prisma.user.create({
        data: {
          firstName:
            String(firstName).trim(),
          lastName:
            String(lastName).trim(),
          email:
            normalizedEmail,
          phone:
            String(phone).trim(),
          passwordHash,
          role,
        },
      });

    const token =
      createToken(user);

    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      message:
        "Compte créé avec succès.",
      token,
      user:
        getPublicUser(user),
      redirect:
        role === "admin"
          ? "/admin"
          : "/",
    });
  } catch (error) {
    console.error(
      "Erreur inscription :",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Impossible de créer le compte.",
    });
  }
}


// =========================================================
// CONNEXION
// =========================================================

async function login(req, res) {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email et mot de passe obligatoires.",
      });
    }

    const normalizedEmail =
      normalizeEmail(email);

    const user =
      await prisma.user.findUnique({
        where: {
          email: normalizedEmail,
        },
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Email ou mot de passe incorrect.",
      });
    }

    const valid =
      await bcrypt.compare(
        password,
        user.passwordHash
      );

    if (!valid) {
      return res.status(401).json({
        success: false,
        message:
          "Email ou mot de passe incorrect.",
      });
    }

    let role =
      user.role;

    if (
      isAdminEmail(
        normalizedEmail
      )
    ) {
      role = "admin";

      if (user.role !== "admin") {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            role: "admin",
          },
        });
      }
    }

    const loggedUser = {
      ...user,
      role,
    };

    const token =
      createToken(loggedUser);

    setAuthCookie(res, token);

    return res.json({
      success: true,
      message:
        "Connexion réussie.",
      token,
      user:
        getPublicUser(
          loggedUser
        ),
      redirect:
        role === "admin"
          ? "/admin"
          : "/",
    });
  } catch (error) {
    console.error(
      "Erreur connexion :",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Impossible de se connecter.",
    });
  }
}


// =========================================================
// GOOGLE LOGIN
// =========================================================

function googleLogin(req, res) {
  try {
    if (
      !GOOGLE_CLIENT_ID ||
      !GOOGLE_CLIENT_SECRET
    ) {
      return res
        .status(500)
        .send(
          "Google OAuth n'est pas configuré."
        );
    }

    const url =
      googleOAuth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "select_account",
        scope: [
          "openid",
          "email",
          "profile",
        ],
      });

    return res.redirect(url);
  } catch (error) {
    console.error(
      "Erreur Google OAuth :",
      error
    );

    return res
      .status(500)
      .send(
        "Impossible de démarrer Google."
      );
  }
}


// =========================================================
// GOOGLE CALLBACK
// =========================================================

async function googleCallback(
  req,
  res
) {
  try {
    const code =
      req.query.code;

    if (!code) {
      return res.redirect(
        `${FRONTEND_URL}/connexion?error=google_cancelled`
      );
    }

    const { tokens } =
      await googleOAuth2Client.getToken(
        code
      );

    googleOAuth2Client.setCredentials(
      tokens
    );

    const oauth2 =
      google.oauth2({
        auth:
          googleOAuth2Client,
        version: "v2",
      });

    const {
      data: googleUser,
    } =
      await oauth2.userinfo.get();

    const googleEmail =
      normalizeEmail(
        googleUser.email
      );

    if (
      !googleEmail ||
      googleUser.verified_email !== true
    ) {
      return res.redirect(
        `${FRONTEND_URL}/connexion?error=google_email_not_verified`
      );
    }

    let user =
      await prisma.user.findUnique({
        where: {
          email: googleEmail,
        },
      });

    if (!user) {
      const randomPassword =
        crypto
          .randomBytes(32)
          .toString("hex");

      const passwordHash =
        await bcrypt.hash(
          randomPassword,
          12
        );

      const role =
        isAdminEmail(
          googleEmail
        )
          ? "admin"
          : "user";

      user =
        await prisma.user.create({
          data: {
            firstName:
              String(
                googleUser.given_name ||
                  "Utilisateur"
              ).trim(),

            lastName:
              String(
                googleUser.family_name ||
                  "Google"
              ).trim(),

            email:
              googleEmail,

            phone: "",

            passwordHash,

            role,
          },
        });
    } else if (
      isAdminEmail(
        googleEmail
      ) &&
      user.role !== "admin"
    ) {
      user =
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            role: "admin",
          },
        });
    }

    const token =
      createToken(user);

    setAuthCookie(
      res,
      token
    );

    return res.redirect(
      `${FRONTEND_URL}${
        user.role === "admin"
          ? "/admin"
          : "/"
      }`
    );
  } catch (error) {
    console.error(
      "Erreur callback Google :",
      error
    );

    return res.redirect(
      `${FRONTEND_URL}/connexion?error=google_login_failed`
    );
  }
}


// =========================================================
// UTILISATEUR CONNECTE
// =========================================================

async function me(req, res) {
  try {
    let token =
      req.cookies
        ?.hirebuilders_token;

    if (!token) {
      const authorization =
        req.headers.authorization;

      if (
        authorization &&
        authorization.startsWith(
          "Bearer "
        )
      ) {
        token =
          authorization.slice(7);
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Non connecté.",
      });
    }

    const decoded =
      jwt.verify(
        token,
        JWT_SECRET
      );

    const user =
      await prisma.user.findUnique({
        where: {
          id: Number(
            decoded.id
          ),
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Utilisateur introuvable.",
      });
    }

    const role =
      isAdminEmail(
        user.email
      )
        ? "admin"
        : user.role;

    if (
      role === "admin" &&
      user.role !== "admin"
    ) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          role: "admin",
        },
      });
    }

    return res.json({
      success: true,
      user: {
        ...user,
        role,
      },
    });
  } catch (error) {
    console.error(
      "Erreur session :",
      error
    );

    return res.status(401).json({
      success: false,
      message:
        "Session invalide.",
    });
  }
}


// =========================================================
// LOGOUT
// =========================================================

async function logout(
  req,
  res
) {
  res.clearCookie(
    "hirebuilders_token",
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite:
        process.env.NODE_ENV ===
        "production"
          ? "none"
          : "lax",
      path: "/",
    }
  );

  return res.json({
    success: true,
    message:
      "Déconnexion réussie.",
  });
}


module.exports = {
  register,
  login,
  googleLogin,
  googleCallback,
  me,
  logout,
};