require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();


// =========================================================
// CONFIGURATION
// =========================================================

const PORT =
  process.env.PORT || 5000;

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  "http://localhost:3000";


// =========================================================
// CORS
// =========================================================

const allowedOrigins = [
  "http://localhost:3000",
  "https://hirebuilders-tn8k.vercel.app",
  FRONTEND_URL,
].filter(Boolean);


// Supprimer les doublons.
const uniqueOrigins = [
  ...new Set(allowedOrigins),
];


app.use(
  cors({
    origin(origin, callback) {
      // Autoriser les requêtes sans Origin
      // (curl, certains outils backend, etc.).
      if (!origin) {
        return callback(null, true);
      }

      if (
        uniqueOrigins.includes(
          origin
        )
      ) {
        return callback(
          null,
          true
        );
      }

      console.warn(
        "Origine CORS refusée :",
        origin
      );

      return callback(
        new Error(
          "Origine non autorisée par CORS."
        )
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);


// =========================================================
// EXPRESS BODY
// =========================================================

app.use(
  express.json({
    limit: "2mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "2mb",
  })
);


// =========================================================
// COOKIE PARSER
// =========================================================
//
// INDISPENSABLE POUR req.cookies.hirebuilders_token
//

app.use(
  cookieParser()
);


// =========================================================
// ROUTES
// =========================================================

const authRoutes =
  require("./routes/authRoutes");

const employeesRoutes =
  require("./routes/employees");

const employeeApprovalRoutes =
  require(
    "./routes/employeeApprovalRoutes"
  );

const employeeApplicationRoutes =
  require(
    "./routes/employeeApplicationRoutes"
  );

const reservationsRoutes =
  require(
    "./routes/reservationRoutes"
  );

const notificationRoutes =
  require(
    "./routes/notificationRoutes"
  );

const messageRoutes =
  require(
    "./routes/messageRoutes"
  );


// =========================================================
// MONTAGE DES ROUTES
// =========================================================

// Authentification
app.use(
  "/api/auth",
  authRoutes
);


// Employés publics / administration
app.use(
  "/api/employees",
  employeesRoutes
);


// Approbation des employés par l'admin
app.use(
  "/api/employees",
  employeeApprovalRoutes
);


// Candidature pour devenir employé
app.use(
  "/api/employee-applications",
  employeeApplicationRoutes
);


// Réservations
app.use(
  "/api/reservations",
  reservationsRoutes
);


// Notifications
app.use(
  "/api/notifications",
  notificationRoutes
);


// Messagerie
app.use(
  "/api/messages",
  messageRoutes
);


// =========================================================
// ROUTE RACINE
// =========================================================

app.get(
  "/",
  (req, res) => {
    return res.status(200).json({
      success: true,

      message:
        "API HireBuilders fonctionne 🚀",
    });
  }
);


// =========================================================
// HEALTH CHECK
// =========================================================

app.get(
  "/api/health",
  (req, res) => {
    return res.status(200).json({
      success: true,

      message:
        "Serveur HireBuilders opérationnel.",

      port:
        String(PORT),

      frontend:
        FRONTEND_URL,
    });
  }
);


// =========================================================
// TEST SESSION
// =========================================================
//
// Utile pour vérifier que cookie-parser fonctionne.
// Ne remplace pas /api/auth/me.
//

app.get(
  "/api/debug/session",
  (req, res) => {
    const token =
      req.cookies
        ?.hirebuilders_token ||
      null;

    return res.json({
      success: true,

      hasCookie:
        Boolean(token),

      cookieName:
        "hirebuilders_token",
    });
  }
);


// =========================================================
// 404
// =========================================================

app.use(
  (req, res) => {
    return res.status(404).json({
      success: false,

      message:
        `Route introuvable : ${req.method} ${req.originalUrl}`,
    });
  }
);


// =========================================================
// ERREUR GLOBALE
// =========================================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(
      "Erreur serveur :",
      error
    );

    if (
      res.headersSent
    ) {
      return next(error);
    }

    return res.status(500).json({
      success: false,

      message:
        "Erreur interne du serveur.",
    });
  }
);


// =========================================================
// DEMARRAGE
// =========================================================

const server =
  app.listen(
    PORT,
    "0.0.0.0",
    () => {

      console.log("");

      console.log(
        "======================================"
      );

      console.log(
        "🚀 SERVEUR HIREBUILDERS"
      );

      console.log(
        "======================================"
      );

      console.log(
        `📡 Port : ${PORT}`
      );

      console.log(
        `🌐 Frontend : ${FRONTEND_URL}`
      );

      console.log("");

      console.log(
        "CORS autorisés :"
      );

      uniqueOrigins.forEach(
        (origin) => {
          console.log(
            `  - ${origin}`
          );
        }
      );

      console.log("");

      console.log(
        "Routes disponibles :"
      );

      console.log(
        "  GET  /"
      );

      console.log(
        "  GET  /api/health"
      );

      console.log(
        "  GET  /api/debug/session"
      );

      console.log(
        "  /api/auth"
      );

      console.log(
        "  /api/employees"
      );

      console.log(
        "  /api/employee-applications"
      );

      console.log(
        "  /api/reservations"
      );

      console.log(
        "  /api/notifications"
      );

      console.log(
        "  /api/messages"
      );

      console.log(
        "======================================"
      );

      console.log("");
    }
  );


// =========================================================
// ARRET PROPRE
// =========================================================

function shutdown(
  signal
) {
  console.log(
    `\n${signal} reçu.`
  );

  server.close(
    () => {

      console.log(
        "Serveur HireBuilders arrêté."
      );

      process.exit(0);
    }
  );

  setTimeout(
    () => {

      console.error(
        "Arrêt forcé du serveur."
      );

      process.exit(1);
    },
    5000
  );
}


process.on(
  "SIGINT",
  () =>
    shutdown("SIGINT")
);

process.on(
  "SIGTERM",
  () =>
    shutdown("SIGTERM")
);