const jwt = require("jsonwebtoken");

const JWT_SECRET = require("../config/jwt");

const COOKIE_NAME =
  "hirebuilders_token";

function getTokenFromRequest(req) {
  const authorization = req.headers?.authorization;
  if (typeof authorization === "string" && authorization.startsWith("Bearer ")) {
    const bearer = authorization.slice(7).trim();
    if (bearer) return bearer;
  }

  if (req.cookies?.[COOKIE_NAME]) {
    return req.cookies[COOKIE_NAME];
  }

  const cookieHeader = req.headers?.cookie;
  if (!cookieHeader) return null;

  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));

  if (!cookie) return null;

  const value = cookie.slice(COOKIE_NAME.length + 1);
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
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