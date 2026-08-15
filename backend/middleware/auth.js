const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "hirebuilders-dev-secret";

const COOKIE_NAME =
  "hirebuilders_token";

function getTokenFromRequest(req) {
  const cookieHeader =
    req.headers.cookie;

  if (!cookieHeader) {
    return null;
  }

  const cookies = {};

  cookieHeader
    .split(";")
    .forEach((part) => {
      const separator =
        part.indexOf("=");

      if (separator === -1) {
        return;
      }

      const name =
        part
          .slice(0, separator)
          .trim();

      const value =
        part
          .slice(separator + 1)
          .trim();

      cookies[name] =
        decodeURIComponent(value);
    });

  return cookies[COOKIE_NAME] || null;
}

function auth(req, res, next) {
  try {
    const token =
      getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Non connecté.",
      });
    }

    const decoded =
      jwt.verify(
        token,
        JWT_SECRET
      );

    req.user = decoded;

    next();
  } catch (error) {
    console.error(
      "Erreur auth middleware :",
      error
    );

    return res.status(401).json({
      success: false,
      message:
        "Session invalide ou expirée.",
    });
  }
}

module.exports = auth;